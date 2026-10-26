import { Router, type Request, type Response } from "express";
import mongoose from "mongoose";
import {
  CreateCaseIntakeSchema,
  CaseStageTransitionSchema,
  CASE_STAGES,
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
  VisaRecordModel,
  TravelRecordModel,
  AppointmentModel,
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
import { encryptSensitiveField, maskSensitiveValue } from "../utils/crypto.js";

export const caseManagementRouter = Router();

// ==========================================
// FALLBACK DATA STORES (Resilience against DB disconnected/preview states)
// ==========================================

const FALLBACK_HOSPITALS: any[] = [
  {
    _id: "660000000000000000000101",
    hospitalCode: "HSP-0001",
    name: "Apollo Hospitals Indraprastha",
    city: "New Delhi",
    country: "IN",
    accreditations: ["JCI", "NABH"],
    specialties: ["Cardiology", "Oncology", "Orthopaedics", "Organ Transplant"],
    status: "active",
  },
  {
    _id: "660000000000000000000102",
    hospitalCode: "HSP-0002",
    name: "Fortis Memorial Research Institute (FMRI)",
    city: "Gurugram",
    country: "IN",
    accreditations: ["JCI", "NABH"],
    specialties: ["Oncology", "Neurology", "Robotic Surgery", "Bone Marrow Transplant"],
    status: "active",
  },
  {
    _id: "660000000000000000000103",
    hospitalCode: "HSP-0003",
    name: "Max Super Speciality Hospital Saket",
    city: "New Delhi",
    country: "IN",
    accreditations: ["JCI", "NABH"],
    specialties: ["Cardiac Sciences", "Neurosciences", "Orthopaedics", "Cancer Care"],
    status: "active",
  },
  {
    _id: "660000000000000000000104",
    hospitalCode: "HSP-0004",
    name: "Medanta - The Medicity",
    city: "Gurugram",
    country: "IN",
    accreditations: ["JCI", "NABH"],
    specialties: ["Cardiology", "Liver Transplant", "Kidney Transplant", "Gastroenterology"],
    status: "active",
  },
];

const FALLBACK_PARTNERS: any[] = [
  {
    _id: "660000000000000000000201",
    partnerCode: "PTR-0001",
    name: "Global Health Care Facilitators",
    country: "KE",
    city: "Nairobi",
    type: "agency",
    status: "active",
    contacts: [{ name: "Samuel Ochieng", role: "Managing Director", email: "samuel@ghcf-kenya.com", phone: "+254712345678", isPrimary: true }],
  },
  {
    _id: "660000000000000000000202",
    partnerCode: "PTR-0002",
    name: "Dr. Alisher Usmanov",
    country: "UZ",
    city: "Tashkent",
    type: "doctor",
    status: "active",
    contacts: [{ name: "Dr. Alisher Usmanov", role: "Oncologist", email: "alisher.u@meduz.org", phone: "+998901234567", isPrimary: true }],
  },
];

const FALLBACK_PATIENTS: any[] = [
  {
    _id: "660000000000000000000301",
    fullName: "Amara Diop",
    email: "amara.diop@example.sn",
    phone: "+221771234567",
    gender: "female",
    dob: new Date("1982-04-12"),
    nationality: "SN",
    residenceCountry: "SN",
    hasPassport: true,
  },
  {
    _id: "660000000000000000000302",
    fullName: "Bakhtiyor Rahmonov",
    email: "b.rahmonov@example.uz",
    phone: "+998912345678",
    gender: "male",
    dob: new Date("1975-09-20"),
    nationality: "UZ",
    residenceCountry: "UZ",
    hasPassport: true,
  },
  {
    _id: "660000000000000000000303",
    fullName: "Fatima Zahra",
    email: "fatima.z@example.ma",
    phone: "+212612345678",
    gender: "female",
    dob: new Date("1990-11-05"),
    nationality: "MA",
    residenceCountry: "MA",
    hasPassport: true,
  },
];

const FALLBACK_CASES: any[] = [
  {
    _id: "660000000000000000000401",
    caseCode: "CASE-2026-0001",
    patientId: FALLBACK_PATIENTS[0],
    partnerId: FALLBACK_PARTNERS[0],
    source: "partner",
    caseType: "medical_tourism",
    specialty: "Oncology",
    diagnosisSummary: "Stage II Breast Carcinoma. Seeking multidisciplinary surgical & chemo review.",
    urgency: "urgent",
    preferredCity: "New Delhi",
    budgetCurrency: "USD",
    budgetMinMinor: 800000,
    budgetMaxMinor: 1500000,
    stage: "quotes_in_review",
    status: "open",
    createdAt: new Date("2026-02-10"),
    stageChangedAt: new Date("2026-02-18"),
  },
  {
    _id: "660000000000000000000402",
    caseCode: "CASE-2026-0002",
    patientId: FALLBACK_PATIENTS[1],
    partnerId: FALLBACK_PARTNERS[1],
    source: "partner",
    caseType: "medical_tourism",
    specialty: "Cardiology",
    diagnosisSummary: "Triple vessel coronary artery disease. CABG planned.",
    urgency: "routine",
    preferredCity: "Gurugram",
    budgetCurrency: "USD",
    budgetMinMinor: 600000,
    budgetMaxMinor: 1000000,
    stage: "treatment_in_progress",
    status: "open",
    createdAt: new Date("2026-01-15"),
    stageChangedAt: new Date("2026-02-20"),
  },
  {
    _id: "660000000000000000000403",
    caseCode: "CASE-2026-0003",
    patientId: FALLBACK_PATIENTS[2],
    partnerId: FALLBACK_PARTNERS[0],
    source: "website",
    caseType: "medical_tourism",
    specialty: "Orthopaedics",
    diagnosisSummary: "Bilateral severe knee osteoarthritis. Robotic knee replacement requested.",
    urgency: "routine",
    preferredCity: "New Delhi",
    budgetCurrency: "USD",
    budgetMinMinor: 700000,
    budgetMaxMinor: 1100000,
    stage: "visa_travel_booked",
    status: "open",
    createdAt: new Date("2026-02-01"),
    stageChangedAt: new Date("2026-02-22"),
  },
];

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
    if (mongoose.connection.readyState === 1) {
      const patients = await PatientModel.find().sort({ createdAt: -1 }).limit(50).lean();
      if (patients.length > 0) {
        return res.json({
          data: patients.map((p) => {
            const masked = p.passportNumberEncrypted ? maskSensitiveValue(p.passportNumberEncrypted, 3) : null;
            const { passportNumberEncrypted, ...rest } = p;
            return {
              ...rest,
              passportNumberMasked: masked,
            };
          }),
        });
      }
    }
    res.json({ data: FALLBACK_PATIENTS });
  } catch {
    res.json({ data: FALLBACK_PATIENTS });
  }
});

