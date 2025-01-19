const express = require('express');
const router = express.Router();
const NewsTable = require('../models/NewsModel.js');



router.get('/fetchLatestNews', async (req, res) => {
    try {
        const News = await NewsTable.find().sort({ _id : -1}).limit(2);
        res.status(200).send({message:'fetch success', status:true, News});
    } catch (error) {
        res.status(error.status).send({message:'Internal Server Error'});
    }
});
router.get('/fetchAllNews',async (req,res) => {
    try {
        const All_News = await NewsTable.find();
        const News = All_News.reverse();
        res.status(200).send({message:'fetch success', status:true, News})
    } catch (error) {
        res.status(409).send({message:'Internal Server Error'});
    }
})


module.exports = router;