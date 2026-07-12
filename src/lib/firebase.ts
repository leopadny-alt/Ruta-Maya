import {
  getApps,
  initializeApp,
} from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type UserCredential,
} from "firebase/auth";

import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB4e6b7nYr4viqC6xwYQZsT0gu1PoO4ElA",
  authDomain: "ruta-maya-2026.firebaseapp.com",
  projectId: "ruta-maya-2026",
  storageBucket: "ruta-maya-2026.firebasestorage.app",
  messagingSenderId: "946235074686",
  appId: "1:946235074686:web:2e35bb0c55909fd33b902f",
  measurementId: "G-ZQS608WF14"
};

const existingApp = getApps()[0];

export const firebaseApp =
  existingApp ?? initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);

export const googleProvider =
  new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

let firestoreDatabase: Firestore;

if (existingApp) {
  firestoreDatabase =
    getFirestore(firebaseApp);
} else {
  firestoreDatabase =
    initializeFirestore(firebaseApp, {
      localCache: persistentLocalCache({
        tabManager:
          persistentMultipleTabManager(),
      }),
    });
}

export const db = firestoreDatabase;

export function signInWithGoogle(): Promise<UserCredential> {
  return signInWithPopup(
    auth,
    googleProvider,
  );
}

export async function signOutFromFirebase(): Promise<void> {
  await signOut(auth);
}