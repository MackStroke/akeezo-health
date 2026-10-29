import { initializeApp, getApps, getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "akeezo-health";
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY || "AIzaSyAlTH5b-owDOYnUn-pK3EYmMJmMZJNW3OY";
let _app = null;
let _auth = null;
let _firestore = null;
export function getFirebaseAdminApp() {
    if (!_app) {
        try {
            _app = getApps().length === 0
                ? initializeApp({
                    projectId: FIREBASE_PROJECT_ID,
                })
                : getApp();
        }
        catch (err) {
            console.warn("[Firebase Admin App] Notice:", err.message);
            return null;
        }
    }
    return _app;
}
export function getAdminAuth() {
    if (!_auth) {
        const app = getFirebaseAdminApp();
        if (app) {
            try {
                _auth = getAuth(app);
            }
            catch (err) {
                console.warn("[Firebase Admin Auth] Notice:", err.message);
            }
        }
    }
    return _auth;
}
export function getFirestoreDB() {
    if (!_firestore) {
        const app = getFirebaseAdminApp();
        if (app) {
            try {
                _firestore = getFirestore(app);
                _firestore.settings({ ignoreUndefinedProperties: true });
            }
            catch (err) {
                console.warn("[Cloud Firestore] Notice:", err.message);
            }
        }
    }
    return _firestore;
}
// Backward compatible proxy objects for any legacy direct references
export const firebaseAdminApp = new Proxy({}, {
    get(_target, prop) {
        const app = getFirebaseAdminApp();
        return app ? app[prop] : undefined;
    }
});
export const adminAuth = new Proxy({}, {
    get(_target, prop) {
        const auth = getAdminAuth();
        return auth ? auth[prop] : undefined;
    }
});
export const firestore = new Proxy({}, {
    get(_target, prop) {
        const db = getFirestoreDB();
        return db ? db[prop] : undefined;
    }
});
/**
 * Verify Firebase ID Token issued to client
 */
export async function verifyFirebaseToken(idToken) {
    try {
        const auth = getAdminAuth();
        if (!auth)
            return null;
        return await auth.verifyIdToken(idToken);
    }
    catch (err) {
        console.warn("[Firebase Admin Auth] Token verification failed:", err.message);
        return null;
    }
}
/**
 * Register or update user credentials in Firebase Authentication
 */
export async function syncUserToFirebase(user) {
    try {
        if (!user.email || !user.password)
            return { success: true };
        const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: user.email.toLowerCase().trim(),
                password: user.password,
                displayName: user.name,
                returnSecureToken: true,
            }),
        });
        const data = await res.json();
        if (res.ok) {
            console.log(`[Firebase Auth] Registered user in Firebase: ${user.email}`);
            return { success: true, localId: data.localId };
        }
        if (data.error?.message === "EMAIL_EXISTS") {
            return { success: true, alreadyExists: true };
        }
        console.warn(`[Firebase Auth] User registration notice for ${user.email}:`, data.error?.message);
        return { success: false, error: data.error?.message };
    }
    catch (err) {
        console.warn(`[Firebase Auth] Network notice while syncing ${user.email}:`, err.message);
        return { success: false, error: err.message };
    }
}
/**
 * Sync Medical Patient profile to Cloud Firestore
 */
export async function syncPatientToFirestore(patient) {
    try {
        const db = getFirestoreDB();
        if (!db)
            return false;
        const docRef = db.collection("patients").doc(patient.patientId);
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
        const db = getFirestoreDB();
        if (!db)
            return false;
        const docRef = db.collection("cases").doc(caseItem.caseCode);
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
