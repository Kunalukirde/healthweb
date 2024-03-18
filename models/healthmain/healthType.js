const mongoose = require('mongoose');

const healthTypeSchema = new mongoose.Schema({
    healthtype : String,
})

const healthtypeTable = mongoose.model('healthtype' , healthTypeSchema);

module.exports = healthtypeTable;