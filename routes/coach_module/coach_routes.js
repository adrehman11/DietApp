var express = require('express');
const Router = express.Router();
const CoachController = require("../../controller/coach_controllers/coach.js");
const Coach_client_Controller = require("../../controller/coach_controllers/coach_clients");
const upload = require("../../utility/aws")
const authMiddleware = require("../../middlewares/coachauth");

const {
    login, 
  } = require("../../middlewares/index");


  Router.post('/login',login,CoachController.login);
  Router.post('/getAllClientsByFilter',authMiddleware,Coach_client_Controller.getClientsByFilter);
  // Router.post('/submit/Form',authMiddleware,upload.fields([{name: 'bodyImages', maxCount: 3}, {name: 'MRI_XRAY_CT', maxCount: 1}]),firstTimeForm,UserController.firstTimeForm);
  
  module.exports = Router;

  