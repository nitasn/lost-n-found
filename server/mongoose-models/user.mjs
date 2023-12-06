import mongoose from "mongoose";

const { model, Schema } = mongoose;

const userSchema = new Schema({
  "firstName": {
    type: String,
    required: true,
  },
  "lastName": {
    type: String,
    required: true,
  },
  "email": {
    type: String,
    required: false,
  },
  "profilePicUrl": {
    // link to an image stored at cloudinary
    type: String,
    required: false,
  },
  "dateJoined": {
    type: Date,
    required: true,
  },
});

export default model("User", userSchema);
export { userSchema };