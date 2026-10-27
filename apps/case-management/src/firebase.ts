import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type ConfirmationResult,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyAlTH5b-owDOYnUn-pK3EYmMJmMZJNW3OY",
  authDomain: "akeezo-health.firebaseapp.com",
  projectId: "akeezo-health",
  storageBucket: "akeezo-health.firebasestorage.app",
  messagingSenderId: "319956548765",
  appId: "1:319956548765:web:8a55e14be333d3530de874",
  measurementId: "G-VD9XRW1ERY",
};

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

export {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type ConfirmationResult,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
};
