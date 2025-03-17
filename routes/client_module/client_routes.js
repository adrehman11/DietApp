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
    completeMeal,
    scheduleCheckInByType,
    completeExercise,
    scheduleCheckInTrackDiet,
    scheduleCheckInTrackWorkout,
    generateSupportTicket,
    chatOnTicket,
    getSupportTicketChatById
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

  //generate Ticket
  Router.post("/createSupportTicket",authMiddleware,upload.single("image"),generateSupportTicket,UserController.createSupportTicket )
  Router.get("/getSupportTickets",authMiddleware,UserController.getAllSupportTicket )
  Router.post('/chatOnTicket',authMiddleware,chatOnTicket,UserController.chatOnTicket);
  Router.post('/getChatByTicketId',authMiddleware,getSupportTicketChatById,UserController.GetChatByTicketId);
  

  //stripe routes
  // Router.post('/create-checkout-session',authMiddleware,UserController.GetChatByTicketId);


  

  module.exports = Router;

  