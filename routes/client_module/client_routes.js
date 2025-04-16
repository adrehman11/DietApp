var express = require('express');
const Router = express.Router();
const UserController = require("../../controller/client_controllers/client");
const ChatController = require("../../controller/common_controllers/chat");

const UserControllerPayment = require("../../controller/client_controllers/payment");
const upload = require("../../utility/aws")
const authMiddleware = require("../../middlewares/clientauth");
const {
    login,
    signup,
    otpCodeVerification,
    firstTimeForm,
    FlatObjects,
    completeMeal,
    scheduleCheckInByType,
    completeExercise,
    scheduleCheckInTrackDiet,
    scheduleCheckInTrackWorkout,
    generateSupportTicket,
    chatOnTicket,
    getSupportTicketChatById,
    inboxChatByRoomId,
  } = require("../../middlewares/index");

  Router.post('/login',login,UserController.login);
  Router.post('/signup',signup,UserController.signup);
  Router.post('/verify/otp',otpCodeVerification,UserController.OtpCodeVerification);
  Router.post('/submit/Form', authMiddleware,upload.fields([{ name: 'bodyImages', maxCount: 3 }, { name: 'MRI_XRAY_CT', maxCount: 1 }]), FlatObjects, firstTimeForm, UserController.firstTimeForm);
  Router.get('/getActiveDietPlans',authMiddleware, UserController.getActiveDietPlan)
  Router.post('/completeMeal',authMiddleware,completeMeal, UserController.progressDietPlan)


  //workoutplan
  Router.get('/getActiveWorkoutPlan',authMiddleware, UserController.getActiveWorkoutPlan)
  Router.post('/completeExercise',authMiddleware,completeExercise, UserController.completeWorkoutExercise)



  //scheduleCheckIn
  Router.post('/getScheduleCheckInByType',authMiddleware,scheduleCheckInByType, UserController.getScheduleCheckInByType)
  Router.post('/scheduleCheckInDiet',authMiddleware,upload.single("bodyImage"),scheduleCheckInTrackDiet, UserController.ScheduleCheckInTrackDiet)
  Router.post('/scheduleCheckInWorkout',authMiddleware,scheduleCheckInTrackWorkout, UserController.ScheduleCheckInTrackWorkout)

  //chat module
  Router.get('/inboxChatRooms',authMiddleware,ChatController.getInboxChatRooms);
  Router.post('/inboxChatByRoomId',authMiddleware,inboxChatByRoomId,ChatController.getInboxChatByRoomId);
  //generate Ticket
  Router.post("/createSupportTicket",authMiddleware,upload.single("image"),generateSupportTicket,UserController.createSupportTicket )
  Router.get("/getSupportTickets",authMiddleware,UserController.getAllSupportTicket )
  Router.post('/chatOnTicket',authMiddleware,chatOnTicket,UserController.chatOnTicket);
  Router.post('/getChatByTicketId',authMiddleware,getSupportTicketChatById,UserController.GetChatByTicketId);
  

  //stripe routes
  Router.post('/create-checkout-session',authMiddleware,UserControllerPayment.checkout_session);
  Router.get('/success',UserControllerPayment.success_session);
  Router.post('/create-checkout-session',UserControllerPayment.checkout_session);


  

  module.exports = Router;

  