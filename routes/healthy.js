const express = require('express');
const router = express.Router();

const healthyDataTable = require('../models/AddHealth.js');

router.get('/',async(req,res) => {
    try {
        res.status(200).send({message: 'Healthy Website is live'})
    } catch (error) {
        res.status(500).send({message : "Internal Server Error"});
    }
})

router.get('/healthyData',async(req,res)=> {
    try {
        const healthyData = await healthyDataTable.find();
        res.status(200).send({status: true, message : 'fetch success', healthyData});
    } catch (error) {
        res.status(500).send({status:false, message : 'internal server error'});
    }
})

module.exports = router;