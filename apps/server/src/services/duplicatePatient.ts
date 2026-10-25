import { DuplicatePatientMatch } from "@akeezo/contracts";
import { PatientModel, CaseModel } from "../db/models/index.js";
import { maskSensitiveValue } from "../utils/crypto.js";

export async function findDuplicatePatients(query: {
  passportNumber?: string;
  name?: string;
  dateOfBirth?: string;
}): Promise<DuplicatePatientMatch[]> {
  const matches: DuplicatePatientMatch[] = [];

  // 1. Passport match check
  if (query.passportNumber && query.passportNumber.trim()) {
    const passportHash = (PatientModel as any).hashPassport(query.passportNumber);
    const passportMatches = await PatientModel.find({
      passportNumberHash: passportHash,
    }).lean();

    for (const p of passportMatches as any[]) {
      const caseCount = await CaseModel.countDocuments({ patientId: p._id });
      matches.push({
        id: p._id.toString(),
        fullName: p.fullName,
        dateOfBirth: p.dateOfBirth,
        nationality: p.nationality,
        passportNumberMasked: p.passportNumberEncrypted ? maskSensitiveValue(p.passportNumberEncrypted, 3) : undefined,
        matchReason: "passport_match",
        caseCount,
      });
    }
  }

  // 2. Name + Date of Birth check
  if (query.name && query.name.trim() && query.dateOfBirth && query.dateOfBirth.trim()) {
    const normalizedName = query.name.toLowerCase().replace(/\s+/g, " ").trim();
    const nameMatches = await PatientModel.find({
      nameNormalized: normalizedName,
      dateOfBirth: query.dateOfBirth.trim(),
    }).lean();

    for (const p of nameMatches as any[]) {
      // Avoid duplicate matches if already found by passport
      if (!matches.some((m) => m.id === p._id.toString())) {
        const caseCount = await CaseModel.countDocuments({ patientId: p._id });
        matches.push({
          id: p._id.toString(),
          fullName: p.fullName,
          dateOfBirth: p.dateOfBirth,
          nationality: p.nationality,
          passportNumberMasked: p.passportNumberEncrypted ? maskSensitiveValue(p.passportNumberEncrypted, 3) : undefined,
          matchReason: "name_and_dob_match",
          caseCount,
        });
      }
    }
  }

  return matches;
}
