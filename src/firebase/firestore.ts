import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

const { firestore } = initializeFirebase();

/* USER PROFILE */
export const userDoc = (uid: string) => doc(firestore, `users/${uid}`);

export const userStateDoc = (uid: string) => doc(firestore, `users/${uid}/state/main`);

export async function saveUser(uid: string, data: Record<string, unknown>) {
  await setDoc(
    userDoc(uid),
    {
      ...data,
      updatedAt: Date.now(),
    },
    { merge: true }
  );
}

export async function saveUserState(uid: string, data: Record<string, unknown>) {
  await setDoc(
    userStateDoc(uid),
    {
      ...data,
      updatedAt: Date.now(),
    },
    { merge: true }
  );
}

export function watchUser(uid: string, cb: (data: Record<string, unknown> | null) => void) {
  return onSnapshot(userDoc(uid), (snap) => {
    cb(snap.exists() ? (snap.data() as Record<string, unknown>) : null);
  });
}

export function watchUserState(uid: string, cb: (data: Record<string, unknown> | null) => void) {
  return onSnapshot(userStateDoc(uid), (snap) => {
    cb(snap.exists() ? (snap.data() as Record<string, unknown>) : null);
  });
}

/* TIMETABLE */
export const timetableDayDoc = (uid: string, day: string) =>
  doc(firestore, `users/${uid}/timetable/${day}`);

export const timetableCollection = (uid: string) => collection(firestore, `users/${uid}/timetable`);

export async function saveTimetableDay(uid: string, day: string, entries: unknown[]) {
  await setDoc(
    timetableDayDoc(uid, day),
    {
      day,
      entries,
      updatedAt: Date.now(),
    },
    { merge: true }
  );
}

export function watchTimetable(
  uid: string,
  cb: (data: Record<string, unknown[]> | null) => void
) {
  return onSnapshot(timetableCollection(uid), (snapshot) => {
    const result: Record<string, unknown[]> = {};
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as { entries?: unknown[] };
      if (data?.entries) {
        result[docSnap.id] = data.entries;
      }
    });
    cb(Object.keys(result).length ? result : null);
  });
}
