import initMongoose from "../js/init-mongoose.mjs";
import Post from "../mongoose-models/post.mjs";

await initMongoose();

const omit__v_field = { __v: false };

function getFilterFromQueryParam(type) {
  if (!type) return {};

  if (type === "lost" || type === "found") {
    return { post_type: type };
  }

  return null;
}

export default async (req, res) => {
  const filter = getFilterFromQueryParam(req.query.type);

  if (filter === null) {
    return res
      .status(422)
      .send({ error: 'invalid post type: should be either "lost" or "found"' });
  }

  try {
    const allPosts = await Post.find(filter, omit__v_field)
      .sort({ date: -1 })
      .populate("author", ["_id", "name", "profilePicUrl"]);

    return res.status(200).send(allPosts);
  }
  catch (err) {
    console.error(`api/get-all-posts: error 400:`, err.message);
    return res.status(400).send({ error: err.message });
  }
};
