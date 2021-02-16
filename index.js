const express = require('express')
const cors = require('cors')
const formData = require('express-form-data')

const { Book } = require('./models')

const library = {
    books: []
}

for (let i = 1; i < 4; i++) {
    const book = new Book(
        `title ${i}`,
        `description ${i}`,
        `authors ${i}`,
        `favorite ${i}`,
        `fileCover ${i}`,
        `fileName ${i}`
    )
    library.books.push(book)
}

const app = express()
app.use(formData.parse())
app.use(cors())

app.post('/api/user/login', (req, res) => {
    console.log('User login')
    res.status(201).json({ id: 1, mail: "test@mail.ru" })
})

app.get('/api/books', (req, res) => {
    const { books } = library
    res.json(books)
})

app.get('/api/books/:id', (req, res) => {
    const { books } = library
    const { id } = req.params
    const idx = books.findIndex(el => el.id === id)

    if (idx !== -1) {
        res.json(books[idx])
    } else {
        res.status(404)
        res.json("book | not found")
    }
})

app.post('/api/books', (req, res) => {
    const { books } = library
    const {
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName
    } = req.body

    const newBook = new Book(
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName
    )

    books.push(newBook)

    res.status(201)
    res.json(newBook)
})

app.put('/api/books/:id', (req, res) => {
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
        books[idx] = {
            ...books[idx],
            title,
            description,
            authors,
            favorite,
            fileCover,
            fileName
        }
        res.json(books[idx])
    } else {
        res.status(404)
        res.json("book | not found")
    }
})

app.delete('/api/books/:id', (req, res) => {
    const {books} = library
    const {id} = req.params
    const idx = books.findIndex(el => el.id === id)

    if (idx !== -1) {
        books.splice(idx, 1)
        res.json(true)
    } else {
        res.status(404)
        res.json("book | not found")
    }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})