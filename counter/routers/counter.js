const express = require('express');
const router = express.Router();
const fs = require('fs');

const counterDbFile = './counter.json';

router.post('/:bookId/incr', (req, res) => {

    const { bookId } = req.params;
    fs.readFile(counterDbFile, "utf8",
        function (error, data) {

            let counter = {};
            counter[bookId] = 1;

            if (data) {
                counter = JSON.parse(data);
                counter[bookId] = counter[bookId] ? counter[bookId] + 1 : 1;
            }

            fs.writeFile(counterDbFile, JSON.stringify(counter), () => {
                res.status(200).json(counter);
                return;
            })

        })
})

module.exports = router;