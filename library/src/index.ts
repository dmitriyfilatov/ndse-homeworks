import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser'
import mongoose from "mongoose";
import errorMiddleware from './middleware/error'

import indexRouter from './routes/index'
import booksRouter from './routes/books'

const app = express();

app.use(bodyParser());
app.use(cors());
app.set('view engine', 'ejs');

app.use('', indexRouter);
app.use('/books', booksRouter);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

async function init() {
    try {
        const database = process.env.MONGODB_DATABASE;
        const host = process.env.MONGODB_HOST;
        const port = process.env.MONGODB_PORT;
        const db = `mongodb://${host}:${port}/${database}`;
        await mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true });

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch(error) {
        console.log(error);
    }
}

init();