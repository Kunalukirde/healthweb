const mongoose = require('mongoose');

const wellnessTypeSchema = new mongoose.Schema({
    addtypes : String,
})

const wellnesstypeTable = mongoose.model('wellnesstype' , wellnessTypeSchema);

module.exports = wellnesstypeTable;