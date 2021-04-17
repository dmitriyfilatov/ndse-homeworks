import "reflect-metadata";
import { Container } from "inversify";
import {BookRepository} from './models/BookRepository'

const container = new Container()
container.bind(BookRepository).toSelf()