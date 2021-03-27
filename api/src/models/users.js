const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    passwd: String,
    fullname: String,
});

module.exports = mongoose.model('User', userSchema);