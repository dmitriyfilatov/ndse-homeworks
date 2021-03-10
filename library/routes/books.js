const express = require('express');
const router = express.Router();
const fileMiddleware = require('./../middleware/file');
const axios = require('axios');
const Book = require('../models/Book');

router.get('/', async (req, res) => {
    const books = await Book.find();
    for (let i = 0; i < books.length; i++) {
        books[i].fileBook = undefined;
    }
    res.render('books/index', {
        title: "Книги",
        books
    });
})

router.get('/create', async (req, res) => {
    res.render("books/create", {
        title: "Книга | Добавление",
        book: {},
    });
});

router.post('/create', fileMiddleware.single('fileBook'), async (req, res) => {
    const {
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName,
    } = req.body;

    if (title && req.file) {
        let file = fileName ? fileName : req.file.originalname;
        if (file.substr(-4) !== '.pdf') {
            file += '.pdf';
        }

        const newBook = new Book({
            title,
            description,
            authors,
            favorite,
            fileCover,
            fileName: file,
            fileBook: req.file.filename
        });

        try {
            await newBook.save();
        } catch (error) {
            console.log(error);
            res.status(404).redirect('/404');
        }
    }
    res.redirect('/books');
});

router.get('/:id', async (req, res) => {
    const { id } = req.params
    let book;
    try {
        book = await Book.findById(id);
    } catch (error) {
        console.error(error);
        res.status(404).redirect('/404');
    }
    const views = await getViews(id);
    res.render("books/view", {
        title: `Книга | ${book.title}`,
        book,
        views
    });
})

async function getViews(id) {
    try {
        const counterUrl = `http://counter-nodejs:3001/counter/${id}/incr`
        const response = await axios.post(counterUrl);

        if (!response.data) {
            return 0;
        }
        return response.data;

    } catch (error) {
        return 0;
    }

}

router.get('/update/:id', async (req, res) => {
    const { id } = req.params;
    let book;
    try {
        book = await Book.findById(id);
    } catch (error) {
        console.error(error);
        res.status(404).redirect('/404');
    }

    res.render("books/update", {
        title: `Обновление книги | ${book.title}`,
        book,
    });
})

router.post('/update/:id', fileMiddleware.single('fileBook'), async (req, res) => {
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
        res.status(404).redirect('/404');
    }

    const file = req.file
    const fileBook = file && file.filename ? file.filename : book.fileBook
    const bookTitle = title ? title : book.title

    let name = fileName ? fileName : book.fileName
    if (name.substr(-4) !== '.pdf') {
        name += '.pdf'
    }

    try {
        await Book.findByIdAndUpdate(id, {
            title: bookTitle,
            description,
            authors,
            favorite,
            fileCover,
            fileName: name,
            fileBook
        });
    } catch (error) {
        console.error(error);
        res.status(404).redirect('/404');
    }

    res.redirect(`/books/${id}`);
});

router.post('/delete/:id', async (req, res) => {
    const { id } = req.params
    try {
        await Book.deleteOne({ _id: id });
    } catch (e) {
        console.error(e);
        res.status(404).redirect('/404');
    }

    res.redirect(`/books`);
})

router.get('/:id/download', async (req, res) => {
    const { id } = req.params;
    let book;
    try {
        book = await Book.findById(id);
    } catch (error) {
        console.error(error);
        res.status(404).redirect('/404');
    }

    const path = `${__dirname}/../uploads/books/${book.fileBook}`;
    const fileName = book.fileName;
    res.download(path, fileName, err => {
        if (err) {
            res.status(404).json("book | not found")
        }
    });

});

module.exports = router;