const express = require('express');
const feedbackTable = require('../models/feedback.js');

const router = express.Router();

router.post('/', async(req,res) => {
    try {
        const {feedback} = req.body;
        const doc = await feedbackTable({
            feedback:feedback
        })
        const saved_feedback = await doc.save();
        res.status(200).send({status:true, message:'sent success' ,saved_feedback});
    } catch (error) {
        res.status(409).send({message:'Internal Server Error'});
    }
});


module.exports = router;