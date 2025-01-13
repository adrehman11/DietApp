var express = require('express');
const Router = express.Router();
const UserController = require("../../controller/client_controllers/client");
const upload = require("../../utility/aws")
const authMiddleware = require("../../middlewares/clientauth");

const {
    login,
    signup,
    otpCodeVerification,
    firstTimeForm,
    FlatObjects,
    completeMeal
  } = require("../../middlewares/index");

  Router.post('/login',login,UserController.login);
  Router.post('/signup',signup,UserController.signup);
  Router.post('/verify/otp',otpCodeVerification,UserController.OtpCodeVerification);
  Router.post('/submit/Form', authMiddleware,upload.fields([{ name: 'bodyImages', maxCount: 3 }, { name: 'MRI_XRAY_CT', maxCount: 1 }]), FlatObjects, firstTimeForm, UserController.firstTimeForm);
  Router.get('/getActiveDietPlans',authMiddleware, UserController.getActiveDietPlan)
  Router.post('/completeMeal',authMiddleware,completeMeal, UserController.progressDietPlan)

  module.exports = Router;

  