var express = require('express');
const Router = express.Router();
const StaffController = require("../../controller/staff_controllers/staff");
const PaymentController = require("../../controller/client_controllers/payment");
const { Roles } = require("../../Helpers/constants");

const authorization = require("../../middlewares/coachauth");

const {
    login,
    getStaffClientsByFilter,
    getClientById,
    changeSubscriptionStatusByClientId,
    changeSubscriptionTypeByClientId
  } = require("../../middlewares/index");

  Router.post('/login',login,StaffController.login); 
  Router.post('/getStaffClientsByFilter',authorization([Roles.staff]),getStaffClientsByFilter,StaffController.getClientsByFilter);
  Router.post('/getStaffClientById',authorization([Roles.staff]),getClientById,StaffController.getClientById);
  Router.post('/changeSubscriptionStatusByClientId',authorization([Roles.staff]),changeSubscriptionStatusByClientId,StaffController.changeSubscriptionStatusByClientId);
  Router.post('/RefundClient',authorization([Roles.staff]),getClientById,PaymentController.refundSales);
  Router.post('/changeSubscriptionType',authorization([Roles.staff]),changeSubscriptionTypeByClientId,StaffController.changeSubscriptionTypeByClientId);
  




  
  
  module.exports = Router;

  