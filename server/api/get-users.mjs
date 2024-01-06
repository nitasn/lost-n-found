import initMongoose from "../js/init-mongoose.mjs";
import User from "../mongoose-models/user.mjs";

await initMongoose();

const omit__v_field = { __v: false };

export default async (req, res) => {
  const { uids } = req.body;

  if (!Array.isArray(uids) || uids.findIndex((uid) => typeof uid !== "string") !== -1) {
    return res.status(422).send({ error: "invalid uids: should be an array of strings." });
  }

  try {
    const users = await User.find({ _id: { $in: uids } }, omit__v_field);
    res.status(200).send(users);
  }
  catch (err) {
    res.status(400).send({ error: err.message });
    console.error(`api/get-users: error 400:`, err.message);
  }
};