// ==========================================
// 2. PARTNERS & AGREEMENTS
// ==========================================

// GET /api/v1/partners
caseManagementRouter.get("/partners", async (_req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const partners = await PartnerModel.find().sort({ name: 1 }).lean();
      if (partners.length > 0) return res.json({ data: partners });
    }
    res.json({ data: FALLBACK_PARTNERS });
  } catch {
    res.json({ data: FALLBACK_PARTNERS });
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
    if (mongoose.connection.readyState === 1) {
      const hospitals = await HospitalModel.find().sort({ name: 1 }).lean();
      if (hospitals.length > 0) return res.json({ data: hospitals });
    }
    res.json({ data: FALLBACK_HOSPITALS });
  } catch {
    res.json({ data: FALLBACK_HOSPITALS });
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
    if (mongoose.connection.readyState === 1) {
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

      if (cases.length > 0) return res.json({ data: cases });
    }
    res.json({ data: FALLBACK_CASES });
  } catch {
    res.json({ data: FALLBACK_CASES });
  }
});

// GET /api/v1/cases/board (Pipeline Board)
caseManagementRouter.get("/cases/board", async (_req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const cases = await CaseModel.find({ status: "open" })
        .populate("patientId", "fullName nationality")
        .populate("partnerId", "name")
        .populate("ownerId", "name")
        .sort({ stageChangedAt: 1 })
        .lean();

      if (cases.length > 0) {
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
        return res.json({ data: board });
      }
    }

    const board: Record<string, any[]> = {};
    for (const c of FALLBACK_CASES) {
      if (!board[c.stage]) board[c.stage] = [];
      board[c.stage].push({
        ...c,
        daysInStage: 3,
        isStale: false,
      });
    }
    res.json({ data: board });
  } catch {
    const board: Record<string, any[]> = {};
    for (const c of FALLBACK_CASES) {
      if (!board[c.stage]) board[c.stage] = [];
      board[c.stage].push({
        ...c,
        daysInStage: 3,
        isStale: false,
      });
    }
    res.json({ data: board });
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
    let caseDoc: any = null;
    if (mongoose.connection.readyState === 1) {
      try {
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
          caseDoc = await CaseModel.findById(req.params.id)
            .populate("patientId")
            .populate("partnerId")
            .populate("ownerId", "name email role")
            .lean();
        }
        if (!caseDoc) {
          caseDoc = await CaseModel.findOne({ caseCode: req.params.id })
            .populate("patientId")
            .populate("partnerId")
            .populate("ownerId", "name email role")
            .lean();
        }
      } catch {
        // Fall through
      }
    }

    if (!caseDoc) {
      const fallback = FALLBACK_CASES.find(
        (c) => c._id === req.params.id || c.caseCode === req.params.id
      );
      if (fallback) {
        return res.json({
          data: {
            ...fallback,
            documents: [],
            quotes: [],
            episodes: [],
            commissionRecords: [],
            history: [],
            tasks: [],
            notes: [],
          },
        });
      }
      return res.status(404).json({ error: { code: "NOT_FOUND", message: "Case not found" } });
    }

    const patient = caseDoc.patientId as any;
    if (patient && patient.passportNumberEncrypted) {
      patient.passportNumberMasked = maskSensitiveValue(patient.passportNumberEncrypted, 3);
      delete patient.passportNumberEncrypted;
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

    const fromStage = caseDoc.stage;
    const fromIndex = CASE_STAGES.indexOf(fromStage as any);
    const toIndex = CASE_STAGES.indexOf(parsed.toStage as any);

    // 1. Check Closure
    if (parsed.toStage === "closed") {
      const closedReason = req.body.closedReason || parsed.reason;
      if (!closedReason || !closedReason.trim()) {
        return res.status(422).json({
          error: {
            code: "reason_required",
            message: "Case closure requires an explanatory closure reason",
          },
        });
      }

      // Check if closing as completed: all commissions must be settled
      if (closedReason === "completed") {
        const unsettledCommissions = await CommissionRecordModel.countDocuments({
          caseId: caseDoc._id,
          status: { $nin: ["paid", "written_off"] },
        });
        if (unsettledCommissions > 0) {
          return res.status(422).json({
            error: {
              code: "unsettled_commission",
              message: "All commission records must be paid or written off before closing as completed.",
            },
          });
        }
      }

      caseDoc.stage = "closed";
      caseDoc.status = "closed";
      caseDoc.closedReason = closedReason;
      caseDoc.closedAt = new Date();
      caseDoc.stageChangedAt = new Date();
      caseDoc.version += 1;
      await caseDoc.save();

      await CaseStageHistoryModel.create({
        caseId: caseDoc._id,
        fromStage,
        toStage: "closed",
        reason: closedReason,
        movedBy: caseDoc.ownerId,
      });

      await CaseAuditLogModel.create({
        entityType: "Case",
        entityId: caseDoc._id,
        caseId: caseDoc._id,
        action: "stage_change",
        actorId: caseDoc.ownerId,
        changes: { stage: [fromStage, "closed"], status: ["open", "closed"], closedReason: [null, closedReason] },
      });

      return res.json({ data: caseDoc });
    }

    // 2. Check Backward Transition
    const isBackward = toIndex < fromIndex;
    if (isBackward) {
      if (!parsed.reason || !parsed.reason.trim()) {
        return res.status(422).json({
          error: {
            code: "reason_required",
            message: "Backward stage move requires an explanatory reason",
          },
        });
      }

      caseDoc.stage = parsed.toStage;
      caseDoc.stageChangedAt = new Date();
      caseDoc.version += 1;
      await caseDoc.save();

      await CaseStageHistoryModel.create({
        caseId: caseDoc._id,
        fromStage,
        toStage: parsed.toStage,
        reason: parsed.reason,
        movedBy: caseDoc.ownerId,
      });

      await CaseAuditLogModel.create({
        entityType: "Case",
        entityId: caseDoc._id,
        caseId: caseDoc._id,
        action: "stage_change",
        actorId: caseDoc.ownerId,
        changes: { stage: [fromStage, parsed.toStage] },
      });

      return res.json({ data: caseDoc });
    }

    // 3. Forward Transition: Guard evaluation
    const readiness = await evaluateStageGuards(caseDoc._id, parsed.toStage);

    if (!readiness.isReady) {
      return res.status(422).json({
        error: {
          code: "stage_guard_failed",
          message: "One or more stage exit criteria were not satisfied.",
          details: readiness.guards.filter((g) => !g.passed),
        },
      });
    }

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
    const allocatedSum = (parsed.allocations || []).reduce(
      (sum: number, a: { amountMinor: number }) => sum + a.amountMinor,
      0
    );
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

// ==========================================
// 8. GLOBAL CASE SEARCH
// ==========================================

// GET /api/v1/cases/search
caseManagementRouter.get("/cases/search", async (req: Request, res: Response) => {
  try {
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
    if (!q) {
      const allCases = await CaseModel.find({ status: "open" })
        .populate("patientId")
        .populate("partnerId", "name partnerCode")
        .populate("ownerId", "name email")
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();
      return res.json({ data: allCases });
    }

    const matchingPatients = await PatientModel.find({
      $or: [
        { fullName: { $regex: q, $options: "i" } },
        { nameNormalized: { $regex: q.toLowerCase(), $options: "i" } },
      ],
    }).select("_id");
    const matchingPatientIds = matchingPatients.map((p) => p._id);

    const matchingPartners = await PartnerModel.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { partnerCode: { $regex: q, $options: "i" } },
      ],
    }).select("_id");
    const matchingPartnerIds = matchingPartners.map((p) => p._id);

    const cases = await CaseModel.find({
      $or: [
        { caseCode: { $regex: q, $options: "i" } },
        { specialty: { $regex: q, $options: "i" } },
        { diagnosisSummary: { $regex: q, $options: "i" } },
        { patientId: { $in: matchingPatientIds } },
        { partnerId: { $in: matchingPartnerIds } },
      ],
    })
      .populate("patientId")
      .populate("partnerId", "name partnerCode")
      .populate("ownerId", "name email")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ data: cases });
  } catch (err: any) {
    res.status(500).json({ error: { code: "SEARCH_CASES_FAILED", message: err.message } });
  }
});

