const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
        sourceName : String,
        author : String,
        title : String,
        description : String,
        url : String,
        urlToImage :String,
        publishedAt : String,
        content : String,
})

const NewsTable = mongoose.model('NewsTable',NewsSchema);

module.exports = NewsTable;