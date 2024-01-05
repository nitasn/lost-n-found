import admin from "firebase-admin";
import serviceAccount from "../firebase.secret.mjs";

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default async function verifyToken(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring("Bearer ".length);

  try {
    return await admin.auth().verifyIdToken(token);
  } 
  catch {
    return null;
  }
};
