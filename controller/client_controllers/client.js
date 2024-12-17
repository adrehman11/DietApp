
const { User } = require('../../models/client_model')
const { Form } = require('../../models/form_model')
const jwt = require("jsonwebtoken")
const {Roles,Form_Types,Form_Status,Plan_Status,Subscription_Status} = require("../../Helpers/constants")
const {otp_code,hash} = require ("../../Helpers/helperFunction")
const moment = require('moment');
const JWT = require("jsonwebtoken");
const mongoose = require('mongoose');
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.sendgrid_apikey);
const bcrypt = require('bcryptjs');

exports.signup = async function (req, res) {
  try {
      let data = await User.findOne({ email: req.body.email,role:Roles.client})
      if(data)
      {
        return res.status(400).json({
          msg: "Email already exsist",
      })
      }
      let passwordHash = await hash(req.body.password);
      await User.create({passwordHash:passwordHash,email:req.body.email,role:Roles.client,full_name:req.body.full_name,gender:req.body.gender})
      let otpCode = await otp_code()
      let otpCode_timestamp= Date.now()
      await User.updateOne(
        { email: req.body.email, role: Roles.client },
        { otpCode: otpCode, otpCode_timestamp: otpCode_timestamp }
      );
      const msg = {
        to: req.body.email,
        from: {
           email: process.env.SENDER_EMAIL,
            name: process.env.SENDER_NAME,
         },
        templateId: process.env.SINGUP_OTP_EMAIL_TEMPLATE_ID,
        dynamicTemplateData: {
        otpCode,
        },
    };
  
      await sgMail.send(msg);
      return res.status(200).json({
          msg: "OTP Sended",
      })
  }
  catch (err) {
      console.log(err)
      res.status(500).json( err )
  }




}
exports.login = async function (req, res) {
    try {
        let data = await User.findOne({ email: req.body.email,role:Roles.client})
        if(!data)
        {
            throw "No email found please signup"
        }
        if(!data.email_verified)
        {
          throw "email not verified"
        }
        if (!bcrypt.compareSync(req.body.password, data.passwordHash)) {
          throw "Invalid Password"
        }
        const secret =process.env.jwtSecret
        const token = JWT.sign({
          id: data._id,
         }, secret, { expiresIn: '3650d' });
        
         //login work
         await User.updateOne({ _id: data._id  },{isLogin:true})
        return res.status(200).json({ token:token,isNewUser:data.isNewUser });
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ err })
    }




}
exports.OtpCodeVerification = async (req, res) => {
    try {
      let data = await User.findOne({ email: req.body.email,role:Roles.client})
      
      if (!data.otpCode_timestamp || !data.otpCode) {
        return res.status(400).json({ msg: "Please request for new email code." });
      }
      const now = moment(Date.now());
      const expDate = moment(parseInt(data.otpCode_timestamp, 10));
      const duration = moment.duration(now.diff(expDate));
      const elapsedTime = duration.asMinutes();
      if (elapsedTime > 5) {
        return res.status(400).json({ msg: 'Code expired. Please request for new code.' });
      }
      if (req.body.otpCode !== data.otpCode) {
        return res.status(409).json({ status: false, msg: 'Invalid code! Please request for a new code.' });
      }
      const secret =process.env.jwtSecret
      const token = JWT.sign({
        id: data._id,
       }, secret, { expiresIn: '3650d' });
      
       //login work
       await User.updateOne({ _id: data._id  },{isLogin:true,email_verified:true})
      return res.status(200).json({ msg: "Verified",token:token,isNewUser:data.isNewUser });
    } catch (error) {
      console.log("error in link verification:::::", error);
      return res.status(500).json({ msg: error.message });
    }
};
exports.firstTimeForm = async (req, res) => {
    try {
        let client = req.user
        if (req.files) {
            if (req.files.bodyImages?.length) {
              req.body.generalForm.bodyImages=[]
                req.body.generalForm.bodyImages.push(
                  ...req.files.bodyImages.map((file) => file.location)
                );
              }
            // else
            // {
            //     return res.status(400).json({ msg: "Bad Request, Body Image is missing" });
            // }
            if (req.files.MRI_XRAY_CT?.length) {
                req.body.workoutForm.MRI_XRAY_CT =req.files.MRI_XRAY_CT[0].location
              }
          }
          req.body.generalForm.form_Type = Form_Types.General
          req.body.workoutForm.form_Type = Form_Types.Workout
          req.body.dietForm.form_Type = Form_Types.Diet
          req.body.client_id =client.id
          req.body.form_status =Form_Status.Initial

          await Form.create(req.body)
          //update user 
          await User.updateOne({ _id: client._id  },{subsctiption_status:Subscription_Status.NotStarted, isNewUser:false ,diet_plan_status:Plan_Status.FirstPlanNeeded,workout_plan_status:Plan_Status.FirstPlanNeeded})
    
      
      return res.status(200).json({ msg: "First Time Form submited" });
    } catch (error) {
      console.log("error first time submit form", error);
      return res.status(500).json({ msg: error.message });
    }
};