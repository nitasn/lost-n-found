import initMongoose from "../js/init-mongoose.mjs";
import User from "../mongoose-models/user.mjs";
import verifyToken from "../js/verify-token.mjs";

await initMongoose();

export default async function (req, res) {
  const decodedToken = await verifyToken(req);

  if (!decodedToken) {
    return res.status(401).json({ error: "Invalid Bearer Token." });
  }

  const { uid: _id, name, picture: profilePicUrl, email } = decodedToken;

  const record = { _id, name, email, profilePicUrl };

  try {
    const user = await User.findOneAndUpdate({ _id }, record, { upsert: true, new: true });
    return res.status(200).send(user);
  }
  catch (err) {
    console.error(`api/sign-in: error 400:`, err.message);
    return res.status(400).send({ error: err.message });
  }
}
