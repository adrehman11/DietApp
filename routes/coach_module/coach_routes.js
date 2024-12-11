var express = require('express');
const Router = express.Router();
const UserController = require("../../controller/client_controllers/client.js");
const upload = require("../../utility/aws")
const authMiddleware = require("../../middlewares/auth");

const {
    login, 
    otpCodeVerification,
    firstTimeForm
  } = require("../../middlewares/index");


  // Router.post('/login',login,UserController.login);
  // Router.post('/verify/otp',otpCodeVerification,UserController.OtpCodeVerification);
  // Router.post('/submit/Form',authMiddleware,upload.fields([{name: 'bodyImages', maxCount: 3}, {name: 'MRI_XRAY_CT', maxCount: 1}]),firstTimeForm,UserController.firstTimeForm);
  
  module.exports = Router;

  