const express = require('express');
const router = express.Router();
const wellnessDataTable = require('../models/wellnessData.js');

router.get('/allData',async (req,res) => {
    try {
        const wellnessData = await wellnessDataTable.find();
        res.status(200).send({status : true, message : 'success' , wellnessData})
        // console.log(wellnessData);
    } catch (error) {
        res.send({status : false , message : 'Internal server error'});
    }
})

module.exports = router;