import mongoose from "mongoose";

const { model, Schema } = mongoose;

const userSchema = new Schema({
  "_id": {
    // is firebase's uid
    type: String,
    required: true
  },
  "name": {
    type: String,
    required: true,
  },
  "email": {
    type: String,
    required: false,
  },
  "profilePicUrl": {
    // link to an image hosted at cloudinary
    type: String,
    required: false,
  },
  "dateJoined": {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export default model("User", userSchema);
export { userSchema };