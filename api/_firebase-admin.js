import admin from 'firebase-admin';

export function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

export function getAdminDb() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: requireEnv('FIREBASE_PROJECT_ID'),
        clientEmail: requireEnv('FIREBASE_CLIENT_EMAIL'),
        privateKey: requireEnv('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
      }),
    });
  }

  return admin.firestore();
}

export function getAdminAuth() {
  getAdminDb();
  return admin.auth();
}

export { admin };
