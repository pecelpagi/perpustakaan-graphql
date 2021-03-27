const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelSchema = new Schema({
    late_charge: Number,
    max_loan_duration: Number,
    max_loan_qty: Number,
});

module.exports = mongoose.model('Setting', modelSchema);