const express = require('express');
const jwt = require('jsonwebtoken');
const Admin_User = require('../models/AdminUser.js');
const Router = express.Router();

// admin register
Router.post('/register',async (req,res) => { 
    const { email , password} = req.body;
    try {
        let admin_user = await Admin_User.findOne({email});
        if(admin_user) {
            return res.status(400).send({message: 'Admin Already exist'});
        }
        admin_user = new Admin_User({ email , password});
        await admin_user.save();
        const payload = { userId : admin_user._id};
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn : '1h'});
        res.status(201).send({message : 'Admin Registration Success' ,token});
    } catch (error) {
        res.status(500).send({message:'Server Errror'});
    }
});

// admin login
Router.post('/login', async (req,res) => { 
    const { email, password } = req.body;
    try {
        const admin_user = await Admin_User.findOne({email});
        if(!admin_user) {
            return res.status(400).send({message:'Invalid Credentials'});
        }
        const isMatch = await admin_user.comparePassword(password);
        if(!isMatch) {
            return res.status(400).send({message : "Password is not correct"});
        }
        const payload = {userId : admin_user._id};
        const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn :'1h'});
        res.status(200).send({message:'Login Success',token});
    } catch (error) {
        res.status(500).send({message : 'Server Error'});
    }
})


module.exports = Router;