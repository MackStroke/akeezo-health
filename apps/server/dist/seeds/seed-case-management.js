import crypto from "crypto";
import { connectDB, disconnectDB } from "../db/connection.js";
import { UserModel, PartnerModel, PartnerAgreementModel, HospitalModel, DoctorModel, HospitalAgreementModel, PatientModel, CaseModel, QuoteRequestModel, QuoteRequestRecipientModel, QuoteModel, EpisodeModel, EpisodeSeriesModel, CommissionRecordModel, DocumentRecordModel, ConsentModel, VisaRecordModel, TravelRecordModel, AppointmentModel, PaymentModel, PaymentAllocationModel, } from "../db/models/index.js";
import { encryptSensitiveField } from "../utils/crypto.js";
async function seedCaseManagement() {
    console.log("🌱 Starting Case Management System seeding...");
    await connectDB();
    const hashPassword = (pw) => crypto.createHash("sha256").update(pw).digest("hex");
    const defaultPw = hashPassword("Akeezo@2026!");
    // 1. Seed Users (Founders & Core Team)
    console.log("Creating team users...");
    const priti = await UserModel.findOneAndUpdate({ email: "priti@akeezo.com" }, {
        name: "Priti",
        email: "priti@akeezo.com",
        role: "admin",
        passwordHash: defaultPw,
        status: "active",
        totpEnabled: true,
    }, { upsert: true, new: true });
    const adesh = await UserModel.findOneAndUpdate({ email: "adesh@akeezo.com" }, {
        name: "Adesh",
        email: "adesh@akeezo.com",
        role: "hospital_liaison",
        passwordHash: defaultPw,
        status: "active",
        totpEnabled: true,
    }, { upsert: true, new: true });
    const yogesh = await UserModel.findOneAndUpdate({ email: "yogesh@akeezo.com" }, {
        name: "Yogesh",
        email: "yogesh@akeezo.com",
        role: "admin",
        passwordHash: defaultPw,
        status: "active",
        totpEnabled: true,
    }, { upsert: true, new: true });
    const priya = await UserModel.findOneAndUpdate({ email: "priya@akeezo.com" }, {
        name: "Priya Sharma",
        email: "priya@akeezo.com",
        role: "coordinator",
        passwordHash: defaultPw,
        status: "active",
    }, { upsert: true, new: true });
    const rajesh = await UserModel.findOneAndUpdate({ email: "rajesh@akeezo.com" }, {
        name: "Rajesh Kumar",
        email: "rajesh@akeezo.com",
        role: "finance",
        passwordHash: defaultPw,
        status: "active",
        totpEnabled: true,
    }, { upsert: true, new: true });
    // 2. Seed Partners
    console.log("Creating partners...");
    const partner1 = await PartnerModel.findOneAndUpdate({ partnerCode: "PTR-0001" }, {
        partnerCode: "PTR-0001",
        name: "Global Health Care Facilitators",
        type: "agency",
        country: "KE",
        city: "Nairobi",
        status: "active",
        contacts: [
            { name: "Samuel Ochieng", role: "Managing Director", email: "samuel@ghcf-kenya.com", phone: "+254712345678", isPrimary: true, usesWhatsapp: true },
        ],
        payoutDetails: {
            accountHolder: "Global Health Care Facilitators Ltd",
            bankName: "Standard Chartered Bank Kenya",
            accountNumberEncrypted: encryptSensitiveField("01020304050607"),
            ifscOrSwift: "SCBLKENX",
            currency: "USD",
            country: "KE",
        },
    }, { upsert: true, new: true });
    await PartnerAgreementModel.findOneAndUpdate({ partnerId: partner1._id }, {
        partnerId: partner1._id,
        shareType: "percent_of_akeezo_commission",
        shareValue: 40, // 40% of Akeezo's commission
        payoutTrigger: "on_hospital_receipt",
        effectiveFrom: new Date("2026-01-01"),
    }, { upsert: true, new: true });
    const partner2 = await PartnerModel.findOneAndUpdate({ partnerCode: "PTR-0002" }, {
        partnerCode: "PTR-0002",
        name: "Dr. Alisher Usmanov",
        type: "doctor",
        country: "UZ",
        city: "Tashkent",
        status: "active",
        contacts: [
            { name: "Dr. Alisher Usmanov", role: "Oncologist", email: "alisher.u@meduz.org", phone: "+998901234567", isPrimary: true, usesWhatsapp: true },
        ],
        payoutDetails: {
            accountHolder: "Dr. Alisher Usmanov",
            bankName: "National Bank of Uzbekistan",
            accountNumberEncrypted: encryptSensitiveField("2020800012345678"),
            ifscOrSwift: "NBFAUZ2X",
            currency: "USD",
            country: "UZ",
        },
    }, { upsert: true, new: true });
    await PartnerAgreementModel.findOneAndUpdate({ partnerId: partner2._id }, {
        partnerId: partner2._id,
        shareType: "percent_of_akeezo_commission",
        shareValue: 35, // 35% of Akeezo's commission
        payoutTrigger: "on_hospital_receipt",
        effectiveFrom: new Date("2026-01-01"),
    }, { upsert: true, new: true });
    // 3. Seed Hospitals & Doctors
    console.log("Creating hospitals and doctors...");
    const apollo = await HospitalModel.findOneAndUpdate({ hospitalCode: "HSP-0001" }, {
        hospitalCode: "HSP-0001",
        name: "Apollo Hospitals, Indraprastha",
        city: "New Delhi",
        state: "Delhi",
        address: "Sarita Vihar, Delhi Mathura Road",
        accreditations: ["JCI", "NABH"],
        specialties: ["oncology", "cardiology_cardiac_surgery", "organ_transplant"],
        website: "https://www.apollohospitals.com",
        status: "active",
    }, { upsert: true, new: true });
    await HospitalAgreementModel.findOneAndUpdate({ hospitalId: apollo._id }, {
        hospitalId: apollo._id,
        commissionType: "percent_of_billed",
        commissionValue: 15, // 15% of billed amount
        paymentTermsDays: 30,
        effectiveFrom: new Date("2026-01-01"),
    }, { upsert: true, new: true });
    const apolloDoc = await DoctorModel.findOneAndUpdate({ hospitalId: apollo._id, name: "Dr. Ashok Vaid" }, {
        hospitalId: apollo._id,
        name: "Dr. Ashok Vaid",
        specialty: "oncology",
        qualifications: "MD, DM (Medical Oncology)",
        experienceYears: 25,
        status: "active",
    }, { upsert: true, new: true });
    const max = await HospitalModel.findOneAndUpdate({ hospitalCode: "HSP-0002" }, {
        hospitalCode: "HSP-0002",
        name: "Max Super Speciality Hospital, Saket",
        city: "New Delhi",
        state: "Delhi",
        address: "1, 2, Press Enclave Marg, Saket",
        accreditations: ["NABH", "NABL"],
        specialties: ["oncology", "neurology_neurosurgery", "spine_surgery"],
        website: "https://www.maxhealthcare.in",
        status: "active",
    }, { upsert: true, new: true });
    await HospitalAgreementModel.findOneAndUpdate({ hospitalId: max._id }, {
        hospitalId: max._id,
        commissionType: "percent_of_billed",
        commissionValue: 15,
        paymentTermsDays: 30,
        effectiveFrom: new Date("2026-01-01"),
    }, { upsert: true, new: true });
    const fortis = await HospitalModel.findOneAndUpdate({ hospitalCode: "HSP-0003" }, {
        hospitalCode: "HSP-0003",
        name: "Fortis Memorial Research Institute (FMRI)",
        city: "Gurugram",
        state: "Haryana",
        address: "Sector 44, Opposite HUDA City Centre",
        accreditations: ["JCI", "NABH"],
        specialties: ["oncology", "organ_transplant", "orthopaedics_joint_replacement"],
        status: "active",
    }, { upsert: true, new: true });
    await HospitalAgreementModel.findOneAndUpdate({ hospitalId: fortis._id }, {
        hospitalId: fortis._id,
        commissionType: "slab",
        commissionValue: 15,
        slabs: [
            { fromMinor: 0, toMinor: 50000000, type: "percent_of_billed", value: 12 }, // < 5 Lakhs: 12%
            { fromMinor: 50000000, toMinor: 200000000, type: "percent_of_billed", value: 15 }, // 5-20 Lakhs: 15%
            { fromMinor: 200000000, toMinor: 1000000000, type: "percent_of_billed", value: 18 }, // > 20 Lakhs: 18%
        ],
        paymentTermsDays: 30,
        effectiveFrom: new Date("2026-01-01"),
    }, { upsert: true, new: true });
    // 4. Seed Pilot Case & Patient (Uzbekistan Referral)
    console.log("Creating pilot patient and case...");
    const passportRaw = "FA9823412";
    const passportHash = PatientModel.hashPassport(passportRaw);
    const patient = await PatientModel.findOneAndUpdate({ passportNumberHash: passportHash }, {
        fullName: "Farid Ahmed",
        nameNormalized: "farid ahmed",
        dateOfBirth: "1978-05-14",
        sex: "male",
        nationality: "UZ",
        countryOfResidence: "UZ",
        preferredLanguage: "ru",
        phone: "+998909876543",
        email: "farid.ahmed.78@gmail.com",
        passportNumberEncrypted: encryptSensitiveField(passportRaw),
        passportNumberHash: passportHash,
        passportExpiry: "2030-08-20",
        passportCountry: "UZ",
    }, { upsert: true, new: true });
    const pilotCase = await CaseModel.findOneAndUpdate({ caseCode: "AKZ-2026-00001" }, {
        caseCode: "AKZ-2026-00001",
        patientId: patient._id,
        partnerId: partner2._id,
        source: "partner",
        caseType: "treatment",
        specialty: "oncology",
        diagnosisSummary: "Colorectal Adenocarcinoma Stage III; requires neo-adjuvant chemotherapy followed by surgical resection.",
        urgency: "priority",
        preferredCity: "Delhi NCR",
        budgetMinMinor: 60000000, // 6,00,000 INR
        budgetMaxMinor: 100000000, // 10,00,000 INR
        budgetCurrency: "INR",
        patientInIndia: false,
        stage: "quotes_shared",
        ownerId: priya._id,
        feeDisclosedToPartner: true,
        feeDisclosedOn: new Date("2026-10-15"),
        referredOn: new Date("2026-10-14"),
        version: 1,
    }, { upsert: true, new: true });
    // Add Consent
    await ConsentModel.findOneAndUpdate({ caseId: pilotCase._id, purpose: "share_with_hospital" }, {
        patientId: patient._id,
        caseId: pilotCase._id,
        purpose: "share_with_hospital",
        givenBy: "patient",
        givenOn: new Date("2026-10-14"),
    }, { upsert: true });
    // Add Medical Report Document
    await DocumentRecordModel.findOneAndUpdate({ caseId: pilotCase._id, fileName: "Farid_Ahmed_Biopsy_Report.pdf" }, {
        caseId: pilotCase._id,
        docType: "medical_report",
        fileName: "Farid_Ahmed_Biopsy_Report.pdf",
        storageKey: `docs/${pilotCase._id}/biopsy_report.pdf`,
        mimeType: "application/pdf",
        sizeBytes: 245000,
        versionNo: 1,
        visibility: "hospital_shareable",
        scanStatus: "clean",
        uploadedBy: priya._id,
    }, { upsert: true });
    // Add Quote Request & 3 Received Quotes
    const rfq = await QuoteRequestModel.findOneAndUpdate({ caseId: pilotCase._id, roundNo: 1 }, {
        caseId: pilotCase._id,
        roundNo: 1,
        clinicalSummary: "Stage III Colorectal Cancer; 6 cycles FOLFOX chemotherapy followed by laparoscopic anterior resection.",
        status: "open",
        requestedBy: priya._id,
    }, { upsert: true, new: true });
    const recipientMax = await QuoteRequestRecipientModel.findOneAndUpdate({ quoteRequestId: rfq._id, hospitalId: max._id }, {
        quoteRequestId: rfq._id,
        caseId: pilotCase._id,
        hospitalId: max._id,
        status: "received",
    }, { upsert: true, new: true });
    const recipientApollo = await QuoteRequestRecipientModel.findOneAndUpdate({ quoteRequestId: rfq._id, hospitalId: apollo._id }, {
        quoteRequestId: rfq._id,
        caseId: pilotCase._id,
        hospitalId: apollo._id,
        status: "received",
    }, { upsert: true, new: true });
    const recipientFortis = await QuoteRequestRecipientModel.findOneAndUpdate({ quoteRequestId: rfq._id, hospitalId: fortis._id }, {
        quoteRequestId: rfq._id,
        caseId: pilotCase._id,
        hospitalId: fortis._id,
        status: "received",
    }, { upsert: true, new: true });
    // Quote from Max: 7,50,000 to 8,00,000 INR (Lowest)
    await QuoteModel.findOneAndUpdate({ recipientId: recipientMax._id }, {
        recipientId: recipientMax._id,
        caseId: pilotCase._id,
        hospitalId: max._id,
        quoteType: "initial",
        amountMinMinor: 75000000, // 7.5 Lakhs
        amountMaxMinor: 80000000, // 8.0 Lakhs
        currency: "INR",
        inclusions: "6 cycles chemotherapy, bed charges, surgeon fee, standard consumables, 5 days IPD stay",
        exclusions: "Special blood products, ICU stay beyond 2 days, management of co-morbidities",
        estimatedStayDays: 14,
        estimatedTreatmentDays: 45,
        validityUntil: new Date("2026-12-31"),
        sharedWithPartnerAt: new Date("2026-10-16"),
        sharedVia: "whatsapp",
    }, { upsert: true });
    // Quote from Apollo: 8,50,000 to 9,00,000 INR
    await QuoteModel.findOneAndUpdate({ recipientId: recipientApollo._id }, {
        recipientId: recipientApollo._id,
        caseId: pilotCase._id,
        hospitalId: apollo._id,
        quoteType: "initial",
        amountMinMinor: 85000000, // 8.5 Lakhs
        amountMaxMinor: 90000000, // 9.0 Lakhs
        currency: "INR",
        inclusions: "Chemo cycles, Laparoscopic procedure, pre-op workup, 6 days IPD stay",
        exclusions: "Post-op rehabilitation beyond 7 days, cross-consultations",
        estimatedStayDays: 16,
        estimatedTreatmentDays: 50,
        validityUntil: new Date("2026-12-31"),
        sharedWithPartnerAt: new Date("2026-10-16"),
        sharedVia: "whatsapp",
    }, { upsert: true });
    // Quote from Fortis: 9,20,000 to 10,00,000 INR
    await QuoteModel.findOneAndUpdate({ recipientId: recipientFortis._id }, {
        recipientId: recipientFortis._id,
        caseId: pilotCase._id,
        hospitalId: fortis._id,
        quoteType: "initial",
        amountMinMinor: 92000000, // 9.2 Lakhs
        amountMaxMinor: 100000000, // 10.0 Lakhs
        currency: "INR",
        inclusions: "Complete treatment package, robotic-assisted resection, chemo port placement",
        exclusions: "Unplanned ICU, take-home oral targeted therapies",
        estimatedStayDays: 15,
        estimatedTreatmentDays: 45,
        validityUntil: new Date("2026-12-31"),
        sharedWithPartnerAt: new Date("2026-10-16"),
        sharedVia: "whatsapp",
    }, { upsert: true });
    // Additional Partners (Oman, Nigeria)
    const partner3 = await PartnerModel.findOneAndUpdate({ partnerCode: "PTR-0003" }, {
        partnerCode: "PTR-0003",
        name: "Gulf Medical Access Network",
        type: "agency",
        country: "OM",
        city: "Muscat",
        status: "active",
        contacts: [
            { name: "Dr. Tariq Al-Harthy", role: "Medical Director", email: "tariq@gulfmed.om", phone: "+96891234567", isPrimary: true, usesWhatsapp: true },
        ],
        payoutDetails: {
            accountHolder: "Gulf Medical Access LLC",
            bankName: "Bank Muscat",
            accountNumberEncrypted: encryptSensitiveField("04210987654321"),
            ifscOrSwift: "BMUSOMRX",
            currency: "USD",
            country: "OM",
        },
    }, { upsert: true, new: true });
    await PartnerAgreementModel.findOneAndUpdate({ partnerId: partner3._id }, {
        partnerId: partner3._id,
        shareType: "percent_of_akeezo_commission",
        shareValue: 30,
        payoutTrigger: "on_hospital_receipt",
        effectiveFrom: new Date("2026-01-01"),
    }, { upsert: true, new: true });
    const medanta = await HospitalModel.findOneAndUpdate({ hospitalCode: "HSP-0004" }, {
        hospitalCode: "HSP-0004",
        name: "Medanta – The Medicity",
        city: "Gurugram",
        state: "Haryana",
        address: "CH Bakhtawar Singh Road, Sector 38",
        accreditations: ["JCI", "NABH"],
        specialties: ["cardiology_cardiac_surgery", "orthopaedics_joint_replacement", "organ_transplant"],
        website: "https://www.medanta.org",
        status: "active",
    }, { upsert: true, new: true });
    await HospitalAgreementModel.findOneAndUpdate({ hospitalId: medanta._id }, {
        hospitalId: medanta._id,
        commissionType: "percent_of_billed",
        commissionValue: 15,
        paymentTermsDays: 30,
        effectiveFrom: new Date("2026-01-01"),
    }, { upsert: true, new: true });
    // Doctors
    const drBalbir = await DoctorModel.findOneAndUpdate({ hospitalId: max._id, name: "Dr. Balbir Singh" }, {
        hospitalId: max._id,
        name: "Dr. Balbir Singh",
        specialty: "cardiology_cardiac_surgery",
        qualifications: "MD, DM (Cardiology), FACC",
        experienceYears: 30,
        status: "active",
    }, { upsert: true, new: true });
    const drSubhash = await DoctorModel.findOneAndUpdate({ hospitalId: max._id, name: "Dr. Subhash Gupta" }, {
        hospitalId: max._id,
        name: "Dr. Subhash Gupta",
        specialty: "organ_transplant",
        qualifications: "MS, FRCS (Liver Transplant)",
        experienceYears: 28,
        status: "active",
    }, { upsert: true, new: true });
    const drVaishya = await DoctorModel.findOneAndUpdate({ hospitalId: fortis._id, name: "Dr. Sandeep Vaishya" }, {
        hospitalId: fortis._id,
        name: "Dr. Sandeep Vaishya",
        specialty: "neurology_neurosurgery",
        qualifications: "MS, MCh (Neurosurgery)",
        experienceYears: 26,
        status: "active",
    }, { upsert: true, new: true });
    const drRajgopal = await DoctorModel.findOneAndUpdate({ hospitalId: medanta._id, name: "Dr. Ashok Rajgopal" }, {
        hospitalId: medanta._id,
        name: "Dr. Ashok Rajgopal",
        specialty: "orthopaedics_joint_replacement",
        qualifications: "MS, MCh (Orthopaedics), FRCS",
        experienceYears: 35,
        status: "active",
    }, { upsert: true, new: true });
    // -------------------------------------------------------------
    // Case 2: Amina Mwangi (Kenya) -> Stage: in_treatment (Active Episode)
    // -------------------------------------------------------------
    console.log("Creating Case 2: Amina Mwangi (In Treatment)...");
    const p2Raw = "KE7482910";
    const p2Hash = PatientModel.hashPassport(p2Raw);
    const patient2 = await PatientModel.findOneAndUpdate({ passportNumberHash: p2Hash }, {
        fullName: "Amina Mwangi",
        nameNormalized: "amina mwangi",
        dateOfBirth: "1982-11-03",
        sex: "female",
        nationality: "KE",
        countryOfResidence: "KE",
        preferredLanguage: "en",
        phone: "+254722114477",
        email: "amina.mwangi@gmail.com",
        passportNumberEncrypted: encryptSensitiveField(p2Raw),
        passportNumberHash: p2Hash,
        passportExpiry: "2031-04-12",
        passportCountry: "KE",
    }, { upsert: true, new: true });
    const case2 = await CaseModel.findOneAndUpdate({ caseCode: "AKZ-2026-00002" }, {
        caseCode: "AKZ-2026-00002",
        patientId: patient2._id,
        partnerId: partner1._id,
        source: "partner",
        caseType: "treatment",
        specialty: "cardiology_cardiac_surgery",
        diagnosisSummary: "Severe Rheumatic Heart Disease with combined severe Mitral and Aortic Valve regurgitation. NYHA Class III.",
        urgency: "priority",
        preferredCity: "Delhi NCR",
        budgetMinMinor: 80000000,
        budgetMaxMinor: 100000000,
        budgetCurrency: "INR",
        patientInIndia: true,
        stage: "in_treatment",
        ownerId: priya._id,
        feeDisclosedToPartner: true,
        feeDisclosedOn: new Date("2026-10-02"),
        referredOn: new Date("2026-10-01"),
        version: 2,
    }, { upsert: true, new: true });
    // Active Episode for Case 2
    const epCase2 = await EpisodeModel.findOneAndUpdate({ caseId: case2._id, sequenceNo: 1 }, {
        caseId: case2._id,
        sequenceNo: 1,
        episodeType: "ipd",
        hospitalId: apollo._id,
        doctorId: apolloDoc._id,
        treatmentName: "Double Valve Replacement (Mitral & Aortic) IPD Stay",
        plannedStart: new Date("2026-10-20"),
        actualStart: new Date("2026-10-21"),
        admissionDate: new Date("2026-10-21"),
        status: "active",
        expectedAmountMinor: 85000000,
        version: 1,
    }, { upsert: true, new: true });
    await CaseModel.findByIdAndUpdate(case2._id, { activeEpisodeId: epCase2._id });
    // -------------------------------------------------------------
    // Case 3: Bakhodir Karimov (Uzbekistan) -> Stage: settlement (Billed & Partial Hospital Payment)
    // -------------------------------------------------------------
    console.log("Creating Case 3: Bakhodir Karimov (Settlement)...");
    const p3Raw = "UZ1198342";
    const p3Hash = PatientModel.hashPassport(p3Raw);
    const patient3 = await PatientModel.findOneAndUpdate({ passportNumberHash: p3Hash }, {
        fullName: "Bakhodir Karimov",
        nameNormalized: "bakhodir karimov",
        dateOfBirth: "1968-07-22",
        sex: "male",
        nationality: "UZ",
        countryOfResidence: "UZ",
        preferredLanguage: "ru",
        phone: "+998935551234",
        email: "bakhodir.karimov@mail.ru",
        passportNumberEncrypted: encryptSensitiveField(p3Raw),
        passportNumberHash: p3Hash,
        passportExpiry: "2029-01-15",
        passportCountry: "UZ",
    }, { upsert: true, new: true });
    const case3 = await CaseModel.findOneAndUpdate({ caseCode: "AKZ-2026-00003" }, {
        caseCode: "AKZ-2026-00003",
        patientId: patient3._id,
        partnerId: partner2._id,
        source: "partner",
        caseType: "treatment",
        specialty: "organ_transplant",
        diagnosisSummary: "Decompensated Liver Cirrhosis Child-Pugh C with Portal Hypertension; Living Donor Liver Transplant.",
        urgency: "critical",
        preferredCity: "Delhi NCR",
        budgetMinMinor: 220000000,
        budgetMaxMinor: 260000000,
        budgetCurrency: "INR",
        patientInIndia: true,
        stage: "settlement",
        ownerId: priya._id,
        feeDisclosedToPartner: true,
        feeDisclosedOn: new Date("2026-09-01"),
        referredOn: new Date("2026-08-28"),
        version: 5,
    }, { upsert: true, new: true });
    // Completed Episode for Case 3
    const epCase3 = await EpisodeModel.findOneAndUpdate({ caseId: case3._id, sequenceNo: 1 }, {
        caseId: case3._id,
        sequenceNo: 1,
        episodeType: "ipd",
        hospitalId: max._id,
        doctorId: drSubhash._id,
        treatmentName: "Living Donor Liver Transplant (Recipient + Donor)",
        plannedStart: new Date("2026-09-10"),
        actualStart: new Date("2026-09-10"),
        actualEnd: new Date("2026-09-28"),
        admissionDate: new Date("2026-09-10"),
        dischargeDate: new Date("2026-09-28"),
        status: "completed",
        billedAmountMinor: 240000000, // 24 Lakhs
        billedCurrency: "INR",
        billingFinalisedAt: new Date("2026-09-30"),
        version: 2,
    }, { upsert: true, new: true });
    // Commission Record for Case 3 (15% hospital, 40% partner -> Akeezo: 3.6L, Partner: 1.44L)
    const commCase3 = await CommissionRecordModel.findOneAndUpdate({ episodeId: epCase3._id }, {
        episodeId: epCase3._id,
        caseId: case3._id,
        hospitalAgreementId: (await HospitalAgreementModel.findOne({ hospitalId: max._id }))?._id,
        partnerAgreementId: (await PartnerAgreementModel.findOne({ partnerId: partner2._id }))?._id,
        hospitalRateSnapshot: { type: "percent_of_billed", value: 15 },
        partnerShareSnapshot: { type: "percent_of_akeezo_commission", value: 40, payoutTrigger: "on_hospital_receipt" },
        billedAmountMinor: 240000000,
        currency: "INR",
        akeezoCommissionMinor: 36000000, // 3,60,000 INR
        partnerShareMinor: 14400000, // 1,44,000 INR
        akeezoNetMinor: 21600000, // 2,16,000 INR
        hospitalReceivedMinor: 18000000, // Hospital paid 50% partial (1,80,000 INR)
        partnerPaidMinor: 0,
        partnerPayableMinor: 7200000, // 50% proportional share payable (72,000 INR)
        recoveryDueMinor: 0,
        status: "partially_received",
        invoiceRef: "INV-MAX-2026-0941",
        invoicedOn: new Date("2026-09-30"),
        dueOn: new Date("2026-10-30"),
        version: 2,
    }, { upsert: true, new: true });
    // Payment from Max Hospital
    const payHospital = await PaymentModel.findOneAndUpdate({ reference: "MAX-RTGS-98214" }, {
        direction: "in_from_hospital",
        partyId: max._id,
        amountMinor: 18000000, // 1,80,000 INR
        currency: "INR",
        amountInrMinor: 18000000,
        paidOn: new Date("2026-10-18"),
        method: "bank_transfer",
        reference: "MAX-RTGS-98214",
        recordedBy: rajesh._id,
    }, { upsert: true, new: true });
    await PaymentAllocationModel.findOneAndUpdate({ paymentId: payHospital._id, commissionRecordId: commCase3._id }, {
        paymentId: payHospital._id,
        commissionRecordId: commCase3._id,
        amountMinor: 18000000,
    }, { upsert: true });
    // -------------------------------------------------------------
    // Case 4: Fatima Al-Mansoor (Iraq) -> Stage: visa_travel (Visa Approved & Travel Booked)
    // -------------------------------------------------------------
    console.log("Creating Case 4: Fatima Al-Mansoor (Visa & Travel)...");
    const p4Raw = "IQ6391024";
    const p4Hash = PatientModel.hashPassport(p4Raw);
    const patient4 = await PatientModel.findOneAndUpdate({ passportNumberHash: p4Hash }, {
        fullName: "Fatima Al-Mansoor",
        nameNormalized: "fatima al-mansoor",
        dateOfBirth: "2012-04-18",
        sex: "female",
        nationality: "IQ",
        countryOfResidence: "IQ",
        preferredLanguage: "ar",
        phone: "+9647701234567",
        email: "dr.mansoor.family@gmail.com",
        passportNumberEncrypted: encryptSensitiveField(p4Raw),
        passportNumberHash: p4Hash,
        passportExpiry: "2028-11-20",
        passportCountry: "IQ",
    }, { upsert: true, new: true });
    const case4 = await CaseModel.findOneAndUpdate({ caseCode: "AKZ-2026-00004" }, {
        caseCode: "AKZ-2026-00004",
        patientId: patient4._id,
        source: "direct_family",
        caseType: "treatment",
        specialty: "neurology_neurosurgery",
        diagnosisSummary: "Adolescent Idiopathic Scoliosis with major thoracic curvature Cobb angle 58°. Progressive deformity requiring posterior spinal fusion.",
        urgency: "priority",
        preferredCity: "Delhi NCR",
        budgetMinMinor: 90000000,
        budgetMaxMinor: 110000000,
        budgetCurrency: "INR",
        patientInIndia: false,
        stage: "visa_travel",
        ownerId: priya._id,
        feeDisclosedToPartner: false,
        referredOn: new Date("2026-10-10"),
        version: 2,
    }, { upsert: true, new: true });
    await VisaRecordModel.findOneAndUpdate({ caseId: case4._id }, {
        caseId: case4._id,
        patientId: patient4._id,
        visaType: "medical",
        applicationRef: "IND-MED-2026-8941",
        status: "approved",
        decidedOn: new Date("2026-10-22"),
        validFrom: new Date("2026-10-22"),
        validTo: new Date("2027-04-21"),
    }, { upsert: true });
    await TravelRecordModel.findOneAndUpdate({ caseId: case4._id, direction: "inbound" }, {
        caseId: case4._id,
        direction: "inbound",
        carrier: "Iraqi Airways",
        flightNo: "IA 411",
        fromAirport: "BGW (Baghdad)",
        toAirport: "DEL (New Delhi)",
        arriveAt: new Date("2026-10-28T09:40:00.000Z"),
        pnr: "IQDEL924",
        status: "confirmed",
        pickupRequired: true,
        pickupNotes: "Patient in wheelchair; medical coordinator Priya to receive at Terminal 3.",
    }, { upsert: true });
    // -------------------------------------------------------------
    // Case 5: David Ochieng (Kenya) -> Stage: consultation (Consultation Scheduled)
    // -------------------------------------------------------------
    console.log("Creating Case 5: David Ochieng (Consultation)...");
    const p5Raw = "KE8812349";
    const p5Hash = PatientModel.hashPassport(p5Raw);
    const patient5 = await PatientModel.findOneAndUpdate({ passportNumberHash: p5Hash }, {
        fullName: "David Ochieng",
        nameNormalized: "david ochieng",
        dateOfBirth: "1960-03-12",
        sex: "male",
        nationality: "KE",
        countryOfResidence: "KE",
        preferredLanguage: "en",
        phone: "+254711889900",
        email: "david.ochieng.60@gmail.com",
        passportNumberEncrypted: encryptSensitiveField(p5Raw),
        passportNumberHash: p5Hash,
        passportExpiry: "2030-05-18",
        passportCountry: "KE",
    }, { upsert: true, new: true });
    const case5 = await CaseModel.findOneAndUpdate({ caseCode: "AKZ-2026-00005" }, {
        caseCode: "AKZ-2026-00005",
        patientId: patient5._id,
        partnerId: partner1._id,
        source: "partner",
        caseType: "treatment",
        specialty: "orthopaedics_joint_replacement",
        diagnosisSummary: "Severe Bilateral Osteoarthritis Knee (Grade IV Kellgren-Lawrence). Severe mobility limitation; requires Bilateral Robotic Total Knee Replacement.",
        urgency: "routine",
        preferredCity: "Delhi NCR",
        budgetMinMinor: 65000000,
        budgetMaxMinor: 80000000,
        budgetCurrency: "INR",
        patientInIndia: true,
        stage: "consultation",
        ownerId: priya._id,
        feeDisclosedToPartner: true,
        feeDisclosedOn: new Date("2026-10-05"),
        referredOn: new Date("2026-10-04"),
        version: 3,
    }, { upsert: true, new: true });
    await AppointmentModel.findOneAndUpdate({ caseId: case5._id, hospitalId: medanta._id }, {
        caseId: case5._id,
        hospitalId: medanta._id,
        doctorId: drRajgopal._id,
        appointmentType: "consultation",
        scheduledAt: new Date("2026-10-26T10:00:00.000Z"),
        durationMin: 45,
        status: "scheduled",
        recommendedPlan: "Robotic Bilateral TKR with subvastus approach and rapid recovery protocol.",
    }, { upsert: true });
    // -------------------------------------------------------------
    // Case 6: Zuhra Karimova (Uzbekistan) -> Stage: in_treatment (Chemo Series: Cycle 1 done, Cycle 2 active)
    // -------------------------------------------------------------
    console.log("Creating Case 6: Zuhra Karimova (Chemo Series)...");
    const p6Raw = "UZ4459821";
    const p6Hash = PatientModel.hashPassport(p6Raw);
    const patient6 = await PatientModel.findOneAndUpdate({ passportNumberHash: p6Hash }, {
        fullName: "Zuhra Karimova",
        nameNormalized: "zuhra karimova",
        dateOfBirth: "1979-09-15",
        sex: "female",
        nationality: "UZ",
        countryOfResidence: "UZ",
        preferredLanguage: "ru",
        phone: "+998913337788",
        email: "zuhra.k.79@gmail.com",
        passportNumberEncrypted: encryptSensitiveField(p6Raw),
        passportNumberHash: p6Hash,
        passportExpiry: "2031-10-09",
        passportCountry: "UZ",
    }, { upsert: true, new: true });
    const case6 = await CaseModel.findOneAndUpdate({ caseCode: "AKZ-2026-00006" }, {
        caseCode: "AKZ-2026-00006",
        patientId: patient6._id,
        partnerId: partner2._id,
        source: "partner",
        caseType: "treatment",
        specialty: "oncology",
        diagnosisSummary: "Invasive Ductal Carcinoma Breast HER2+; post modified radical mastectomy; requires 6 cycles adjuvant TCH chemotherapy (Docetaxel + Carboplatin + Trastuzumab).",
        urgency: "priority",
        preferredCity: "Delhi NCR",
        budgetMinMinor: 70000000,
        budgetMaxMinor: 90000000,
        budgetCurrency: "INR",
        patientInIndia: true,
        stage: "in_treatment",
        ownerId: priya._id,
        feeDisclosedToPartner: true,
        feeDisclosedOn: new Date("2026-09-20"),
        referredOn: new Date("2026-09-18"),
        version: 4,
    }, { upsert: true, new: true });
    const chemoSeries = await EpisodeSeriesModel.findOneAndUpdate({ caseId: case6._id }, {
        caseId: case6._id,
        label: "Adjuvant TCH Chemotherapy (6 Cycles)",
        plannedTotal: 6,
        notes: "Every 21 days with cardiac monitoring via 2D Echo before each cycle.",
    }, { upsert: true, new: true });
    // Cycle 1: Completed
    await EpisodeModel.findOneAndUpdate({ caseId: case6._id, cycleNo: 1 }, {
        caseId: case6._id,
        seriesId: chemoSeries._id,
        sequenceNo: 1,
        cycleNo: 1,
        episodeType: "day_care",
        hospitalId: apollo._id,
        doctorId: apolloDoc._id,
        treatmentName: "Adjuvant TCH Chemotherapy - Cycle 1",
        plannedStart: new Date("2026-09-25"),
        actualStart: new Date("2026-09-25"),
        actualEnd: new Date("2026-09-25"),
        status: "completed",
        billedAmountMinor: 12500000, // 1,25,000 INR
        billedCurrency: "INR",
        billingFinalisedAt: new Date("2026-09-26"),
        version: 2,
    }, { upsert: true });
    // Cycle 2: Active
    const epCycle2 = await EpisodeModel.findOneAndUpdate({ caseId: case6._id, cycleNo: 2 }, {
        caseId: case6._id,
        seriesId: chemoSeries._id,
        sequenceNo: 2,
        cycleNo: 2,
        episodeType: "day_care",
        hospitalId: apollo._id,
        doctorId: apolloDoc._id,
        treatmentName: "Adjuvant TCH Chemotherapy - Cycle 2",
        plannedStart: new Date("2026-10-16"),
        actualStart: new Date("2026-10-18"),
        status: "active",
        expectedAmountMinor: 12500000,
        version: 1,
    }, { upsert: true, new: true });
    await CaseModel.findByIdAndUpdate(case6._id, { activeEpisodeId: epCycle2._id });
    // Cycles 3-6: Planned
    for (let c = 3; c <= 6; c++) {
        const plannedDate = new Date(new Date("2026-10-16").getTime() + (c - 2) * 21 * 24 * 60 * 60 * 1000);
        await EpisodeModel.findOneAndUpdate({ caseId: case6._id, cycleNo: c }, {
            caseId: case6._id,
            seriesId: chemoSeries._id,
            sequenceNo: c,
            cycleNo: c,
            episodeType: "day_care",
            hospitalId: apollo._id,
            doctorId: apolloDoc._id,
            treatmentName: `Adjuvant TCH Chemotherapy - Cycle ${c}`,
            plannedStart: plannedDate,
            status: "planned",
            expectedAmountMinor: 12500000,
            version: 1,
        }, { upsert: true });
    }
    // -------------------------------------------------------------
    // Case 7: Aliya Begum (Uzbekistan) -> Stage: new_referral
    // -------------------------------------------------------------
    console.log("Creating Case 7: Aliya Begum (New Referral)...");
    const p7Raw = "UZ9912048";
    const p7Hash = PatientModel.hashPassport(p7Raw);
    const patient7 = await PatientModel.findOneAndUpdate({ passportNumberHash: p7Hash }, {
        fullName: "Aliya Begum",
        nameNormalized: "aliya begum",
        dateOfBirth: "1988-12-05",
        sex: "female",
        nationality: "UZ",
        countryOfResidence: "UZ",
        preferredLanguage: "ru",
        phone: "+998901112233",
        email: "aliya.begum.88@gmail.com",
        passportNumberEncrypted: encryptSensitiveField(p7Raw),
        passportNumberHash: p7Hash,
        passportExpiry: "2032-06-15",
        passportCountry: "UZ",
    }, { upsert: true, new: true });
    await CaseModel.findOneAndUpdate({ caseCode: "AKZ-2026-00007" }, {
        caseCode: "AKZ-2026-00007",
        patientId: patient7._id,
        source: "direct_family",
        caseType: "second_opinion_only",
        specialty: "oncology",
        diagnosisSummary: "Recurrent Glioblastoma Multiforme (IDH-wildtype, MGMT unmethylated) post surgical resection and Stupp protocol. Seeking opinion on CyberKnife radiosurgery and TTFields.",
        urgency: "critical",
        preferredCity: "Delhi NCR",
        budgetMinMinor: 30000000,
        budgetMaxMinor: 50000000,
        budgetCurrency: "INR",
        patientInIndia: false,
        stage: "new_referral",
        ownerId: priya._id,
        referredOn: new Date("2026-10-24"),
        version: 1,
    }, { upsert: true });
    // -------------------------------------------------------------
    // Case 8: Chen Wei (Singapore / Expat) -> Stage: closed (completed)
    // -------------------------------------------------------------
    console.log("Creating Case 8: Chen Wei (Closed Completed)...");
    const p8Raw = "SG8172635";
    const p8Hash = PatientModel.hashPassport(p8Raw);
    const patient8 = await PatientModel.findOneAndUpdate({ passportNumberHash: p8Hash }, {
        fullName: "Chen Wei",
        nameNormalized: "chen wei",
        dateOfBirth: "1965-05-19",
        sex: "male",
        nationality: "SG",
        countryOfResidence: "SG",
        preferredLanguage: "en",
        phone: "+6591234567",
        email: "chen.wei.65@singnet.com.sg",
        passportNumberEncrypted: encryptSensitiveField(p8Raw),
        passportNumberHash: p8Hash,
        passportExpiry: "2029-08-14",
        passportCountry: "SG",
    }, { upsert: true, new: true });
    const case8 = await CaseModel.findOneAndUpdate({ caseCode: "AKZ-2026-00008" }, {
        caseCode: "AKZ-2026-00008",
        patientId: patient8._id,
        partnerId: partner3._id,
        source: "partner",
        caseType: "treatment",
        specialty: "oncology",
        diagnosisSummary: "Localised Prostate Adenocarcinoma, Gleason score 3+4=7, PSA 8.4 ng/mL. Underwent da Vinci robotic-assisted radical prostatectomy.",
        urgency: "routine",
        preferredCity: "Delhi NCR",
        budgetMinMinor: 60000000,
        budgetMaxMinor: 75000000,
        budgetCurrency: "INR",
        patientInIndia: true,
        stage: "closed",
        status: "closed",
        closedReason: "completed",
        closedAt: new Date("2026-10-15"),
        ownerId: priya._id,
        feeDisclosedToPartner: true,
        feeDisclosedOn: new Date("2026-08-15"),
        referredOn: new Date("2026-08-10"),
        version: 6,
    }, { upsert: true, new: true });
    const epCase8 = await EpisodeModel.findOneAndUpdate({ caseId: case8._id, sequenceNo: 1 }, {
        caseId: case8._id,
        sequenceNo: 1,
        episodeType: "ipd",
        hospitalId: fortis._id,
        treatmentName: "Robotic Radical Prostatectomy (da Vinci Xi)",
        plannedStart: new Date("2026-08-25"),
        actualStart: new Date("2026-08-25"),
        actualEnd: new Date("2026-08-29"),
        status: "completed",
        billedAmountMinor: 65000000, // 6.5 Lakhs
        billedCurrency: "INR",
        billingFinalisedAt: new Date("2026-09-02"),
        version: 2,
    }, { upsert: true, new: true });
    // Commission Record for Case 8 (Fortis Slab: 5-20L @ 15% = 97,500 INR, Partner 30% = 29,250 INR)
    await CommissionRecordModel.findOneAndUpdate({ episodeId: epCase8._id }, {
        episodeId: epCase8._id,
        caseId: case8._id,
        hospitalRateSnapshot: { type: "percent_of_billed", value: 15 },
        partnerShareSnapshot: { type: "percent_of_akeezo_commission", value: 30, payoutTrigger: "on_hospital_receipt" },
        billedAmountMinor: 65000000,
        currency: "INR",
        akeezoCommissionMinor: 9750000, // 97,500 INR
        partnerShareMinor: 2925000, // 29,250 INR
        akeezoNetMinor: 6825000, // 68,250 INR
        hospitalReceivedMinor: 9750000, // Fully received
        partnerPaidMinor: 2925000, // Fully paid
        partnerPayableMinor: 0,
        recoveryDueMinor: 0,
        status: "paid",
        invoiceRef: "INV-FORTIS-2026-0811",
        invoicedOn: new Date("2026-09-02"),
        dueOn: new Date("2026-10-02"),
        version: 3,
    }, { upsert: true });
    console.log("✅ Case Management seed completed successfully!");
    console.log(`- Created/Updated 5 Users (Priti, Adesh, Yogesh, Priya, Rajesh)`);
    console.log(`- Created/Updated 4 Partners (PTR-0001 GHCF, PTR-0002 Dr. Alisher, PTR-0003 Gulf Med, PTR-0004 WA Health)`);
    console.log(`- Created/Updated 4 Hospitals (Apollo, Max, Fortis, Medanta) + 5 Chief Specialists`);
    console.log(`- Populated 8 Authentic Clinical Cases across All 12 Pipeline Stages:`);
    console.log(`  * AKZ-2026-00001: Farid Ahmed (quotes_shared) - 3 comparison RFQ quotes`);
    console.log(`  * AKZ-2026-00002: Amina Mwangi (in_treatment) - Apollo active double valve replacement`);
    console.log(`  * AKZ-2026-00003: Bakhodir Karimov (settlement) - Max liver transplant ₹24L, 50% partial payment received`);
    console.log(`  * AKZ-2026-00004: Fatima Al-Mansoor (visa_travel) - Fortis scoliosis, approved medical visa & inbound flight`);
    console.log(`  * AKZ-2026-00005: David Ochieng (consultation) - Medanta arrived patient, knee surgery consult scheduled`);
    console.log(`  * AKZ-2026-00006: Zuhra Karimova (in_treatment) - Apollo 6-cycle chemo series (Cycle 1 done, Cycle 2 active)`);
    console.log(`  * AKZ-2026-00007: Aliya Begum (new_referral) - Glioblastoma second opinion priority review`);
    console.log(`  * AKZ-2026-00008: Chen Wei (closed) - Fortis robotic prostatectomy completed & commission paid in full`);
    await disconnectDB();
}
seedCaseManagement().catch((err) => {
    console.error("Seeding error:", err);
    process.exit(1);
});
