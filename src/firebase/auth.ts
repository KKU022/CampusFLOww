"use client";
import { getAuth } from 'firebase/auth';
import { initializeFirebase } from './index';

const { firebaseApp } = initializeFirebase();
export const auth = getAuth(firebaseApp);
