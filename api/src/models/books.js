const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelSchema = new Schema({
    code: String,
    category_id: String,
    isbn: String,
    title: String,
    author: String,
    publisher: String,
    city: String,
    year: Number,
    cover: String,
    qty: Number,
    on_loan_qty: Number,
});

modelSchema.index({
    code: 'text',
    title: 'text',
    author: 'text',
}, {
    weights: {
        title: 5,
        author: 3,
        code: 1,
    },
});

module.exports = mongoose.model('Book', modelSchema);