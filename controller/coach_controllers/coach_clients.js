
const { Coach } = require('../../models/coach_model')
const { User } = require('../../models/client_model')
const {Roles,Form_Types} = require("../../Helpers/constants")
const JWT = require("jsonwebtoken");
const mongoose = require('mongoose');

exports.getClientsByFilter = async function (req, res) {
    try {
        let coach = req.user
       if(req.body.type == "All")
       {
           let Data = await User.find({coach_id:coach._id}).select('full_name diet_plan_status workout_plan_status');
       }
        return res.status(200).json({ token:token });
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }




}
