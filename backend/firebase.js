import admin from 'firebase-admin';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

// Load local .env in development. On Railway/production, variables come from the environment.
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function normalizePrivateKey(privateKey) {
  if (!privateKey) return privateKey;
  // Handle escaped newlines that are commonly used in env vars
  return privateKey.replace(/\\n/g, '\n');
}

function resolveServiceAccount() {
  // 1) Single JSON string in FIREBASE_SERVICE_ACCOUNT
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const json = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      if (json.private_key) json.private_key = normalizePrivateKey(json.private_key);
      return json;
    } catch (err) {
      throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT JSON. Please ensure it is valid JSON.');
    }
  }

  // 2) Individual env vars
  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;
  if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
    return {
      project_id: FIREBASE_PROJECT_ID,
      client_email: FIREBASE_CLIENT_EMAIL,
      private_key: normalizePrivateKey(FIREBASE_PRIVATE_KEY),
    };
  }

  // 3) Local file fallback for development (never present in production builds)
  const requireModule = createRequire(import.meta.url);
  const candidatePaths = [
    path.join(__dirname, 'firebase-service-account.json'),
    path.join(__dirname, 'firebase-service-account.json.json'),
  ];
  for (const candidate of candidatePaths) {
    if (fs.existsSync(candidate)) {
      // eslint-disable-next-line global-require
      const json = requireModule(candidate);
      return json;
    }
  }

  throw new Error(
    'Firebase credentials not provided. Set FIREBASE_SERVICE_ACCOUNT (JSON) or FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY.'
  );
}

// Initialize the Firebase Admin SDK once
if (!admin.apps.length) {
  const serviceAccount = resolveServiceAccount();
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = admin.firestore();