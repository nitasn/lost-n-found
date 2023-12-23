// import initMongoose from "../js/init-mongoose.mjs";
import admin from "firebase-admin";

export default async (req, res) => {
  // await initMongoose();
  verifyToken(req.query.idToken)
  try {
    res.send({ ok: "looks like this works" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

async function verifyToken(idToken) {
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  const uid = decodedToken.uid;
  console.log("decodedToken:", decodedToken);
  return uid;
}
