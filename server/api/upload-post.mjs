import initMongoose from "../js/init-mongoose.mjs";
import Post from "../mongoose-models/post.mjs";
import verifyToken from "../js/verify-token.mjs";

await initMongoose();

export default async function (req, res) {
  const decodedToken = await verifyToken(req);

  if (!decodedToken) {
    return res.status(401).json({ error: "Invalid Bearer Token." });
  }

  const { type, title, text, latLong, picsUrls } = req.body;

  const location = latLong && {
    latLong,
    name: await reverseGecode(latLong).catch(() => null),
  };

  const record = { author: decodedToken.uid, title, text, location, picsUrls, type };

  try {
    const post = await new Post(record).save();
    return res.status(200).send(post);
  } 
  catch (err) {
    console.error(`api/upload-post: error 400:`, err.message);
    return res.status(400).send({ error: err.message });
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
