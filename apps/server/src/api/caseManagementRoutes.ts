import { Router, type Request, type Response } from "express";
import mongoose from "mongoose";
import {
  CreateCaseIntakeSchema,
  CaseStageTransitionSchema,
  CreateEpisodeSchema,
  CreateEpisodeSeriesSchema,
  FinaliseEpisodeBillingSchema,
  CreateQuoteRequestSchema,
  LogHospitalQuoteSchema,
  SelectQuoteSchema,
  RecordPaymentSchema,
} from "@akeezo/contracts";
import {
  UserModel,
  PartnerModel,
  PartnerAgreementModel,
  HospitalModel,
  DoctorModel,
  HospitalAgreementModel,
  PatientModel,
  CaseModel,
  CaseStageHistoryModel,
  EpisodeModel,
  EpisodeSeriesModel,
  QuoteRequestModel,
  QuoteRequestRecipientModel,
  QuoteModel,
  CommissionRecordModel,
  CommissionAdjustmentModel,
  PaymentModel,
  PaymentAllocationModel,
  DocumentRecordModel,
  ConsentModel,
  CaseNoteModel,
  CaseTaskModel,
  CaseAuditLogModel,
} from "../db/models/index.js";
import { evaluateStageGuards } from "../services/stageGuards.js";
import {
  calculateAkeezoCommission,
  calculatePartnerShare,
  calculatePartnerPayable,
  deriveCommissionStatus,
} from "../services/commissionEngine.js";
import { findDuplicatePatients } from "../services/duplicatePatient.js";
import { encryptSensitiveField } from "../utils/crypto.js";

export const caseManagementRouter = Router();

// ==========================================
// 1. PATIENT & DUPLICATE DETECTION
// ==========================================

// GET /api/v1/patients/duplicates
caseManagementRouter.get("/patients/duplicates", async (req: Request, res: Response) => {
  try {
    const { name, dob, passport } = req.query;
    const matches = await findDuplicatePatients({
      name: typeof name === "string" ? name : undefined,
      dateOfBirth: typeof dob === "string" ? dob : undefined,
      passportNumber: typeof passport === "string" ? passport : undefined,
    });
    res.json({ data: matches });
  } catch (err: any) {
    res.status(500).json({ error: { code: "DUPLICATE_CHECK_FAILED", message: err.message } });
  }
});

// GET /api/v1/patients
caseManagementRouter.get("/patients", async (req: Request, res: Response) => {
  try {
    const patients = await PatientModel.find().sort({ createdAt: -1 }).limit(50).lean();
    res.json({
      data: patients.map((p) => ({
        ...p,
        passportNumberMasked: p.passportNumberEncrypted ? "***" + p.passportNumberEncrypted.slice(-3) : null,
      })),
    });
  } catch (err: any) {
    res.status(500).json({ error: { code: "FETCH_PATIENTS_FAILED", message: err.message } });
  }
});

// ==========================================
// 2. PARTNERS & AGREEMENTS
// ==========================================

// GET /api/v1/partners
caseManagementRouter.get("/partners", async (_req: Request, res: Response) => {
  try {
    const partners = await PartnerModel.find().sort({ name: 1 }).lean();
    res.json({ data: partners });
  } catch (err: any) {
    res.status(500).json({ error: { code: "FETCH_PARTNERS_FAILED", message: err.message } });
  }
});

// POST /api/v1/partners
caseManagementRouter.post("/partners", async (req: Request, res: Response) => {
  try {
    const count = await PartnerModel.countDocuments();
    const partnerCode = `PTR-${String(count + 1).padStart(4, "0")}`;

    const payoutDetails = req.body.payoutDetails
      ? {
          ...req.body.payoutDetails,
          accountNumberEncrypted: req.body.payoutDetails.accountNumber
            ? encryptSensitiveField(req.body.payoutDetails.accountNumber)
            : undefined,
        }
      : undefined;

    const partner = await PartnerModel.create({
      ...req.body,
      partnerCode,
      payoutDetails,
    });

    res.status(201).json({ data: partner });
  } catch (err: any) {
    res.status(400).json({ error: { code: "CREATE_PARTNER_FAILED", message: err.message } });
  }
});