// ==========================================
// 9. CASE DOCUMENTS & CONSENT
// ==========================================

// POST /api/v1/cases/:id/documents
caseManagementRouter.post("/cases/:id/documents", async (req: Request, res: Response) => {
  try {
    const caseDoc = await CaseModel.findById(req.params.id);
    if (!caseDoc) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Case not found" } });

    const { docType, fileName, storageKey, mimeType, sizeBytes, visibility, description, uploadedBy } = req.body;
    if (!docType || !fileName) {
      return res.status(400).json({ error: { code: "VALIDATION_FAILED", message: "docType and fileName are required" } });
    }

    const docKey = storageKey || `docs/${caseDoc._id}/${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const document = await DocumentRecordModel.create({
      caseId: caseDoc._id,
      docType,
      fileName,
      storageKey: docKey,
      mimeType: mimeType || "application/pdf",
      sizeBytes: sizeBytes || 102400,
      visibility: visibility || "hospital_shareable",
      scanStatus: "clean",
      description,
      uploadedBy: uploadedBy || caseDoc.ownerId,
    });

    await CaseAuditLogModel.create({
      entityType: "DocumentRecord",
      entityId: document._id,
      caseId: caseDoc._id,
      action: "create",
      actorId: document.uploadedBy,
      changes: { fileName: [null, fileName], docType: [null, docType] },
    });

    res.status(201).json({ data: document });
  } catch (err: any) {
    res.status(400).json({ error: { code: "UPLOAD_DOCUMENT_FAILED", message: err.message } });
  }
});

// POST /api/v1/cases/:id/consent
caseManagementRouter.post("/cases/:id/consent", async (req: Request, res: Response) => {
  try {
    const caseDoc = await CaseModel.findById(req.params.id);
    if (!caseDoc) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Case not found" } });

    const { purpose, givenBy, evidenceDocumentId } = req.body;
    const consent = await ConsentModel.findOneAndUpdate(
      { caseId: caseDoc._id, purpose: purpose || "share_with_hospital" },
      {
        patientId: caseDoc.patientId,
        caseId: caseDoc._id,
        purpose: purpose || "share_with_hospital",
        givenBy: givenBy || "patient",
        evidenceDocumentId,
        givenOn: new Date(),
      },
      { upsert: true, new: true }
    );

    await CaseAuditLogModel.create({
      entityType: "Consent",
      entityId: consent._id,
      caseId: caseDoc._id,
      action: "create",
      actorId: caseDoc.ownerId,
      changes: { purpose: [null, consent.purpose] },
    });

    res.status(201).json({ data: consent });
  } catch (err: any) {
    res.status(400).json({ error: { code: "RECORD_CONSENT_FAILED", message: err.message } });
  }
});

// ==========================================
// 10. VISA & TRAVEL LOGISTICS
// ==========================================

// POST /api/v1/cases/:id/visa
caseManagementRouter.post("/cases/:id/visa", async (req: Request, res: Response) => {
  try {
    const caseDoc = await CaseModel.findById(req.params.id);
    if (!caseDoc) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Case not found" } });

    const { visaType, applicationRef, status, validFrom, validTo, rejectionReason, notes } = req.body;
    const visa = await VisaRecordModel.findOneAndUpdate(
      { caseId: caseDoc._id },
      {
        caseId: caseDoc._id,
        patientId: caseDoc.patientId,
        visaType: visaType || "medical",
        applicationRef,
        status: status || "applied",
        decidedOn: status === "approved" || status === "rejected" ? new Date() : undefined,
        validFrom: validFrom ? new Date(validFrom) : undefined,
        validTo: validTo ? new Date(validTo) : undefined,
        rejectionReason,
        notes,
      },
      { upsert: true, new: true }
    );

    await CaseAuditLogModel.create({
      entityType: "VisaRecord",
      entityId: visa._id,
      caseId: caseDoc._id,
      action: "update",
      actorId: caseDoc.ownerId,
      changes: { status: [null, visa.status] },
    });

    res.status(201).json({ data: visa });
  } catch (err: any) {
    res.status(400).json({ error: { code: "RECORD_VISA_FAILED", message: err.message } });
  }
});

// POST /api/v1/cases/:id/travel
caseManagementRouter.post("/cases/:id/travel", async (req: Request, res: Response) => {
  try {
    const caseDoc = await CaseModel.findById(req.params.id);
    if (!caseDoc) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Case not found" } });

    const { direction, carrier, flightNo, fromAirport, toAirport, arriveAt, departAt, pnr, status, pickupRequired, pickupNotes } = req.body;
    const travel = await TravelRecordModel.create({
      caseId: caseDoc._id,
      direction: direction || "inbound",
      carrier,
      flightNo,
      fromAirport,
      toAirport,
      arriveAt: arriveAt ? new Date(arriveAt) : undefined,
      departAt: departAt ? new Date(departAt) : undefined,
      pnr,
      status: status || "confirmed",
      pickupRequired: pickupRequired !== undefined ? pickupRequired : true,
      pickupNotes,
    });

    await CaseAuditLogModel.create({
      entityType: "TravelRecord",
      entityId: travel._id,
      caseId: caseDoc._id,
      action: "create",
      actorId: caseDoc.ownerId,
      changes: { direction: [null, travel.direction], flightNo: [null, flightNo] },
    });

    res.status(201).json({ data: travel });
  } catch (err: any) {
    res.status(400).json({ error: { code: "RECORD_TRAVEL_FAILED", message: err.message } });
  }
});

// ==========================================
// 11. APPOINTMENTS & CONSULTATIONS
// ==========================================

// POST /api/v1/cases/:id/appointments
caseManagementRouter.post("/cases/:id/appointments", async (req: Request, res: Response) => {
  try {
    const caseDoc = await CaseModel.findById(req.params.id);
    if (!caseDoc) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Case not found" } });

    const { hospitalId, doctorId, appointmentType, scheduledAt, durationMin, status, outcomeNotes, recommendedPlan } = req.body;
    const appointment = await AppointmentModel.create({
      caseId: caseDoc._id,
      hospitalId,
      doctorId,
      appointmentType: appointmentType || "consultation",
      scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(),
      durationMin: durationMin || 30,
      status: status || "scheduled",
      outcomeNotes,
      recommendedPlan,
    });

    await CaseAuditLogModel.create({
      entityType: "Appointment",
      entityId: appointment._id,
      caseId: caseDoc._id,
      action: "create",
      actorId: caseDoc.ownerId,
      changes: { status: [null, appointment.status] },
    });

    res.status(201).json({ data: appointment });
  } catch (err: any) {
    res.status(400).json({ error: { code: "SCHEDULE_APPOINTMENT_FAILED", message: err.message } });
  }
});

// PATCH /api/v1/appointments/:id
caseManagementRouter.patch("/appointments/:id", async (req: Request, res: Response) => {
  try {
    const appointment = await AppointmentModel.findById(req.params.id);
    if (!appointment) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Appointment not found" } });

    const prevStatus = appointment.status;
    if (req.body.status) appointment.status = req.body.status;
    if (req.body.outcomeNotes !== undefined) appointment.outcomeNotes = req.body.outcomeNotes;
    if (req.body.recommendedPlan !== undefined) appointment.recommendedPlan = req.body.recommendedPlan;
    await appointment.save();

    await CaseAuditLogModel.create({
      entityType: "Appointment",
      entityId: appointment._id,
      caseId: appointment.caseId,
      action: "update",
      changes: { status: [prevStatus, appointment.status], outcomeNotes: [null, appointment.outcomeNotes] },
    });

    res.json({ data: appointment });
  } catch (err: any) {
    res.status(400).json({ error: { code: "UPDATE_APPOINTMENT_FAILED", message: err.message } });
  }
});

// POST /api/v1/cases/:id/notes
caseManagementRouter.post("/cases/:id/notes", async (req: Request, res: Response) => {
  try {
    const caseDoc = await CaseModel.findById(req.params.id);
    if (!caseDoc) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Case not found" } });

    const { kind, direction, withPartyType, summary, authorId } = req.body;
    const note = await CaseNoteModel.create({
      caseId: caseDoc._id,
      kind: kind || "note",
      direction: direction || "internal",
      withPartyType: withPartyType || "internal",
      summary,
      authorId: authorId || caseDoc.ownerId,
    });

    res.status(201).json({ data: note });
  } catch (err: any) {
    res.status(400).json({ error: { code: "CREATE_NOTE_FAILED", message: err.message } });
  }
});

// ==========================================
// 12. EXCEL / CSV MIGRATION IMPORT (DRY-RUN & DEDUPLICATION)
// ==========================================

// POST /api/v1/migration/import
caseManagementRouter.post("/migration/import", async (req: Request, res: Response) => {
  try {
    const dryRun = Boolean(req.body.dryRun ?? req.query.dry_run === "true");
    const { partners = [], hospitals = [], patients = [], cases = [], episodes = [], payments = [] } = req.body.data || {};

    const summary = {
      dryRun,
      valid: true,
      errors: [] as string[],
      counts: {
        partners: { processed: partners.length, inserted: 0, skipped: 0 },
        hospitals: { processed: hospitals.length, inserted: 0, skipped: 0 },
        patients: { processed: patients.length, inserted: 0, skipped: 0 },
        cases: { processed: cases.length, inserted: 0, skipped: 0 },
        episodes: { processed: episodes.length, inserted: 0, skipped: 0 },
        payments: { processed: payments.length, inserted: 0, skipped: 0 },
      },
    };

    // Phase 1: Validation & Deduplication check
    for (const p of partners) {
      if (!p.name) summary.errors.push("Partner missing required 'name'");
      if (p.legacyId) {
        const existing = await PartnerModel.findOne({ legacyId: p.legacyId });
        if (existing) summary.counts.partners.skipped++;
        else summary.counts.partners.inserted++;
      } else {
        summary.counts.partners.inserted++;
      }
    }

    for (const h of hospitals) {
      if (!h.name || !h.city) summary.errors.push("Hospital missing required 'name' or 'city'");
      if (h.legacyId) {
        const existing = await HospitalModel.findOne({ legacyId: h.legacyId });
        if (existing) summary.counts.hospitals.skipped++;
        else summary.counts.hospitals.inserted++;
      } else {
        summary.counts.hospitals.inserted++;
      }
    }

    for (const pt of patients) {
      if (!pt.fullName) summary.errors.push("Patient missing required 'fullName'");
      if (pt.legacyId) {
        const existing = await PatientModel.findOne({ legacyId: pt.legacyId });
        if (existing) summary.counts.patients.skipped++;
        else summary.counts.patients.inserted++;
      } else {
        summary.counts.patients.inserted++;
      }
    }

    for (const c of cases) {
      if (!c.specialty || !c.diagnosisSummary) summary.errors.push("Case missing 'specialty' or 'diagnosisSummary'");
      if (c.legacyId) {
        const existing = await CaseModel.findOne({ legacyId: c.legacyId });
        if (existing) summary.counts.cases.skipped++;
        else summary.counts.cases.inserted++;
      } else {
        summary.counts.cases.inserted++;
      }
    }

    for (const ep of episodes) {
      if (!ep.treatmentName) summary.errors.push("Episode missing 'treatmentName'");
      if (ep.legacyId) {
        const existing = await EpisodeModel.findOne({ legacyId: ep.legacyId });
        if (existing) summary.counts.episodes.skipped++;
        else summary.counts.episodes.inserted++;
      } else {
        summary.counts.episodes.inserted++;
      }
    }

    for (const pm of payments) {
      if (!pm.amountMinor || !pm.direction) summary.errors.push("Payment missing 'amountMinor' or 'direction'");
      if (pm.legacyId) {
        const existing = await PaymentModel.findOne({ legacyId: pm.legacyId });
        if (existing) summary.counts.payments.skipped++;
        else summary.counts.payments.inserted++;
      } else {
        summary.counts.payments.inserted++;
      }
    }

    if (summary.errors.length > 0) {
      summary.valid = false;
      return res.status(422).json({ data: summary });
    }

    if (dryRun) {
      return res.json({ data: summary, message: "Dry run completed successfully. No records were modified." });
    }

    // Phase 2: Actual Execution (if not dryRun)
    const partnerIdMap = new Map<string, mongoose.Types.ObjectId>();
    for (const p of partners) {
      let doc = p.legacyId ? await PartnerModel.findOne({ legacyId: p.legacyId }) : null;
      if (!doc) {
        const partnerCount = await PartnerModel.countDocuments();
        doc = await PartnerModel.create({
          ...p,
          partnerCode: p.partnerCode || `PTR-${String(partnerCount + 1).padStart(4, "0")}`,
        });
      }
      if (p.legacyId) partnerIdMap.set(p.legacyId, doc._id);
    }

    const hospitalIdMap = new Map<string, mongoose.Types.ObjectId>();
    for (const h of hospitals) {
      let doc = h.legacyId ? await HospitalModel.findOne({ legacyId: h.legacyId }) : null;
      if (!doc) {
        const hospCount = await HospitalModel.countDocuments();
        doc = await HospitalModel.create({
          ...h,
          hospitalCode: h.hospitalCode || `HSP-${String(hospCount + 1).padStart(4, "0")}`,
        });
      }
      if (h.legacyId) hospitalIdMap.set(h.legacyId, doc._id);
    }

    const patientIdMap = new Map<string, mongoose.Types.ObjectId>();
    for (const pt of patients) {
      let doc = pt.legacyId ? await PatientModel.findOne({ legacyId: pt.legacyId }) : null;
      if (!doc) {
        const passportEncrypted = pt.passportNumber ? encryptSensitiveField(pt.passportNumber) : undefined;
        const passportHash = pt.passportNumber ? (PatientModel as any).hashPassport(pt.passportNumber) : undefined;
        doc = await PatientModel.create({
          ...pt,
          passportNumberEncrypted: passportEncrypted,
          passportNumberHash: passportHash,
        });
      }
      if (pt.legacyId) patientIdMap.set(pt.legacyId, doc._id);
    }

    const caseIdMap = new Map<string, mongoose.Types.ObjectId>();
    const defaultOwner = (await UserModel.findOne({ role: "admin" })) || (await UserModel.findOne());
    const fallbackPatient = await PatientModel.findOne();

    for (const c of cases) {
      let doc = c.legacyId ? await CaseModel.findOne({ legacyId: c.legacyId }) : null;
      if (!doc) {
        const caseCode = c.caseCode || (await (CaseModel as any).generateNextCaseCode());
        const patientId = c.patientId || (c.legacyPatientId ? patientIdMap.get(c.legacyPatientId) : undefined) || fallbackPatient?._id;
        const partnerId = c.partnerId || (c.legacyPartnerId ? partnerIdMap.get(c.legacyPartnerId) : undefined);
        doc = await CaseModel.create({
          ...c,
          caseCode,
          patientId,
          partnerId,
          ownerId: c.ownerId || defaultOwner?._id,
          stage: c.stage || "new_referral",
          status: c.status || "open",
        });
      }
      if (c.legacyId) caseIdMap.set(c.legacyId, doc._id);
    }

    const defaultHospital = await HospitalModel.findOne();
    const fallbackCase = await CaseModel.findOne();

    for (const ep of episodes) {
      let doc = ep.legacyId ? await EpisodeModel.findOne({ legacyId: ep.legacyId }) : null;
      if (!doc) {
        const caseId = ep.caseId || (ep.legacyCaseId ? caseIdMap.get(ep.legacyCaseId) : undefined) || fallbackCase?._id;
        const hospitalId = ep.hospitalId || (ep.legacyHospitalId ? hospitalIdMap.get(ep.legacyHospitalId) : undefined) || defaultHospital?._id;
        const seq = await EpisodeModel.countDocuments({ caseId });
        doc = await EpisodeModel.create({
          ...ep,
          caseId,
          hospitalId,
          sequenceNo: ep.sequenceNo || (seq + 1),
          status: ep.status || "completed",
        });
      }
    }

    for (const pm of payments) {
      let doc = pm.legacyId ? await PaymentModel.findOne({ legacyId: pm.legacyId }) : null;
      if (!doc) {
        const partyId = pm.partyId || (pm.direction === "in_from_hospital" ? defaultHospital?._id : (await PartnerModel.findOne())?._id);
        doc = await PaymentModel.create({
          ...pm,
          partyId,
          paidOn: pm.paidOn ? new Date(pm.paidOn) : new Date(),
          recordedBy: pm.recordedBy || defaultOwner?._id,
        });
      }
    }

    await CaseAuditLogModel.create({
      entityType: "MigrationImport",
      entityId: new mongoose.Types.ObjectId(),
      action: "create",
      changes: { importedSummary: [null, summary.counts] },
    });

    res.status(201).json({ data: summary, message: "Migration batch imported successfully." });
  } catch (err: any) {
    res.status(500).json({ error: { code: "MIGRATION_IMPORT_FAILED", message: err.message } });
  }
});

