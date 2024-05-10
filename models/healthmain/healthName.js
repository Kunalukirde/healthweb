const mongoose = require('mongoose');

const healthNameSchema = new mongoose.Schema({
    healthname : String,
    health_name_description:String,
})

const healthNameTable = mongoose.model('healthname' , healthNameSchema);

module.exports = healthNameTable;