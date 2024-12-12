
const { Coach } = require('../../models/coach_model')
const {Roles,Form_Types} = require("../../Helpers/constants")
const JWT = require("jsonwebtoken");
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

exports.login = async function (req, res) {
    try {
        let data = await Coach.findOne({ email: req.body.email,role:Roles.coach})
        if(!data)
        {
            throw "No email found"
        }
        // if(!data.email_verified)
        // {
        //   throw "email not verified"
        // }
        if (!bcrypt.compareSync(req.body.password, data.passwordHash)) {
          throw "Invalid Password"
        }
        const secret =process.env.jwtSecret
        const token = JWT.sign({
          id: data._id,
         }, secret, { expiresIn: '3650d' });
        
         //login work
         await Coach.updateOne({ _id: data._id  },{isLogin:true})
        return res.status(200).json({ token:token });
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }




}
