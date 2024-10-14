import initMongoose from "../js/init-mongoose.mjs";

export default async (req, res) => {
  try {
    await initMongoose();
    res.send({ ok: "looks like this works" });
  } 
  catch (err) {
    res.status(500).send({ error: err.message });
  }
};
