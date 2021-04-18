import mongoose from "mongoose";
const database = process.env.MONGODB_DATABASE;
const host = process.env.MONGODB_HOST;
const port = process.env.MONGODB_PORT;
const connection = `mongodb://${host}:${port}/${database}`;

mongoose.connect(connection, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("open", () => {
  console.log("MongoDB connected");
});
