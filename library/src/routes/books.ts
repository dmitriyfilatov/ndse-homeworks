import express from 'express'
import {Request, Response} from 'express'
import * as fileMiddleware from './../middleware/file'
import Book from '../models/Book'

const router = express.Router()

router.get('/', async (req: Request, res: Response) => {
    const books = await Book.find();
    for (let i = 0; i < books.length; i++) {
        books[i].fileBook = undefined;
    }

    res.json(books)
})

router.post('/create', async (req: Request, res: Response) => {
    const {
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName,
    } = req.body;

    if (title) {
        const newBook = new Book({
            title,
            description,
            authors,
            favorite,
            fileCover,
            fileName,
        });

        try {
            await newBook.save();
            res.json(newBook)
        } catch (error) {
            console.log(error);
            res.json({ error: "book not saved"}).status(403)
        }
    }

    res.json({ error: "book not saved"}).status(403)
});

router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    let book;
    try {
        book = await Book.findById(id);
    } catch (error) {
        console.error(error);
        res.json({ error: "book not found" }).status(403)
    }

    res.json(book)
})

router.put('/update/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const {
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName
    } = req.body

    let book;
    try {
        book = await Book.findById(id);
    } catch (error) {
        console.error(error);
        res.json({ error: "book not found" }).status(403)
    }

    const bookTitle = title ? title : book.title

    try {
        const updatedBook = await Book.findByIdAndUpdate(id, {
            title: bookTitle,
            description,
            authors,
            favorite,
            fileCover,
            fileName,
        });
        res.json(updatedBook)
    } catch (error) {
        console.error(error);
        res.json({ error: "book not updated" }).status(403)
    }
});

router.delete('/delete/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        await Book.deleteOne({ _id: id });
        res.json({ status: 'OK' })
    } catch (e) {
        console.error(e);
        res.json({ error: "book not deleted"}).status(403)
    }
})

export default router;