import initFirebase from "../js/init-firebase.mjs";
import verifyToken from "../js/verify-token.mjs";
import admin from "firebase-admin";

initFirebase();

/**
 * todo endpoint file is redundant.
 * the client could upload directly to firestore.
 */

const db = admin.firestore();

export default async function (req, res) {
  const decodedToken = await verifyToken(req);

  if (!decodedToken) {
    return res.status(401).json({ error: "Invalid Bearer Token" });
  }

  const { to_uid, text } = req.body;

  if (!to_uid || !text) {
    return res.status(400).send({ error: "Missing recipient or message" });
  }

  const from_uid = decodedToken.uid;

  // ensure consistent document ID generation
  const chatId = [from_uid, to_uid].sort().join("_");
  const chatRef = db.collection("chats").doc(chatId).collection("messages");

  try {
    // add the message to Firestore
    const messageData = {
      sender: from_uid,
      receiver: to_uid,
      text,
      timestamp: Date.now(),
    };

    await chatRef.add(messageData);

    return res.status(200).send(messageData);
  } 
  catch (error) {
    console.error(`api/send-msg: error 500:`, err.message);
    return res.status(500).send({ error: "Internal server error" });
  }
}
