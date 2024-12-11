
const { User } = require('../../models/client_model')
const { Form } = require('../../models/form_model')
const jwt = require("jsonwebtoken")
const {Roles,Form_Types} = require("../../Helpers/constants")
const otp_code = require ("../../Helpers/helperFunction")
const moment = require('moment');
const JWT = require("jsonwebtoken");
const mongoose = require('mongoose');

// exports.login = async function (req, res) {
//     try {
//         let data = await User.findOne({ email: req.body.email,role:Roles.client})
//         if(!data)
//         {
//             await User.create({email:req.body.email,role:Roles.client})
//         }
//         let otpCode = await otp_code()
//         let otpCode_timestamp= Date.now()
//         await User.update({otpCode:otpCode,otpCode_timestamp:otpCode_timestamp},{where:{email:req.body.email,role:Roles.client}})
//         const msg = {
//           to: req.body.email,
//           from: {
//              email: process.env.SENDER_EMAIL,
//               name: process.env.SENDER_NAME,
//            },
//           templateId: process.env.SINGUP_OTP_EMAIL_TEMPLATE_ID,
//           dynamicTemplateData: {
//           otpCode,
//           },
//       };
    
//         await sgMail.send(msg);
//         return res.status(200).json({
//             msg: "OTP Sended",
//         })
//     }
//     catch (err) {
//         console.log(err)
//         res.status(500).json({ err })
//     }




// }
// exports.OtpCodeVerification = async (req, res) => {
//     try {
//       let data = await User.findOne({ email: req.body.email,role:Roles.client})
      
//       if (!data.otpCode_timestamp || !data.otpCode) {
//         return res.status(400).json({ msg: "Please request for new email code." });
//       }
//       const now = moment(Date.now());
//       const expDate = moment(parseInt(data.otpCode_timestamp, 10));
//       const duration = moment.duration(now.diff(expDate));
//       const elapsedTime = duration.asMinutes();
//       if (elapsedTime > 5) {
//         return res.status(400).json({ msg: 'Code expired. Please request for new code.' });
//       }
//       if (req.body.otpCode !== data.otpCode) {
//         return res.status(409).json({ status: false, msg: 'Invalid code! Please request for a new code.' });
//       }
//       const secret =process.env.jwtSecret
//       const token = JWT.sign({
//         id: data._id,
//        }, secret, { expiresIn: '3650d' });
      
//        //login work
//        await User.update({ _id: mongoose.Types.ObjectId(data._id)  },{isLogin:true})
//       return res.status(200).json({ msg: "Verified",token:token,isNewUser:data.isNewUser });
//     } catch (error) {
//       console.log("error in link verification:::::", error);
//       return res.status(500).json({ msg: error.message });
//     }
// };
// exports.firstTimeForm = async (req, res) => {
//     try {
//         let client = req.user
//         if (req.files) {
//             if (req.files.bodyImages?.length) {
//                 req.body.generalForm.bodyImages.push(
//                   ...req.files.bodyImages.map((file) => file.location)
//                 );
//               }
//             else
//             {
//                 return res.status(400).json({ msg: "Bad Request, Body Image is missing" });
//             }
//             if (req.files.MRI_XRAY_CT?.length) {
//                 req.body.workoutForm.MRI_XRAY_CT.push(
//                   ...req.files.MRI_XRAY_CT.map((file) => file.location)
//                 );
//               }
//           }
    
//           req.body.generalForm.form_Type = Form_Types.General
//           req.body.generalForm.client_id = client._id
//           req.body.workoutForm.form_Type = Form_Types.Workout
//           req.body.workoutForm.client_id = client._id
//           req.body.dietForm.form_Type = Form_Types.Diet
//           req.body.dietForm.client_id = client._id

//           await Form.create(req.body.generalForm)
//           await Form.create(req.body.workoutForm)
//           await Form.create(req.body.dietForm)
      
//       return res.status(200).json({ msg: "First Time Form submited" });
//     } catch (error) {
//       console.log("error in link verification:::::", error);
//       return res.status(500).json({ msg: error.message });
//     }
// };