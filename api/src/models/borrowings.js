const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelSchema = new Schema({
    code: String,
    book_id: String,
    member_id: String,
    borrow_date: String,
    return_date: String,
    max_return_date: String,
    late_charge: Number,
});

module.exports = mongoose.model('Borrowing', modelSchema);