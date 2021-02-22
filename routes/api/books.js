const express = require('express')
const router = express.Router()
const fileMiddleware = require('../../middleware/file')

const { Book } = require('../../models')

const library = {
    books: []
}

router.get('/', (req, res) => {
    const { books } = library
    const resBooks = JSON.parse(JSON.stringify(books))
    for (let i = 0; i < resBooks.length; i++) {
        delete resBooks[i].fileBook
    }

    res.json(resBooks)
})

router.get('/:id', (req, res) => {
    const { books } = library
    const { id } = req.params
    const idx = books.findIndex(el => el.id === id)

    if (idx !== -1) {
        const resBook = JSON.parse(JSON.stringify(books[idx]))
        delete resBook.fileBook
        res.json(books[idx])
    } else {
        res.status(404)
        res.json("book | not found")
    }
})

router.post('/', fileMiddleware.single('fileBook'), (req, res) => {
    const { books } = library
    const {
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName,
    } = req.body

    if (!title) {
        res.status(304)
        res.json('book | hasn\'t title')
    }

    if (!req.file) {
        res.status(304)
        res.json('book | hasn\'t file')
    }

    const newBook = new Book(
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName,
        req.file.filename
    )

    books.push(newBook)

    const resBook = JSON.parse(JSON.stringify(newBook))
    delete resBook.fileBook

    res.status(201).json(resBook)
})

router.put('/:id', fileMiddleware.single('fileBook'), (req, res) => {
    const { books } = library
    const {
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName
    } = req.body
    const { id } = req.params
    const idx = books.findIndex(el => el.id === id)

    if (idx !== -1) {
        const file = req.file
        const fileBook = file.filename ? file.filename : books[idx].fileBook
        const bookTitle = title ? title : books[idx].title
        books[idx] = {
            ...books[idx],
            bookTitle,
            description,
            authors,
            favorite,
            fileCover,
            fileName,
            fileBook
        }
        const resBook = JSON.parse(JSON.stringify(books[idx]))
        delete resBook.fileBook
        res.json(resBook)
    } else {
        res.status(404)
        res.json("book | not found")
    }
})

router.delete('/:id', (req, res) => {
    const { books } = library
    const { id } = req.params
    const idx = books.findIndex(el => el.id === id)

    if (idx !== -1) {
        books.splice(idx, 1)
        res.json(true)
    } else {
        res.status(404)
        res.json("book | not found")
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

