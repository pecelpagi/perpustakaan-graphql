const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelSchema = new Schema({
    registration_number: String,
    attendance_date: String,
});

module.exports = mongoose.model('Attendance', modelSchema);