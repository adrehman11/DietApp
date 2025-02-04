
const { Coach } = require('../../models/coach_model')
const { User } = require('../../models/client_model')
const {Roles,Form_Types,ScheduleCheckInType} = require("../../Helpers/constants")
const JWT = require("jsonwebtoken");
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

exports.login = async function (req, res) {
    try {
        let data = await Coach.findOne({ email: req.body.email,role:{ $in: [Roles.coach,Roles.teamLead] }})
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
exports.editProfile = async function (req,res) {
    
}

exports.assignCoach = async function (req, res) {
    try {
        let coach = req.user;

        // Check if the user is a Team Lead
        if (coach.role !== Roles.teamLead) {
            return res.status(400).json({ msg: "Not Authorized" });
        }

        // Find client data
        let clientData = await User.findOne({ _id: req.body.clientId });
        if (!clientData) {
            return res.status(400).json({ msg: "No client found" });
        }

        // Find coach data
        let coachData = await Coach.findOne({ _id: req.body._id });
        if (!coachData) {
            return res.status(400).json({ msg: "No Coach found" });
        }

        let updateQuery = {};

        // Update coach assignment based on type
        if (req.body.type === ScheduleCheckInType.Diet) {
            updateQuery = { coach_id: req.body._id  };
        } else if (req.body.type === ScheduleCheckInType.Workout) {
            updateQuery = { workoutCoach_id: req.body._id  };
        } else {
            return res.status(400).json({ msg: "Invalid type" });
        }

        // Update user with the new coach
        await User.findOneAndUpdate({ _id: req.body.clientId }, updateQuery, { new: true });

        // Send success response
        res.status(200).json({ msg: "Coach assigned successfully" });

    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};
