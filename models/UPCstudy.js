const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let schema = new Schema({


    name: String,
    upc: { type: String, required: true, unique: true }
});
module.exports = mongoose.model('UPCstudy', schema);
