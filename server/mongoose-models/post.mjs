import mongoose from "mongoose";
const { model, Schema } = mongoose;

import "./user.mjs";

const postSchema = new Schema({
  author: {
    type: String, // uid is from firease
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
    type: {
      latLong: {
        type: [Number],
        required: false,
        validate: {
          validator: (array) => !array || (Array.isArray(array) && array.length === 2),
          message: 'latLong must be an array of two numbers or null'
        }
      },
      name: {
        type: String,
        required: false,
      },
    },
    required: false, // allow the entire location object to be null
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
