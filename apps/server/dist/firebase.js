import { initializeApp, getApps, getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "akeezo-health";
// Initialize Firebase Admin SDK for Akeezo Health
export const firebaseAdminApp = getApps().length === 0
    ? initializeApp({
        projectId: FIREBASE_PROJECT_ID,
    })
    : getApp();
export const adminAuth = getAuth(firebaseAdminApp);
export const firestore = getFirestore(firebaseAdminApp);
// Configure Firestore settings
try {
    firestore.settings({ ignoreUndefinedProperties: true });
}
catch {
    // Already configured
}
/**
 * Verify Firebase ID Token issued to client
 */
export async function verifyFirebaseToken(idToken) {
    try {
        return await adminAuth.verifyIdToken(idToken);
    }
    catch (err) {
        console.warn("[Firebase Admin Auth] Token verification failed:", err.message);
        return null;
    }
}
/**
 * Sync Medical Patient profile to Cloud Firestore
 */
export async function syncPatientToFirestore(patient) {
    try {
        const docRef = firestore.collection("patients").doc(patient.patientId);
        await docRef.set({
            ...patient,
            updatedAt: FieldValue.serverTimestamp(),
            createdAt: FieldValue.serverTimestamp(),
        }, { merge: true });
        console.log(`[Cloud Firestore] Synced patient record: ${patient.patientId}`);
        return true;
    }
    catch (err) {
        console.error(`[Cloud Firestore] Failed to sync patient ${patient.patientId}:`, err.message);
        return false;
    }
}
/**
 * Sync Case Management case to Cloud Firestore
 */
export async function syncCaseToFirestore(caseItem) {
    try {
        const docRef = firestore.collection("cases").doc(caseItem.caseCode);
        await docRef.set({
            ...caseItem,
            updatedAt: FieldValue.serverTimestamp(),
            createdAt: FieldValue.serverTimestamp(),
        }, { merge: true });
        console.log(`[Cloud Firestore] Synced case workflow: ${caseItem.caseCode}`);
        return true;
    }
    catch (err) {
        console.error(`[Cloud Firestore] Failed to sync case ${caseItem.caseCode}:`, err.message);
        return false;
    }
}