// POST /api/v1/partners/:id/agreements
caseManagementRouter.post("/partners/:id/agreements", async (req: Request, res: Response) => {
  try {
    const agreement = await PartnerAgreementModel.create({
      ...req.body,
      partnerId: req.params.id,
    });
    res.status(201).json({ data: agreement });
  } catch (err: any) {
    res.status(400).json({ error: { code: "CREATE_AGREEMENT_FAILED", message: err.message } });
  }
});

// GET /api/v1/partners/:id/statement
caseManagementRouter.get("/partners/:id/statement", async (req: Request, res: Response) => {
  try {
    const partnerId = req.params.id;
    const partner = await PartnerModel.findById(partnerId).lean();
    if (!partner) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Partner not found" } });

    const cases = await CaseModel.find({ partnerId }).lean();
    const caseIds = cases.map((c) => c._id);

    const commissionRecords = await CommissionRecordModel.find({ caseId: { $in: caseIds } })
      .populate("episodeId")
      .lean();

    let totalEarnedMinor = 0;
    let totalPaidMinor = 0;
    let totalPayableMinor = 0;
    let totalRecoveryDueMinor = 0;

    for (const rec of commissionRecords) {
      totalEarnedMinor += rec.partnerShareMinor || 0;
      totalPaidMinor += rec.partnerPaidMinor || 0;
      totalPayableMinor += Math.max(0, rec.partnerPayableMinor || 0);
      totalRecoveryDueMinor += rec.recoveryDueMinor || 0;
    }

    res.json({
      data: {
        partner,
        totalCases: cases.length,
        totalEarnedMinor,
        totalPaidMinor,
        totalPayableMinor,
        totalRecoveryDueMinor,
        records: commissionRecords,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: { code: "STATEMENT_FAILED", message: err.message } });
  }
});

// ==========================================
// 3. HOSPITALS & AGREEMENTS
// ==========================================

// GET /api/v1/hospitals
caseManagementRouter.get("/hospitals", async (_req: Request, res: Response) => {
  try {
    const hospitals = await HospitalModel.find().sort({ name: 1 }).lean();
    res.json({ data: hospitals });
  } catch (err: any) {
    res.status(500).json({ error: { code: "FETCH_HOSPITALS_FAILED", message: err.message } });
  }
});

// POST /api/v1/hospitals
caseManagementRouter.post("/hospitals", async (req: Request, res: Response) => {
  try {
    const count = await HospitalModel.countDocuments();
    const hospitalCode = `HSP-${String(count + 1).padStart(4, "0")}`;

    const hospital = await HospitalModel.create({
      ...req.body,
      hospitalCode,
    });
    res.status(201).json({ data: hospital });
  } catch (err: any) {
    res.status(400).json({ error: { code: "CREATE_HOSPITAL_FAILED", message: err.message } });
  }
});

// POST /api/v1/hospitals/:id/agreements
caseManagementRouter.post("/hospitals/:id/agreements", async (req: Request, res: Response) => {
  try {
    const agreement = await HospitalAgreementModel.create({
      ...req.body,
      hospitalId: req.params.id,
    });
    res.status(201).json({ data: agreement });
  } catch (err: any) {
    res.status(400).json({ error: { code: "CREATE_HOSPITAL_AGREEMENT_FAILED", message: err.message } });
  }
});

// POST /api/v1/hospitals/:id/doctors
caseManagementRouter.post("/hospitals/:id/doctors", async (req: Request, res: Response) => {
  try {
    const doctor = await DoctorModel.create({
      ...req.body,
      hospitalId: req.params.id,
    });
    res.status(201).json({ data: doctor });
  } catch (err: any) {
    res.status(400).json({ error: { code: "CREATE_DOCTOR_FAILED", message: err.message } });
  }
});

// ==========================================
// 4. CASES (LIFECYCLE, INTAKE & GUARDS)
// ==========================================

// GET /api/v1/cases
caseManagementRouter.get("/cases", async (req: Request, res: Response) => {
  try {
    const filter: Record<string, any> = {};
    if (req.query.stage) filter.stage = req.query.stage;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.partnerId) filter.partnerId = req.query.partnerId;
    if (req.query.ownerId) filter.ownerId = req.query.ownerId;
    if (req.query.specialty) filter.specialty = req.query.specialty;

    const cases = await CaseModel.find(filter)
      .populate("patientId")
      .populate("partnerId", "name partnerCode")
      .populate("ownerId", "name email")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ data: cases });
  } catch (err: any) {
    res.status(500).json({ error: { code: "FETCH_CASES_FAILED", message: err.message } });
  }
});

