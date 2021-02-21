const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const indexRouter = require('./routes/index')
const booksRouter = require('./routes/books')
const userRouter = require('./routes/user')

const PORT = process.env.PORT || 3000

const app = express()


app.use(bodyParser())
app.use(cors())

app.use('', indexRouter)
app.use('/api/books', booksRouter)
app.use('/api/user', userRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

