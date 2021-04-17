import express from "express";
const router = express.Router();
import "reflect-metadata";
import { Container } from "inversify";
const container = new Container();
import { BookRepository } from "../models/BookRepository";

router.get(":id", async (req, res, next) => {
  const repo = container.get(BookRepository);
  const book = await repo.getBook(req.params.id);
  res.json(book);
});

export default router;