// GET /api/v1/cases/board (Pipeline Board)
caseManagementRouter.get("/cases/board", async (_req: Request, res: Response) => {
  try {
    const cases = await CaseModel.find({ status: "open" })
      .populate("patientId", "fullName nationality")
      .populate("partnerId", "name")
      .populate("ownerId", "name")
      .sort({ stageChangedAt: 1 })
      .lean();

    // Group by stage
    const board: Record<string, any[]> = {};
    for (const c of cases) {
      if (!board[c.stage]) board[c.stage] = [];
      const daysInStage = Math.floor(
        (Date.now() - new Date(c.stageChangedAt || c.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      board[c.stage].push({
        ...c,
        daysInStage,
        isStale: daysInStage >= 7,
      });
    }

    res.json({ data: board });
  } catch (err: any) {
    res.status(500).json({ error: { code: "BOARD_FAILED", message: err.message } });
  }
});

// POST /api/v1/cases (Intake)
caseManagementRouter.post("/cases", async (req: Request, res: Response) => {
  try {
    const parsed = CreateCaseIntakeSchema.parse(req.body);

    let patientId: mongoose.Types.ObjectId;

    if (parsed.existingPatientId) {
      patientId = new mongoose.Types.ObjectId(parsed.existingPatientId);
    } else {
      // Create new patient
      const passportEncrypted = parsed.patient.passportNumber
        ? encryptSensitiveField(parsed.patient.passportNumber)
        : undefined;
      const passportHash = parsed.patient.passportNumber
        ? (PatientModel as any).hashPassport(parsed.patient.passportNumber)
        : undefined;

      const newPatient = await PatientModel.create({
        fullName: parsed.patient.fullName,
        dateOfBirth: parsed.patient.dateOfBirth,
        sex: parsed.patient.sex,
        nationality: parsed.patient.nationality,
        countryOfResidence: parsed.patient.countryOfResidence,
        preferredLanguage: parsed.patient.preferredLanguage,
        phone: parsed.patient.phone,
        email: parsed.patient.email,
        passportNumberEncrypted: passportEncrypted,
        passportNumberHash: passportHash,
        passportExpiry: parsed.patient.passportExpiry,
        passportCountry: parsed.patient.passportCountry,
      });
      patientId = newPatient._id;
    }

    // Generate Case Code
    const caseCode = await (CaseModel as any).generateNextCaseCode();

    const newCase = await CaseModel.create({
      caseCode,
      patientId,
      partnerId: parsed.partnerId ? new mongoose.Types.ObjectId(parsed.partnerId) : undefined,
      source: parsed.source,
      caseType: parsed.caseType,
      specialty: parsed.specialty,
      diagnosisSummary: parsed.diagnosisSummary,
      urgency: parsed.urgency,
      preferredCity: parsed.preferredCity,
      budgetMinMinor: parsed.budgetMinMinor,
      budgetMaxMinor: parsed.budgetMaxMinor,
      budgetCurrency: parsed.budgetCurrency,
      patientInIndia: parsed.patientInIndia,
      stage: "new_referral",
      ownerId: new mongoose.Types.ObjectId(parsed.ownerId),
      referredOn: parsed.referredOn ? new Date(parsed.referredOn) : new Date(),
      feeDisclosedToPartner: parsed.feeDisclosedToPartner,
      feeDisclosedOn: parsed.feeDisclosedToPartner ? new Date() : undefined,
    });

    // Record hospital share consent if granted
    if (parsed.consentShareWithHospitals) {
      await ConsentModel.create({
        patientId,
        caseId: newCase._id,
        purpose: "share_with_hospital",
        givenBy: "patient",
      });
    }

    // Record audit entry
    await CaseAuditLogModel.create({
      entityType: "Case",
      entityId: newCase._id,
      caseId: newCase._id,
      action: "create",
      actorId: new mongoose.Types.ObjectId(parsed.ownerId),
      changes: { caseCode: [null, caseCode], stage: [null, "new_referral"] },
    });

    res.status(201).json({ data: newCase });
  } catch (err: any) {
    res.status(400).json({ error: { code: "CREATE_CASE_FAILED", message: err.message } });
  }
});

// GET /api/v1/cases/:id
caseManagementRouter.get("/cases/:id", async (req: Request, res: Response) => {
  try {
    const caseDoc: any = await CaseModel.findById(req.params.id)
      .populate("patientId")
      .populate("partnerId")
      .populate("ownerId", "name email role")
      .lean();

    if (!caseDoc) {
      return res.status(404).json({ error: { code: "NOT_FOUND", message: "Case not found" } });
    }

    const patient = caseDoc.patientId as any;
    if (patient && patient.passportNumberEncrypted) {
      patient.passportNumberMasked = "***" + patient.passportNumberEncrypted.slice(-3);
    }

    const [documents, quotes, episodes, commissionRecords, history, tasks, notes] = await Promise.all([
      DocumentRecordModel.find({ caseId: caseDoc._id }).lean(),
      QuoteModel.find({ caseId: caseDoc._id }).populate("hospitalId", "name city").lean(),
      EpisodeModel.find({ caseId: caseDoc._id }).populate("hospitalId", "name city").sort({ sequenceNo: 1 }).lean(),
      CommissionRecordModel.find({ caseId: caseDoc._id }).lean(),
      CaseStageHistoryModel.find({ caseId: caseDoc._id }).populate("movedBy", "name").sort({ movedAt: -1 }).lean(),
      CaseTaskModel.find({ caseId: caseDoc._id }).populate("assigneeId", "name").lean(),
      CaseNoteModel.find({ caseId: caseDoc._id }).populate("authorId", "name").sort({ occurredAt: -1 }).lean(),
    ]);

    res.json({
      data: {
        ...caseDoc,
        documents,
        quotes,
        episodes,
        commissionRecords,
        history,
        tasks,
        notes,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: { code: "FETCH_CASE_FAILED", message: err.message } });
  }
});

// GET /api/v1/cases/:id/readiness
caseManagementRouter.get("/cases/:id/readiness", async (req: Request, res: Response) => {
  try {
    const toStage = req.query.toStage as any;
    if (!toStage) {
      return res.status(400).json({ error: { code: "STAGE_REQUIRED", message: "toStage query param is required" } });
    }
    const readiness = await evaluateStageGuards(req.params.id, toStage);
    res.json({ data: readiness });
  } catch (err: any) {
    res.status(422).json({ error: { code: "READINESS_EVAL_FAILED", message: err.message } });
  }
});

// POST /api/v1/cases/:id/stage-transitions
caseManagementRouter.post("/cases/:id/stage-transitions", async (req: Request, res: Response) => {
  try {
    const parsed = CaseStageTransitionSchema.parse(req.body);
    const caseDoc = await CaseModel.findById(req.params.id);
    if (!caseDoc) {
      return res.status(404).json({ error: { code: "NOT_FOUND", message: "Case not found" } });
    }

    const readiness = await evaluateStageGuards(caseDoc._id, parsed.toStage);

    // If guards fail on forward move
    if (!readiness.isReady) {
      return res.status(422).json({
        error: {
          code: "stage_guard_failed",
          message: "One or more stage exit criteria were not satisfied.",
          details: readiness.guards.filter((g) => !g.passed),
        },
      });
    }

    const fromStage = caseDoc.stage;
    caseDoc.stage = parsed.toStage;
    caseDoc.stageChangedAt = new Date();
    caseDoc.version += 1;
    await caseDoc.save();

    // Record stage history
    await CaseStageHistoryModel.create({
      caseId: caseDoc._id,
      fromStage,
      toStage: parsed.toStage,
      reason: parsed.reason,
      movedBy: caseDoc.ownerId,
    });

    // Audit log
    await CaseAuditLogModel.create({
      entityType: "Case",
      entityId: caseDoc._id,
      caseId: caseDoc._id,
      action: "stage_change",
      actorId: caseDoc.ownerId,
      changes: { stage: [fromStage, parsed.toStage] },
    });

    res.json({ data: caseDoc });
  } catch (err: any) {
    res.status(422).json({ error: { code: "STAGE_MOVE_FAILED", message: err.message } });
  }
});

// ==========================================
// 5. QUOTE MANAGEMENT
// ==========================================

// POST /api/v1/cases/:id/quote-requests (RFQ)
caseManagementRouter.post("/cases/:id/quote-requests", async (req: Request, res: Response) => {
  try {
    const parsed = CreateQuoteRequestSchema.parse({ ...req.body, caseId: req.params.id });
    const roundCount = await QuoteRequestModel.countDocuments({ caseId: req.params.id });

    const quoteRequest = await QuoteRequestModel.create({
      caseId: req.params.id,
      roundNo: roundCount + 1,
      clinicalSummary: parsed.clinicalSummary,
      responseDueAt: parsed.responseDueAt ? new Date(parsed.responseDueAt) : undefined,
      status: "open",
      requestedBy: req.body.requestedBy || (await CaseModel.findById(req.params.id))?.ownerId,
      notes: parsed.notes,
    });

    // Create recipients
    for (const hospitalId of parsed.hospitalIds) {
      await QuoteRequestRecipientModel.create({
        quoteRequestId: quoteRequest._id,
        caseId: req.params.id,
        hospitalId,
        status: "requested",
      });
    }

    res.status(201).json({ data: quoteRequest });
  } catch (err: any) {
    res.status(400).json({ error: { code: "CREATE_RFQ_FAILED", message: err.message } });
  }
});

// POST /api/v1/cases/:id/quotes (Log Hospital Quote)
caseManagementRouter.post("/cases/:id/quotes", async (req: Request, res: Response) => {
  try {
    const parsed = LogHospitalQuoteSchema.parse({ ...req.body, caseId: req.params.id });

    const quote = await QuoteModel.create({
      ...parsed,
      validityUntil: new Date(parsed.validityUntil),
    });

    // Update recipient status to received
    if (parsed.recipientId) {
      await QuoteRequestRecipientModel.findByIdAndUpdate(parsed.recipientId, {
        status: "received",
      });
    }

    res.status(201).json({ data: quote });
  } catch (err: any) {
    res.status(400).json({ error: { code: "LOG_QUOTE_FAILED", message: err.message } });
  }
});

// POST /api/v1/quotes/:id/share (Mark Shared with Partner)
caseManagementRouter.post("/quotes/:id/share", async (req: Request, res: Response) => {
  try {
    const quote = await QuoteModel.findByIdAndUpdate(
      req.params.id,
      {
        sharedWithPartnerAt: new Date(),
        sharedVia: req.body.sharedVia || "whatsapp",
      },
      { new: true }
    );
    res.json({ data: quote });
  } catch (err: any) {
    res.status(400).json({ error: { code: "SHARE_QUOTE_FAILED", message: err.message } });
  }
});

// POST /api/v1/quotes/:id/select (Partner Selects Quote)
caseManagementRouter.post("/quotes/:id/select", async (req: Request, res: Response) => {
  try {
    const parsed = SelectQuoteSchema.parse({ quoteId: req.params.id, ...req.body });

    const targetQuote = await QuoteModel.findById(parsed.quoteId);
    if (!targetQuote) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Quote not found" } });

    // Validation: cannot select expired quote
    if (new Date(targetQuote.validityUntil) < new Date()) {
      return res.status(422).json({
        error: { code: "QUOTE_EXPIRED", message: "Expired quotes cannot be selected without a validity refresh." },
      });
    }

    // Unselect other quotes on this case
    await QuoteModel.updateMany({ caseId: targetQuote.caseId }, { isSelected: false });

    // Mark selected
    targetQuote.isSelected = true;
    targetQuote.selectedAt = new Date();
    targetQuote.selectedVia = parsed.selectedVia;
    targetQuote.version += 1;
    await targetQuote.save();

    res.json({ data: targetQuote });
  } catch (err: any) {
    res.status(400).json({ error: { code: "SELECT_QUOTE_FAILED", message: err.message } });
  }
});

// GET /api/v1/cases/:id/quote-comparison
caseManagementRouter.get("/cases/:id/quote-comparison", async (req: Request, res: Response) => {
  try {
    const quotes = await QuoteModel.find({ caseId: req.params.id })
      .populate("hospitalId", "name city")
      .lean();

    // Find lowest price
    let lowestMin = Infinity;
    for (const q of quotes) {
      if (q.amountMinMinor < lowestMin) lowestMin = q.amountMinMinor;
    }

    const items = quotes.map((q) => ({
      ...q,
      isLowestPrice: q.amountMinMinor === lowestMin && quotes.length > 1,
    }));

    res.json({ data: items });
  } catch (err: any) {
    res.status(500).json({ error: { code: "COMPARISON_FAILED", message: err.message } });
  }
});

// ==========================================
// 6. EPISODES & MULTI-HOSPITAL MAPPING
// ==========================================

// POST /api/v1/cases/:id/episodes
caseManagementRouter.post("/cases/:id/episodes", async (req: Request, res: Response) => {
  try {
    const parsed = CreateEpisodeSchema.parse({ ...req.body, caseId: req.params.id });

    // Sequence calculation
    const existingCount = await EpisodeModel.countDocuments({ caseId: req.params.id });

    const episode = await EpisodeModel.create({
      ...parsed,
      sequenceNo: existingCount + 1,
      status: "planned",
    });

    res.status(201).json({ data: episode });
  } catch (err: any) {
    res.status(400).json({ error: { code: "CREATE_EPISODE_FAILED", message: err.message } });
  }
});

// POST /api/v1/cases/:id/episode-series (e.g. 7 Chemo Cycles)
caseManagementRouter.post("/cases/:id/episode-series", async (req: Request, res: Response) => {
  try {
    const parsed = CreateEpisodeSeriesSchema.parse({ ...req.body, caseId: req.params.id });

    const series = await EpisodeSeriesModel.create({
      caseId: req.params.id,
      label: parsed.label,
      plannedTotal: parsed.plannedTotal,
      notes: parsed.notes,
    });

    const existingEpisodesCount = await EpisodeModel.countDocuments({ caseId: req.params.id });
    const createdEpisodes = [];

    const startDate = new Date(parsed.firstCycleDate);

    for (let i = 1; i <= parsed.plannedTotal; i++) {
      const cyclePlannedStart = new Date(startDate.getTime() + (i - 1) * parsed.intervalDays * 24 * 60 * 60 * 1000);
      const episode = await EpisodeModel.create({
        caseId: req.params.id,
        seriesId: series._id,
        sequenceNo: existingEpisodesCount + i,
        cycleNo: i,
        episodeType: parsed.episodeType,
        hospitalId: parsed.defaultHospitalId,
        doctorId: parsed.defaultDoctorId,
        treatmentName: `${parsed.label} - Cycle ${i}`,
        plannedStart: cyclePlannedStart,
        expectedAmountMinor: parsed.expectedAmountPerCycleMinor,
        status: "planned",
      });
      createdEpisodes.push(episode);
    }

    res.status(201).json({ data: { series, episodes: createdEpisodes } });
  } catch (err: any) {
    res.status(400).json({ error: { code: "CREATE_SERIES_FAILED", message: err.message } });
  }
});

// POST /api/v1/episodes/:id/activate (ENFORCES EP-3 ONE ACTIVE EPISODE RULE!)
caseManagementRouter.post("/episodes/:id/activate", async (req: Request, res: Response) => {
  try {
    const episode = await EpisodeModel.findById(req.params.id);
    if (!episode) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Episode not found" } });

    // Check if another episode is active on this case
    const currentActive = await EpisodeModel.findOne({
      caseId: episode.caseId,
      status: "active",
      _id: { $ne: episode._id },
    }).populate("hospitalId", "name");

    if (currentActive) {
      const activeHospitalName = (currentActive.hospitalId as any)?.name || "hospital";
      return res.status(422).json({
        error: {
          code: "episode_already_active",
          message: `Episode '${currentActive.treatmentName}' at ${activeHospitalName} is currently active. You must complete, pause, or cancel it before starting a new episode.`,
        },
      });
    }

    // Check series sequential rule: cycle N requires cycle N-1 completed or cancelled
    if (episode.seriesId && episode.cycleNo && episode.cycleNo > 1) {
      const prevEpisode = await EpisodeModel.findOne({
        seriesId: episode.seriesId,
        cycleNo: episode.cycleNo - 1,
      });
      if (prevEpisode && !["completed", "cancelled"].includes(prevEpisode.status)) {
        return res.status(422).json({
          error: {
            code: "series_sequence_blocked",
            message: `Cycle ${episode.cycleNo - 1} must be completed or cancelled before activating Cycle ${episode.cycleNo}.`,
          },
        });
      }
    }

    episode.status = "active";
    episode.actualStart = episode.actualStart || new Date();
    episode.version += 1;
    await episode.save();

    // Update case activeEpisodeId and ensure stage is in_treatment
    const caseDoc = await CaseModel.findById(episode.caseId);
    if (caseDoc) {
      caseDoc.activeEpisodeId = episode._id;
      if (caseDoc.stage !== "in_treatment") {
        caseDoc.stage = "in_treatment";
        caseDoc.stageChangedAt = new Date();
      }
      await caseDoc.save();
    }

    res.json({ data: episode });
  } catch (err: any) {
    res.status(422).json({ error: { code: "ACTIVATE_EPISODE_FAILED", message: err.message } });
  }
});

// POST /api/v1/episodes/:id/complete
caseManagementRouter.post("/episodes/:id/complete", async (req: Request, res: Response) => {
  try {
    const episode = await EpisodeModel.findById(req.params.id);
    if (!episode) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Episode not found" } });

    episode.status = "completed";
    episode.actualEnd = new Date();
    episode.version += 1;
    await episode.save();

    // Clear active episode pointer on case
    await CaseModel.updateOne(
      { _id: episode.caseId, activeEpisodeId: episode._id },
      { $unset: { activeEpisodeId: 1 } }
    );

    res.json({ data: episode });
  } catch (err: any) {
    res.status(400).json({ error: { code: "COMPLETE_EPISODE_FAILED", message: err.message } });
  }
});

// PUT /api/v1/episodes/:id/billing (FINALISE BILLING & COMPUTE COMMISSION!)
caseManagementRouter.put("/episodes/:id/billing", async (req: Request, res: Response) => {
  try {
    const parsed = FinaliseEpisodeBillingSchema.parse(req.body);
    const episode = await EpisodeModel.findById(req.params.id);
    if (!episode) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Episode not found" } });

    episode.billedAmountMinor = parsed.billedAmountMinor;
    episode.billedCurrency = parsed.billedCurrency;
    episode.billingFinalisedAt = parsed.billingFinalisedAt ? new Date(parsed.billingFinalisedAt) : new Date();
    episode.version += 1;
    await episode.save();

    const caseDoc = await CaseModel.findById(episode.caseId);

    // 1. Fetch Hospital Agreement in effect
    const hospitalAgreement = await HospitalAgreementModel.findOne({
      hospitalId: episode.hospitalId,
      effectiveFrom: { $lte: episode.actualStart || new Date() },
      $or: [{ effectiveTo: { $exists: false } }, { effectiveTo: null }, { effectiveTo: { $gte: episode.actualStart || new Date() } }],
    }).sort({ effectiveFrom: -1 });

    const hospitalRateSnapshot = hospitalAgreement
      ? {
          type: hospitalAgreement.commissionType,
          value: hospitalAgreement.commissionValue,
          slabs: hospitalAgreement.slabs,
        }
      : { type: "percent_of_billed" as const, value: 15 }; // Default 15% if no agreement recorded

    // 2. Fetch Partner Agreement in effect
    let partnerShareSnapshot = undefined;
    if (caseDoc?.partnerId) {
      const partnerAgreement = await PartnerAgreementModel.findOne({
        partnerId: caseDoc.partnerId,
        effectiveFrom: { $lte: episode.actualStart || new Date() },
        $or: [{ effectiveTo: { $exists: false } }, { effectiveTo: null }, { effectiveTo: { $gte: episode.actualStart || new Date() } }],
      }).sort({ effectiveFrom: -1 });

      partnerShareSnapshot = partnerAgreement
        ? {
            type: partnerAgreement.shareType,
            value: partnerAgreement.shareValue,
            payoutTrigger: partnerAgreement.payoutTrigger,
          }
        : {
            type: "percent_of_akeezo_commission" as const,
            value: 40, // Default 40%
            payoutTrigger: "on_hospital_receipt" as const,
          };
    }

    // Calculate commission numbers
    const akeezoCommissionMinor = calculateAkeezoCommission(parsed.billedAmountMinor, hospitalRateSnapshot);
    const partnerShareMinor = calculatePartnerShare(akeezoCommissionMinor, partnerShareSnapshot, true);
    const akeezoNetMinor = akeezoCommissionMinor - partnerShareMinor;

    // Upsert Commission Record
    const commissionRecord = await CommissionRecordModel.findOneAndUpdate(
      { episodeId: episode._id },
      {
        $set: {
          caseId: episode.caseId,
          hospitalAgreementId: hospitalAgreement?._id,
          hospitalRateSnapshot,
          partnerShareSnapshot,
          billedAmountMinor: parsed.billedAmountMinor,
          currency: parsed.billedCurrency,
          akeezoCommissionMinor,
          partnerShareMinor,
          akeezoNetMinor,
          invoiceRef: parsed.invoiceRef,
          status: parsed.invoiceRef ? "invoiced" : "expected",
        },
      },
      { upsert: true, new: true }
    );

    res.json({ data: { episode, commissionRecord } });
  } catch (err: any) {
    res.status(400).json({ error: { code: "BILLING_FINALISATION_FAILED", message: err.message } });
  }
});

// ==========================================
// 7. PAYMENTS & ALLOCATIONS
// ==========================================

// POST /api/v1/payments (Record Receipt or Partner Payout)
caseManagementRouter.post("/payments", async (req: Request, res: Response) => {
  try {
    const parsed = RecordPaymentSchema.parse(req.body);

    // Validate allocations sum <= payment amount
    const allocatedSum = parsed.allocations.reduce((sum, a) => sum + a.amountMinor, 0);
    if (allocatedSum > parsed.amountMinor) {
      return res.status(422).json({
        error: {
          code: "ALLOCATION_EXCEEDS_PAYMENT",
          message: `Allocated amount (${allocatedSum}) exceeds payment total (${parsed.amountMinor}).`,
        },
      });
    }

    const payment = await PaymentModel.create({
      direction: parsed.direction,
      partyId: parsed.partyId,
      amountMinor: parsed.amountMinor,
      currency: parsed.currency,
      fxRateToInr: parsed.fxRateToInr,
      amountInrMinor: parsed.amountInrMinor || parsed.amountMinor,
      paidOn: new Date(parsed.paidOn),
      method: parsed.method,
      reference: parsed.reference,
      proofDocumentId: parsed.proofDocumentId,
      recordedBy: req.body.recordedBy || parsed.partyId,
    });

    // Apply allocations to commission records
    for (const alloc of parsed.allocations) {
      await PaymentAllocationModel.create({
        paymentId: payment._id,
        commissionRecordId: alloc.commissionRecordId,
        amountMinor: alloc.amountMinor,
      });

      const commRec = await CommissionRecordModel.findById(alloc.commissionRecordId);
      if (commRec) {
        if (parsed.direction === "in_from_hospital") {
          commRec.hospitalReceivedMinor = (commRec.hospitalReceivedMinor || 0) + alloc.amountMinor;
        } else {
          commRec.partnerPaidMinor = (commRec.partnerPaidMinor || 0) + alloc.amountMinor;
        }

        // Recompute partner payable and recovery due
        const { partnerPayableMinor, recoveryDueMinor } = calculatePartnerPayable(
          commRec.partnerShareMinor,
          commRec.akeezoCommissionMinor,
          commRec.hospitalReceivedMinor,
          commRec.partnerPaidMinor,
          commRec.partnerShareSnapshot?.payoutTrigger || "on_hospital_receipt",
          Boolean(commRec.invoiceRef)
        );

        commRec.partnerPayableMinor = partnerPayableMinor;
        commRec.recoveryDueMinor = recoveryDueMinor;
        commRec.status = deriveCommissionStatus({
          hasInvoice: Boolean(commRec.invoiceRef),
          hospitalReceivedMinor: commRec.hospitalReceivedMinor,
          akeezoCommissionMinor: commRec.akeezoCommissionMinor,
          partnerPaidMinor: commRec.partnerPaidMinor,
          partnerShareMinor: commRec.partnerShareMinor,
          currentStatus: commRec.status,
        });

        await commRec.save();
      }
    }

    res.status(201).json({ data: payment });
  } catch (err: any) {
    res.status(400).json({ error: { code: "RECORD_PAYMENT_FAILED", message: err.message } });
  }
});

// GET /api/v1/commission-records
caseManagementRouter.get("/commission-records", async (req: Request, res: Response) => {
  try {
    const filter: Record<string, any> = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.caseId) filter.caseId = req.query.caseId;

    const records = await CommissionRecordModel.find(filter)
      .populate("episodeId")
      .populate("caseId", "caseCode")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ data: records });
  } catch (err: any) {
    res.status(500).json({ error: { code: "FETCH_COMMISSIONS_FAILED", message: err.message } });
  }
});
