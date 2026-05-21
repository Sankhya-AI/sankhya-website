import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { firebaseServices } from '@/lib/firebase';

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
