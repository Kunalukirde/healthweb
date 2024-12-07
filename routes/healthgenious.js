const express = require('express');
const router = express.Router();
const searched_conditionsTable = require('../models/searchedConditions.js');

const healthgenious_DataTable = require('../models/AddHealth.js');

router.get('/',async(req,res) => {
    try {
        res.status(200).send({message: 'HealthGenious Website is live'})
    } catch (error) {
        res.status(500).send({message : "Internal Server Error"});
    }
})

router.get('/healthgeniousData',async(req,res)=> {
    try {
        const All_healthgenious_data = await healthgenious_DataTable.find();
        const healthgeniousData = All_healthgenious_data.reverse();
        res.status(200).send({status: true, message : 'fetch success', healthgeniousData});
    } catch (error) {
        res.status(500).send({status:false, message : 'internal server error'});
    }
})
router.post('/searchConditions',async(req,res) => {
    try {
        const searchConditions = req.body.searchConditions;
        const data = await searched_conditionsTable({
            searchConditions : searchConditions,
        })
        await data.save();
        res.status(200).send({message:"search success"});
    } catch (error) {
        // console.log(error);
    }
})

module.exports = router;