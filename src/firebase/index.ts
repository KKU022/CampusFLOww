'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

/* ---------------- Firebase Init (App Hosting safe) ---------------- */

export function initializeFirebase() {
  if (!getApps().length) {
    let firebaseApp: FirebaseApp;
    try {
      // Firebase App Hosting (production)
      firebaseApp = initializeApp();
    } catch {
      // Local development fallback
      firebaseApp = initializeApp(firebaseConfig);
    }

    return getSdks(firebaseApp);
  }

  return getSdks(getApp());
}

function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp),
  };
}

/* ---------------- Barrel Exports ---------------- */

// 🔴 THIS IS WHAT YOU WERE MISSING
export * from './client-provider';
export * from './provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-login';
export * from './non-blocking-updates';
export * from './errors';
export * from './error-emitter';
