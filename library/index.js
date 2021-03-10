const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorMiddleware = require('./middleware/error');

const indexRouter = require('./routes/index');
const booksApiRouter = require('./routes/api/books');
const booksRouter = require('./routes/books');
const userApiRouter = require('./routes/api/user');

const app = express();

app.use(bodyParser());
app.use(cors());
app.set('view engine', 'ejs');

app.use('', indexRouter);
app.use('/api/books', booksApiRouter);
app.use('/books', booksRouter);
app.use('/api/user', userApiRouter);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

async function init() {
    try {
        const database = process.env.MONGODB_DATABASE;
        const host = process.env.MONGODB_HOST;
        const port = process.env.MONGODB_PORT;
        const db = `mongodb://${host}:${port}/${database}`;
        await mongoose.connect(db);

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch(error) {
        console.log(error);
    }
}

init();




