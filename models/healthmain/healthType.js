const mongoose = require('mongoose');

const healthTypeSchema = new mongoose.Schema({
    healthtype : String,
    health_type_description:String
})

const healthtypeTable = mongoose.model('healthtype' , healthTypeSchema);

module.exports = healthtypeTable;