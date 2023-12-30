import initMongoose from "../js/init-mongoose.mjs";
import admin from "firebase-admin";
import Post from "../mongoose-models/post.mjs";
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

  const { type, title, text, latLong, picsUrls } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const author = decodedToken.uid;

    const location = latLong && {
      latLong,
      name: await reverseGecode(latLong),
    };

    const fields = { author, title, text, location, picsUrls, type };
    const post = await new Post(fields).save();

    res.status(200).send(post);
  } 
  catch (err) {
    res.status(400).send({ error: err.message });
    console.error(`api/upload-post: error 400:`, err.message);
  }
};

async function reverseGecode([lat, long]) {
  try {
    const url =
      `https://api.bigdatacloud.net/data/reverse-geocode-client?` +
      `latitude=${lat}&longitude=${long}&localityLanguage=en`;
    const json = await fetch(url).then((res) => res.json());
    return json.locality || json.city || json.countryName;
  } 
  catch (err) {
    console.error(`Couldn't Reverse-Gecode [${lat}, ${long}]:`, err.message);
    return null;
  }
}