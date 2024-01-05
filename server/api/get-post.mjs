import initMongoose from "../js/init-mongoose.mjs";
import Post from "../mongoose-models/post.mjs";

await initMongoose();

export default async (req, res) => {
  const { _id } = req.query;

  if (!_id) {
    return res.status(422).send({ error: 'missing post _id' });
  }

  try {
    const post = await Post.findById(_id)
      .populate("author", ["_id", "name", "profilePicUrl"]);

    if (!post)
      return res.status(404).send({ error: 'post not found' });

    res.status(200).send(post);
  }
  catch (err) {
    res.status(400).send({ error: err.message });
    console.error(`api/get-all-posts: error 400:`, err.message);
  }
};
