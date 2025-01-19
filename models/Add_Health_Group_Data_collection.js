const mongoose = require('mongoose');

const Add_Health_Group_Data_Schema = new mongoose.Schema({
    health_type:String,
    health_type_description:String,
    health_condition:String,
    healthCondition_description:String,
    health_name:String,
    health_name_description:String 
});

const Add_Health_Group_Data_collection = mongoose.model('health_group', Add_Health_Group_Data_Schema);

module.exports = Add_Health_Group_Data_collection;
