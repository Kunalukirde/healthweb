const mongoose = require('mongoose');
const feedbackSchema = new mongoose.Schema({
    feedback:String
});
const feedbackTable = mongoose.model('feedbacktable',feedbackSchema);
module.exports = feedbackTable;