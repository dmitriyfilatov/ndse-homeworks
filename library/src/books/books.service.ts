import { BookModel } from "./books.model";
import { Book } from "./book";

interface CreateBookDto {
  title: Book["title"];
  description: Book["description"];
  authors: Book["authors"];
  favourite: Book["favourite"];
  fileCover: Book["fileCover"];
  fileName: Book["fileName"];
  fileBook: Book["fileBook"];
}

export class BooksService {
  constructor() {}
  async create(data: CreateBookDto): Promise<Book> {
    const book = new BookModel(data);
    await book.save();
    return book;
  }

  findAll(): Promise<Book[]> {
    return BookModel.find().exec();
  }

  findById(id: string): Promise<Book> {
    return BookModel.findById(id).exec();
  }
}
