import admin from 'firebase-admin';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Generate usernames BNC01 to BNC2000
const usernames = [];
for (let i = 1; i <= 2000; i++) {
  usernames.push(`BNC${i.toString().padStart(2, '0').padStart(4, '0')}`);
}

async function uploadUsernames() {
  const batchSize = 500; // Firestore batch limit
  for (let i = 0; i < usernames.length; i += batchSize) {
    const batch = db.batch();
    const chunk = usernames.slice(i, i + batchSize);
    chunk.forEach(username => {
      const docRef = db.collection('pppoe_users').doc(); // auto-ID
      batch.set(docRef, { pppoe_username: username });
    });
    await batch.commit();
    console.log(`Uploaded ${i + chunk.length} of ${usernames.length}`);
  }
  console.log('Bulk upload complete!');
}

uploadUsernames();