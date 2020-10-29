const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelSchema = new Schema({
    code: String,
    name: String,
});

module.exports = mongoose.model('Category', modelSchema);