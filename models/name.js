const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let schema = new Schema({
    name: String,
    crush: String
})
module.exports = mongoose.model('Name', schema);
