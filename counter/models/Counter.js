const { Schema, model } = require('mongoose')

const counterSchema = new Schema({
    bookId: {
        type: String,
        require: true
    },
    value: {
        type: Number,
        default: 2
    },

});

module.exports = model('Counter', counterSchema);