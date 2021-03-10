const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');

const indexRouter = require('./routers/index');
const counterRouter = require('./routers/counter');

app.use(cors());

app.use('/counter', counterRouter);
app.use('', indexRouter);

const PORT = process.env.PORT || 3001;

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

