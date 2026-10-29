import { initializeApp, getApps, getApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, FieldValue, type Firestore } from "firebase-admin/firestore";

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "akeezo-health";
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY || "AIzaSyAlTH5b-owDOYnUn-pK3EYmMJmMZJNW3OY";

let _app: App | null = null;
let _auth: Auth | null = null;
let _firestore: Firestore | null = null;

export function getFirebaseAdminApp(): App | null {
  if (!_app) {
    try {
      _app = getApps().length === 0
        ? initializeApp({
            projectId: FIREBASE_PROJECT_ID,
          })
        : getApp();
    } catch (err: any) {
      console.warn("[Firebase Admin App] Notice:", err.message);
      return null;
    }
  }
  return _app;
}

export function getAdminAuth(): Auth | null {
  if (!_auth) {
    const app = getFirebaseAdminApp();
    if (app) {
      try {
        _auth = getAuth(app);
      } catch (err: any) {
        console.warn("[Firebase Admin Auth] Notice:", err.message);
      }
    }
  }
  return _auth;
}

export function getFirestoreDB(): Firestore | null {
  if (!_firestore) {
    const app = getFirebaseAdminApp();
    if (app) {
      try {
        _firestore = getFirestore(app);
        _firestore.settings({ ignoreUndefinedProperties: true });
      } catch (err: any) {
        console.warn("[Cloud Firestore] Notice:", err.message);
      }
    }
  }
  return _firestore;
}

// Backward compatible proxy objects for any legacy direct references
export const firebaseAdminApp = new Proxy({} as App, {
  get(_target, prop) {
    const app = getFirebaseAdminApp();
    return app ? (app as any)[prop] : undefined;
  }
});

export const adminAuth = new Proxy({} as Auth, {
  get(_target, prop) {
    const auth = getAdminAuth();
    return auth ? (auth as any)[prop] : undefined;
  }
});

export const firestore = new Proxy({} as Firestore, {
  get(_target, prop) {
    const db = getFirestoreDB();
    return db ? (db as any)[prop] : undefined;
  }
});

/**
 * Verify Firebase ID Token issued to client
 */
export async function verifyFirebaseToken(idToken: string) {
  try {
    const auth = getAdminAuth();
    if (!auth) return null;
    return await auth.verifyIdToken(idToken);
  } catch (err: any) {
    console.warn("[Firebase Admin Auth] Token verification failed:", err.message);
    return null;
  }
}

/**
 * Register or update user credentials in Firebase Authentication
 */
export async function syncUserToFirebase(user: { email: string; password?: string; name?: string }) {
  try {
    if (!user.email || !user.password) return { success: true };
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
  } catch (err: any) {
    console.warn(`[Firebase Auth] Network notice while syncing ${user.email}:`, err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Sync Medical Patient profile to Cloud Firestore
 */
export async function syncPatientToFirestore(patient: {
  patientId: string;
  fullName: string;
  dateOfBirth?: string;
  gender?: string;
  country?: string;
  phone?: string;
  passportHash?: string;
  createdBy: string;
}) {
  try {
    const db = getFirestoreDB();
    if (!db) return false;
    const docRef = db.collection("patients").doc(patient.patientId);
    await docRef.set(
      {
        ...patient,
        updatedAt: FieldValue.serverTimestamp(),
        createdAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    console.log(`[Cloud Firestore] Synced patient record: ${patient.patientId}`);
    return true;
  } catch (err: any) {
    console.error(`[Cloud Firestore] Failed to sync patient ${patient.patientId}:`, err.message);
    return false;
  }
}

/**
 * Sync Case Management case to Cloud Firestore
 */
export async function syncCaseToFirestore(caseItem: {
  caseCode: string;
  patientId: string;
  partnerId?: string;
  coordinatorId?: string;
  stage: string;
  priority: string;
  primaryDiagnosis: string;
  status: string;
}) {
  try {
    const db = getFirestoreDB();
    if (!db) return false;
    const docRef = db.collection("cases").doc(caseItem.caseCode);
    await docRef.set(
      {
        ...caseItem,
        updatedAt: FieldValue.serverTimestamp(),
        createdAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    console.log(`[Cloud Firestore] Synced case workflow: ${caseItem.caseCode}`);
    return true;
  } catch (err: any) {
    console.error(`[Cloud Firestore] Failed to sync case ${caseItem.caseCode}:`, err.message);
    return false;
  }
}
