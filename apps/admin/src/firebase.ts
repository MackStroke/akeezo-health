import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyAcHZFYMhwMkjARiIpH_VMdz3IEENIKhOQ",
  authDomain: "optipress-64364.firebaseapp.com",
  projectId: "optipress-64364",
  storageBucket: "optipress-64364.firebasestorage.app",
  messagingSenderId: "313833017372",
  appId: "1:313833017372:web:9cbf018fc3b04b85688fd9",
};

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult };
