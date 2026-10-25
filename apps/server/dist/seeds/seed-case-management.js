import crypto from "crypto";
import { connectDB, disconnectDB } from "../db/connection.js";
import { UserModel, PartnerModel, PartnerAgreementModel, HospitalModel, DoctorModel, HospitalAgreementModel, PatientModel, CaseModel, QuoteRequestModel, QuoteRequestRecipientModel, QuoteModel, DocumentRecordModel, ConsentModel, } from "../db/models/index.js";
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
    console.log("✅ Case Management seed completed successfully!");
    console.log(`- Created/Updated 5 Users (Priti, Adesh, Yogesh, Priya, Rajesh)`);
    console.log(`- Created/Updated 2 Partners (PTR-0001 GHCF Kenya, PTR-0002 Dr. Alisher Uzbekistan)`);
    console.log(`- Created/Updated 3 Hospitals (HSP-0001 Apollo, HSP-0002 Max, HSP-0003 Fortis)`);
    console.log(`- Created Pilot Case AKZ-2026-00001 for patient Farid Ahmed with 3 comparison quotes`);
    await disconnectDB();
}
seedCaseManagement().catch((err) => {
    console.error("Seeding error:", err);
    process.exit(1);
});
