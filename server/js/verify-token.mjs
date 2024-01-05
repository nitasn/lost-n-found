import admin from "firebase-admin";
import initFirebase from "./init-firebase.mjs";

initFirebase();

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
