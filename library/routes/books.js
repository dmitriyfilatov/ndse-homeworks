const express = require('express')
const router = express.Router()
const fileMiddleware = require('./../middleware/file')
const axios = require('axios')

const { Book } = require('../models')
const { response } = require('express')

const library = {
    books: []
}

router.get('/', (req, res) => {
    const { books } = library
    const resBooks = JSON.parse(JSON.stringify(books))
    for (let i = 0; i < resBooks.length; i++) {
        delete resBooks[i].fileBook
    }
    res.render('books/index', {
        title: "Книги",
        books: resBooks
    })
})

router.get('/create', (req, res) => {
    res.render("books/create", {
        title: "Книга | Добавление",
        book: {},
    })
})

router.post('/create', fileMiddleware.single('fileBook'), (req, res) => {

    const { books } = library
    const {
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName,
    } = req.body

    if (title && req.file) {
        let file = fileName ? fileName : req.file.originalname
        if (file.substr(-4) !== '.pdf') {
            file += '.pdf'
        }

        const newBook = new Book(
            title,
            description,
            authors,
            favorite,
            fileCover,
            file,
            req.file.filename
        )
        books.push(newBook)
    }

    res.redirect('/books')


})

router.get('/:id', (req, res) => {
    const { books } = library
    const { id } = req.params
    const idx = books.findIndex(el => el.id === id)

    getViews(id).then(views => {
        if (idx !== -1) {
            const resBook = JSON.parse(JSON.stringify(books[idx]))
            delete resBook.fileBook
            res.render("books/view", {
                title: `Книга | ${resBook.title}`,
                book: resBook,
                views
            })
        } else {
            res.status(404).redirect('/404')
        }
    });
})

async function getViews(id) {
    try {
        const counterUrl = `http://counter-nodejs:3001/counter/${id}/incr`
        const response = await axios.post(counterUrl);
        if (!response.data) {
            return 0;
        }
        return response.data[id]

    } catch (error) {
        return 0;
    }

}

router.get('/update/:id', (req, res) => {
    const { books } = library
    const { id } = req.params
    const idx = books.findIndex(el => el.id === id)

    if (idx !== -1) {
        res.render("books/update", {
            title: `Обновление книги | ${books[idx].title}`,
            book: books[idx],
        })
    } else {
        res.status(404).redirect('/404')
    }
})

router.post('/update/:id', fileMiddleware.single('fileBook'), (req, res) => {
    const { books } = library
    const { id } = req.params
    const {
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName
    } = req.body
    const idx = books.findIndex(el => el.id === id)

    if (idx !== -1) {
        const file = req.file
        const fileBook = file && file.filename ? file.filename : books[idx].fileBook
        const bookTitle = title ? title : books[idx].title

        let name = fileName ? fileName : books[idx].fileName
        if (name.substr(-4) !== '.pdf') {
            name += '.pdf'
        }

        books[idx] = {
            ...books[idx],
            bookTitle,
            description,
            authors,
            favorite,
            fileCover,
            fileName: name,
            fileBook
        }
        res.redirect(`/books/${id}`)
    } else {
        res.status(404).redirect('/404')
    }
})

router.post('/delete/:id', (req, res) => {
    const { books } = library
    const { id } = req.params
    const idx = books.findIndex(el => el.id === id)

    if (idx !== -1) {
        books.splice(idx, 1)
        res.redirect(`/books`)
    } else {
        res.status(404).redirect('/404')
    }
})

router.get('/:id/download', (req, res) => {
    const { books } = library
    const { id } = req.params
    const idx = books.findIndex(el => el.id === id)

    if (idx !== -1) {
        const path = `${__dirname}/../uploads/books/${books[idx].fileBook}`
        const fileName = books[idx].fileName
        res.download(path, fileName, err => {
            if (err) {
                res.status(404).json("book | not found")
            }
        })
    } else {
        res.status(404)
        res.json("book | not found")
    }
})

module.exports = router