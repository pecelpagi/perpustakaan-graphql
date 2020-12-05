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
    
});

module.exports = mongoose.model('Book', modelSchema);