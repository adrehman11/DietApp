var express = require('express');
const Router = express.Router();
const StaffController = require("../../controller/staff_controllers/staff");
const { Roles } = require("../../Helpers/constants");

const authorization = require("../../middlewares/coachauth");

const {
    login,
  } = require("../../middlewares/index");

  Router.post('/login',login,StaffController.login);
  




  
  
  module.exports = Router;

  