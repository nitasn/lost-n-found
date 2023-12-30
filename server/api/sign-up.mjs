import initMongoose from "../js/init-mongoose.mjs";
import admin from "firebase-admin";
import User from "../mongoose-models/user.mjs";
import serviceAccount from "../firebase.secret.mjs";

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

await initMongoose();

export default async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).send({ error: "missing token param" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid: _id, name, picture: profilePicUrl, email } = decodedToken;
    const record = {
      _id,
      name,
      email,
      profilePicUrl,
    };
    const user = await User.findOneAndUpdate({ _id }, record, { upsert: true, new: true });
    res.status(200).send(user);
  } 
  catch (err) {
    res.status(400).send({ error: err.message });
    console.error(`api/sign-in: error 400:`, err.message);
  }
};
