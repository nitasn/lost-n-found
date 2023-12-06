import mongoose from "mongoose";

const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;
const dbName = "lost-n-found-hub";

const uri = `mongodb+srv://${username}:${password}@cluster0.jw3jdro.mongodb.net/${dbName}?retryWrites=true&w=majority`;

export default async () => {
  await mongoose.connect(uri);
};
