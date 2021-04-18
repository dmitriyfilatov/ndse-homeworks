import mongoose, { Document, Schema } from "mongoose";
import Counter from "./counter";

const schema = new Schema({
  bookId: String,
  value: Number,
});

export const CounterModel = mongoose.model<Counter & Document>(
  "Counter",
  schema
);
