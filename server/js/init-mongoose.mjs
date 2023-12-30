import mongoose from "mongoose";

const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;
const dbName = "lost-n-found-hub";

const uri = `mongodb+srv://${username}:${password}@cluster0.jw3jdro.mongodb.net/${dbName}?retryWrites=true&w=majority`;

function serverStatus() {
  return mongoose.STATES[mongoose.connection.readyState];
}

export default async () => {
  if (serverStatus() === "disconnected") {
    await mongoose.connect(uri);
  }
};
