import mongoose from "mongoose";
const { model, Schema } = mongoose;

import "./user.mjs";

const postSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: false,
  },
  location: {
    lat: {
      type: Number,
      required: false,
    },
    long: {
      type: Number,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
  },
  picsUrls: {
    // links to images stored elsewhere
    type: [String],
    required: false,
  },
  type: {
    type: String,
    enum: ["lost", "found"],
    required: true,
  },
  isStillAvailable: {
    type: Boolean,
    required: true,
    default: true,
  },
});

export default model("Post", postSchema);
export { postSchema };
