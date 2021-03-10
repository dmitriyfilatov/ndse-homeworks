const express = require('express');
const router = express.Router();
const Counter = require('./../models/Counter')

router.post('/:bookId/incr', async (req, res) => {
    const { bookId } = req.params;
    let views = 1;
    try {
        let counter = await Counter.findOneAndUpdate(
            { bookId },
            { $inc: { value: 1 } },
            { useFindAndModify: false }
        );

        if (counter === null) {
            const newCounter = new Counter({ bookId });
            await newCounter.save();
        } else {
            views = counter.value;
        }
    } catch (error) {
        console.log(error);
    }

    res.status(200).json(views);
});

module.exports = router;