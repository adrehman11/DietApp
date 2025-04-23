const {Roles,Form_Types} = require("../../Helpers/constants")
const { Coach }= require("../../models/coach_model")
const {  hash } = require("../../Helpers/helperFunction")
// const JWT = require("jsonwebtoken");
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const JWT = require("jsonwebtoken");

exports.login = async function (req, res) {
    try {
        let data = await Coach.findOne({ email: req.body.email,role:{ $in: [Roles.admin] }})
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
         
        return res.status(200).json({ token:token, email:data.email,role:data.role,U_ID:data.U_ID,id:data._id,image:data.image,full_name:data.full_name,bio:data.bio,status:data.status });
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }




}

exports.AddRoles = async function (req, res) {
    try {
        if ( req.file && req.file.location) {
            req.body.image =  req.file.location
          }
          req.body.passwordHash  = await hash(req.body.password);
         await Coach.create(req.body)
        return res.status(200).json({ message:"Roll Added" });
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}
