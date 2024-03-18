const mongoose = require('mongoose');

const healthNameSchema = new mongoose.Schema({
    healthname : String,
})

const healthNameTable = mongoose.model('healthname' , healthNameSchema);

module.exports = healthNameTable;