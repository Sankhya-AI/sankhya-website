import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { updateProfile, type User } from 'firebase/auth';
import { firebaseServices } from '@/lib/firebase';

export const CUSTOMER_DISPLAY_NAME_MAX_LENGTH = 80;

export function normalizeCustomerDisplayName(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

export async function updateCustomerDisplayName(user: User, value: string) {
  const displayName = normalizeCustomerDisplayName(value);
  if (!displayName) throw new Error('Enter your name before saving.');
  if (displayName.length > CUSTOMER_DISPLAY_NAME_MAX_LENGTH) {
    throw new Error(`Name must be ${CUSTOMER_DISPLAY_NAME_MAX_LENGTH} characters or fewer.`);
  }
  if (!firebaseServices) throw new Error('Account services are not configured for this deployment.');

  await updateProfile(user, { displayName });
  await setDoc(
    doc(firebaseServices.db, 'users', user.uid),
    { displayName, updatedAt: serverTimestamp() },
    { merge: true },
  );
  return displayName;
}

export async function ensureCustomerProfile(user: User) {
  if (!firebaseServices) return;

  const profileRef = doc(firebaseServices.db, 'users', user.uid);
  const profile = await getDoc(profileRef);
  if (profile.exists()) {
    await setDoc(
      profileRef,
      {
        email: user.email,
        emailLower: user.email?.toLowerCase() ?? null,
        displayName: user.displayName,
        photoURL: user.photoURL,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return;
  }

  await setDoc(profileRef, {
    uid: user.uid,
    email: user.email,
    emailLower: user.email?.toLowerCase() ?? null,
    displayName: user.displayName,
    photoURL: user.photoURL,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}
