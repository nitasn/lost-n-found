import admin from "firebase-admin";
import serviceAccount from "../firebase.secret.mjs";

export default function () {
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
}
