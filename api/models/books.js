const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelSchema = new Schema({
    code: String,
    isbn: Number,
    title: String,
    author: String,
    publisher: String,
    city: String,
    year: Number,
    cover: String,
    qty: Number,
    
});

module.exports = mongoose.model('Book', modelSchema);