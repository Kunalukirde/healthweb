const express = require('express');
const router = express.Router();
const add_News_Table = require('../models/NewsModel.js');
const NewsTable = require('../models/NewsModel.js');


router.post('/addnews',async (req,res) => {  
    try {
        const {sourceName, author, title, description, url, urlToImage, publishedAt, content, tags}  = req.body;
        console.log('body_Data',req.body);
        

        const doc = new add_News_Table({
            sourceName:sourceName,
            author:author,
            title: title,
            description: description,
            url: url,
            urlToImage: urlToImage,
            publishedAt: publishedAt,
            content: content,
        })
        await doc.save();
        res.status(200).send({message: 'success',saved_news:doc});
    } catch (error) {
        res.status(409).send('Internal Server Error');
    }
} );


router.get('/fetchAllNews',async (req,res) => {
    try {
        const All_News = await NewsTable.find();
        const News = All_News.reverse();
        res.status(200).send({message:'fetch success', status:true, News})
    } catch (error) {
        res.status(409).send({message:'Internal Server Error'});
    }
})

router.delete('/DeleteNews',async(req,res) => {
    try {
        const {_id} = req.body;
        const DeleteNews = await NewsTable.deleteOne({_id : _id});
        res.status(200).send({message:'deleted successfully',DeleteNews})
    } catch (error) {
        res.status(409).send({message:'Internal Server Error'})
    }
})

module.exports = router;