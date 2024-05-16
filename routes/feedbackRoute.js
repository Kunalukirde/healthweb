const express = require('express');

const router = express.Router();

router.post('/', (req,res) => {
    try {
        const feedback = req.body;
        res.status(200).send({status:true, message:'sent success' ,feedback});
    } catch (error) {
        res.status(409).send({message:'Internal Server Error'});
    }
});


module.exports = router;