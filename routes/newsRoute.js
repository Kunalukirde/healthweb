const express = require('express');
const router = express.Router();
const NewsTable = require('../models/NewsModel.js');


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