const mongoose = require('mongoose');
const searchConditionsSchema = new mongoose.Schema({
    searchConditions: { type : String, required : true }
});

const searchdConditionsTable = mongoose.model('searchedConditionsTable', searchConditionsSchema);

module.exports = searchdConditionsTable