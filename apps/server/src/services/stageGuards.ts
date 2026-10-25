import mongoose from "mongoose";
import { CaseStage } from "@akeezo/contracts";
import {
  CaseModel,
  PatientModel,
  DocumentRecordModel,
  ConsentModel,
  QuoteRequestModel,
  QuoteModel,
  VisaRecordModel,
  TravelRecordModel,
  AppointmentModel,
  EpisodeModel,
  CommissionRecordModel,
} from "../db/models/index.js";

export interface StageGuardCheck {
  field: string;
  guard: string;
  passed: boolean;
  message: string;
}

export interface CaseReadinessEvaluation {
  caseId: string;
  currentStage: CaseStage;
  targetStage: CaseStage;
  isReady: boolean;
  guards: StageGuardCheck[];
}

export async function evaluateStageGuards(
  caseId: string | mongoose.Types.ObjectId,
  toStage: CaseStage
): Promise<CaseReadinessEvaluation> {
  const caseDoc = await CaseModel.findById(caseId).populate("patientId");
  if (!caseDoc) {
    throw new Error("Case not found");
  }

  const patient = caseDoc.patientId as any;
  const guards: StageGuardCheck[] = [];

  switch (toStage) {
    case "under_review": {
      guards.push({
        field: "ownerId",
        guard: "owner_assigned",
        passed: Boolean(caseDoc.ownerId),
        message: "An assigned case owner is required.",
      });
      break;
    }

    case "quotes_requested": {
      // 1. Patient name, specialty and diagnosis summary filled
      const hasClinicalData = Boolean(
        patient?.fullName && caseDoc.specialty && caseDoc.diagnosisSummary
      );
      guards.push({
        field: "clinicalData",
        guard: "clinical_data_complete",
        passed: hasClinicalData,
        message: "Patient name, specialty, and diagnosis summary must be filled.",
      });

      // 2. Partner set or source is direct
      const hasValidSource = Boolean(caseDoc.partnerId || caseDoc.source === "direct_family");
      guards.push({
        field: "partnerId",
        guard: "partner_or_direct_set",
        passed: hasValidSource,
        message: "Partner must be set unless case source is direct family.",
      });

      // 3. At least one document of type medical_report or imaging
      const medicalDocCount = await DocumentRecordModel.countDocuments({
        caseId: caseDoc._id,
        docType: { $in: ["medical_report", "imaging"] },
      });
      guards.push({
        field: "documents",
        guard: "medical_report_required",
        passed: medicalDocCount > 0,
        message: "Add at least one medical report or imaging study before requesting quotes.",
      });

      // 4. Consent share_with_hospital recorded
      const hospitalConsent = await ConsentModel.findOne({
        caseId: caseDoc._id,
        purpose: "share_with_hospital",
        withdrawnOn: { $exists: false },
      });
      guards.push({
        field: "consent",
        guard: "hospital_share_consent_required",
        passed: Boolean(hospitalConsent),
        message: "Patient consent to share records with hospitals must be recorded.",
      });

      // 5. Quote request with at least one hospital recipient created
      const quoteRequestCount = await QuoteRequestModel.countDocuments({
        caseId: caseDoc._id,
        status: "open",
      });
      guards.push({
        field: "quoteRequest",
        guard: "rfq_created_required",
        passed: quoteRequestCount > 0,
        message: "Create a quote request with at least one hospital.",
      });
      break;
    }

    case "quotes_shared": {
      // At least one quote received and at least one marked as shared with partner
      const receivedQuoteCount = await QuoteModel.countDocuments({
        caseId: caseDoc._id,
      });
      const sharedQuoteCount = await QuoteModel.countDocuments({
        caseId: caseDoc._id,
        sharedWithPartnerAt: { $exists: true, $ne: null },
      });
      guards.push({
        field: "quotesReceived",
        guard: "quote_received_required",
        passed: receivedQuoteCount > 0,
        message: "At least one hospital quote must be logged.",
      });
      guards.push({
        field: "quotesShared",
        guard: "quote_marked_shared_required",
        passed: sharedQuoteCount > 0,
        message: "At least one quote must be marked as shared with the partner.",
      });
      break;
    }

    case "partner_decision": {
      const sharedQuoteCount = await QuoteModel.countDocuments({
        caseId: caseDoc._id,
        sharedWithPartnerAt: { $exists: true, $ne: null },
      });
      guards.push({
        field: "quotesShared",
        guard: "quotes_shared_with_partner",
        passed: sharedQuoteCount > 0,
        message: "Quotes must be sent to the partner before recording their decision.",
      });
      break;
    }

    case "visa_travel": {
      // Exactly one initial quote selected
      const selectedQuotes = await QuoteModel.countDocuments({
        caseId: caseDoc._id,
        isSelected: true,
      });
      guards.push({
        field: "quoteSelection",
        guard: "single_quote_selected",
        passed: selectedQuotes === 1,
        message: "Exactly one quote must be selected by the partner.",
      });
      break;
    }

    case "arrival": {
      // Visa approved (unless patient in India) and inbound travel record with arrival date
      if (!caseDoc.patientInIndia) {
        const approvedVisa = await VisaRecordModel.findOne({
          caseId: caseDoc._id,
          status: "approved",
        });
        guards.push({
          field: "visaRecord",
          guard: "visa_approved",
          passed: Boolean(approvedVisa),
          message: "Approved medical visa is required.",
        });
      }

      const inboundTravel = await TravelRecordModel.findOne({
        caseId: caseDoc._id,
        direction: "inbound",
        arriveAt: { $exists: true, $ne: null },
      });
      guards.push({
        field: "travelRecord",
        guard: "inbound_arrival_date_set",
        passed: Boolean(inboundTravel),
        message: "Inbound travel record with confirmed arrival date is required.",
      });
      break;
    }

    case "consultation": {
      // Arrival confirmed and appointment scheduled
      const scheduledAppointment = await AppointmentModel.findOne({
        caseId: caseDoc._id,
        status: { $in: ["scheduled", "completed"] },
      });
      guards.push({
        field: "appointment",
        guard: "consultation_scheduled",
        passed: Boolean(scheduledAppointment),
        message: "A consultation or screening appointment must be scheduled.",
      });
      break;
    }

    case "final_quotation": {
      // Appointment marked completed with outcome notes
      const completedAppointment = await AppointmentModel.findOne({
        caseId: caseDoc._id,
        status: "completed",
        outcomeNotes: { $exists: true, $ne: "" },
      });
      guards.push({
        field: "appointment",
        guard: "consultation_outcome_recorded",
        passed: Boolean(completedAppointment),
        message: "Consultation appointment must be marked completed with outcome notes.",
      });
      break;
    }

    case "mapped": {
      // Final quote recorded and accepted
      const finalQuote = await QuoteModel.findOne({
        caseId: caseDoc._id,
        quoteType: "final",
      });
      guards.push({
        field: "finalQuote",
        guard: "final_quote_recorded",
        passed: Boolean(finalQuote),
        message: "Hospital final quotation and treatment plan must be recorded.",
      });
      break;
    }

    case "in_treatment": {
      // At least one active episode exists
      const activeEpisode = await EpisodeModel.findOne({
        caseId: caseDoc._id,
        status: "active",
      });
      guards.push({
        field: "episode",
        guard: "active_episode_required",
        passed: Boolean(activeEpisode),
        message: "At least one episode must be in active status to enter treatment.",
      });
      break;
    }

    case "treatment_completed": {
      // No episodes remain planned, active or paused
      const unfinishedEpisodes = await EpisodeModel.countDocuments({
        caseId: caseDoc._id,
        status: { $in: ["planned", "active", "paused"] },
      });
      guards.push({
        field: "episodes",
        guard: "all_episodes_finished",
        passed: unfinishedEpisodes === 0,
        message: "All treatment episodes must be completed or cancelled.",
      });
      break;
    }

    case "settlement": {
      // Every episode has a finalised billed amount
      const unfinalisedBilling = await EpisodeModel.countDocuments({
        caseId: caseDoc._id,
        status: "completed",
        $or: [{ billedAmountMinor: { $exists: false } }, { billedAmountMinor: null }, { billedAmountMinor: 0 }],
      });
      guards.push({
        field: "billing",
        guard: "all_billed_amounts_finalised",
        passed: unfinalisedBilling === 0,
        message: "Every completed episode must have a finalised billed amount.",
      });
      break;
    }

    case "closed": {
      // Case closure reasons and commission check if closed as completed
      if (caseDoc.closedReason === "completed") {
        const unsettledCommissions = await CommissionRecordModel.countDocuments({
          caseId: caseDoc._id,
          status: { $nin: ["paid", "written_off"] },
        });
        guards.push({
          field: "commissions",
          guard: "all_commissions_settled",
          passed: unsettledCommissions === 0,
          message: "All commission records must be paid or written off before closing as completed.",
        });
      }
      break;
    }

    default:
      break;
  }

  const isReady = guards.length === 0 || guards.every((g) => g.passed);

  return {
    caseId: caseDoc._id.toString(),
    currentStage: caseDoc.stage,
    targetStage: toStage,
    isReady,
    guards,
  };
}
