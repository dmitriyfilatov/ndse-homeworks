import { Container, decorate, injectable } from "inversify";
import { BooksService } from "../books/books.service";
import { CountersService } from "../counters/counters.service";
const container = new Container();

decorate(injectable(), BooksService);
container.bind(BooksService).toSelf().inSingletonScope();

decorate(injectable(), CountersService);
container.bind(CountersService).toSelf().inSingletonScope();

export default container;
