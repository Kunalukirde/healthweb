const mongoose = require('mongoose');
const contentSchema = new mongoose.Schema({
        news_topic_heading: String,
            news_topic_title : String,
            news_topic_description: String
      });

const NewsSchema = new mongoose.Schema({
        sourceName : String,
        author : String,
        title : String,
        description : [String],
        url : String,
        urlToImage :String,
        publishedAt : String,
        content : [contentSchema],
})

const NewsTable = mongoose.model('NewsTable',NewsSchema);

module.exports = NewsTable;