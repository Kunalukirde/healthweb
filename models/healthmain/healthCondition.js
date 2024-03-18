const mongoose = require('mongoose');

const healthConditionSchema = new mongoose.Schema({
    healthCondition : String,
    healthCondition_description:String
})

const healthConditionTable = mongoose.model('healthConditionTable' , healthConditionSchema);

module.exports = healthConditionTable;