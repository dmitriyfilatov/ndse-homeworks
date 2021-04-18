import { Router } from "express";
import container from "../../infrastructure/container";
import { BooksService } from "../../books/books.service";
const router = Router();

router.get("", async (req, res) => {
  const service = container.get(BooksService);
  const books = await service.findAll();
  res.json(books);
});

router.get(":id", async (req, res) => {
  const { id } = req.params;
  const service = container.get(BooksService);
  const book = await service.findById(id);
  res.json(book);
});

router.post("", async (req, res) => {
  const service = container.get(BooksService);
  const book = await service.create(req.body);
  res.json(book);
});

module.exports = router;
