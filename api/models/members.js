const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelSchema = new Schema({
    registration_number: String,
    name: String,
    address: String,
    email: String,
    phone: String,
});

module.exports = mongoose.model('Member', modelSchema);