import mongoose, { Document, Schema } from "mongoose";
import Book from "./book";

const schema = new Schema({
  title: String,
  description: String,
  authors: [String],
  favourite: String,
  fileCover: String,
  fileName: String,
  fileBook: String,
});

export const BookModel = mongoose.model<Book & Document>("Book", schema);
