var express = require('express');
const Router = express.Router();
const SupportController = require("../../controller/support_controllers/support");
const { Roles } = require("../../Helpers/constants");

const authorization = require("../../middlewares/coachauth");
const upload = require("../../utility/aws")

const {
    getSupportTicketByType,
    login,
    updateTicketStatus,
    chatOnTicket,
    getSupportTicketChatById

  } = require("../../middlewares/index");

  Router.post('/login',login,SupportController.login);
  Router.post('/getSupportTicketByType',authorization([Roles.customerSupport]),getSupportTicketByType,SupportController.GetAllTickets);
  Router.post('/updateStatus',authorization([Roles.customerSupport]),updateTicketStatus,SupportController.UpdateTicketStatus);
  Router.post('/chatOnTicket',authorization([Roles.customerSupport]),chatOnTicket,SupportController.chatOnTicket);
  Router.post('/getChatByTicketId',authorization([Roles.customerSupport]),getSupportTicketChatById,SupportController.GetChatByTicketId);




  
  
  module.exports = Router;

  