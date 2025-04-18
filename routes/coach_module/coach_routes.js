var express = require('express');
const Router = express.Router();
const CoachController = require("../../controller/coach_controllers/coach.js");
const ChatController = require("../../controller/common_controllers/chat.js");
const Coach_client_Controller = require("../../controller/coach_controllers/coach_clients");
const Coach_Plans = require("../../controller/coach_controllers/coach_plans");
const Schedule_checkIn = require("../../controller/coach_controllers/schedule");
const upload = require("../../utility/aws")
const authorization = require("../../middlewares/coachauth.js");
const { Roles } = require("../../Helpers/constants.js");


const {
    login, 
    AllFoodItems,
    getAllClientsByFilter,
    getClientById,
    createDietPlan,
    getAllDietPlans,
    getDietPlanID,
    AllWorkoutExercise,
    createWorkoutPlan,
    getAllWorkoutPlans,
    getWorkoutPlanID,
    scheduleCheckIn,
    getAllScheduleCheckIn,
    editDietPlan,
    editWorkoutPlan,
    scheduleCheckInByType,
    assignCoach,
    getAllCoach,
    deleteDietPlan,
    getTeamLeadClientsByFilter,
    getAllPlansByFilter,
    editProfile,
    importData,
    importDietPlan,
    importWorkoutPlan
  } = require("../../middlewares/index");


  Router.post('/login',login,CoachController.login);
  Router.post('/editProfile',authorization([Roles.coach,Roles.teamLead,Roles.admin]),upload.single("image"),editProfile,CoachController.editProfile);
  Router.get('/getProfileDetails',authorization([Roles.coach,Roles.teamLead,Roles.admin]),CoachController.getProfileData);
  Router.post('/getAllClientsByFilter',authorization([Roles.coach,Roles.teamLead,Roles.admin]),getAllClientsByFilter,Coach_client_Controller.getClientsByFilter);
  Router.post('/getClientById',authorization([Roles.coach,Roles.teamLead,Roles.admin]),getClientById,Coach_client_Controller.getClientById);

  
  //Diet Plan Apis
  Router.get('/get/MealsAndCategory',authorization([Roles.coach,Roles.teamLead,Roles.admin]),Coach_Plans.getMealsAndCategory);
  Router.post('/get/AllFoodItems',authorization([Roles.coach,Roles.teamLead,Roles.admin]),AllFoodItems,Coach_Plans.getAllFood);
  Router.post('/create/DietPlan',authorization([Roles.coach,Roles.teamLead,Roles.admin]),createDietPlan,Coach_Plans.createDietPlan);
  Router.post('/edit/DietPlan',authorization([Roles.coach,Roles.teamLead,Roles.admin]),editDietPlan,Coach_Plans.editDietPlan);
  Router.post('/delete/DietPlan',authorization([Roles.coach,Roles.teamLead,Roles.admin]),deleteDietPlan,Coach_Plans.deletePlan);
  Router.post('/get/DietPlans',authorization([Roles.coach,Roles.teamLead,Roles.admin]),getAllDietPlans,Coach_Plans.getAllDietPlans);
  Router.post('/get/DietPlanById',authorization([Roles.coach,Roles.teamLead,Roles.admin]),getDietPlanID,Coach_Plans.getDietPlanById);

  //Workout Plan Apis

  Router.post('/get/workoutExercises',authorization([Roles.coach,Roles.teamLead,Roles.admin]),AllWorkoutExercise,Coach_Plans.getAllWorkoutExercises);
  Router.post('/create/workoutPlan',authorization([Roles.coach,Roles.teamLead,Roles.admin]),createWorkoutPlan,Coach_Plans.createWorkoutPlan);
  Router.post('/edit/workoutPlan',authorization([Roles.coach,Roles.teamLead,Roles.admin]),editWorkoutPlan,Coach_Plans.editWorkoutPlan);
  
  Router.post('/get/workoutPlan',authorization([Roles.coach,Roles.teamLead,Roles.admin]),getAllWorkoutPlans,Coach_Plans.getAllWorkoutplan);
  Router.post('/get/workoutPlanById',authorization([Roles.coach,Roles.teamLead,Roles.admin]),getWorkoutPlanID,Coach_Plans.getWorkoutplanById);

  //schedule Check In 
  Router.post('/scheduleCheckIn',authorization([Roles.coach,Roles.teamLead,Roles.admin]),scheduleCheckIn,Schedule_checkIn.scheduleCheckIn);
  Router.post('/getAllScheduleCheckIn',authorization([Roles.coach,Roles.teamLead,Roles.admin]),getAllScheduleCheckIn,Schedule_checkIn.getAllscheduleCheckIn);
  Router.post('/getScheduleCheckInData',authorization([Roles.coach,Roles.teamLead,Roles.admin]),scheduleCheckInByType,Schedule_checkIn.getScheduleCheckData);

 //assign coach team lead routes
  Router.post('/AssignCoach',authorization([Roles.teamLead,Roles.admin]),assignCoach,CoachController.assignCoach);
  Router.post('/getAllCoach',authorization([Roles.teamLead,Roles.admin]),getAllCoach,Coach_client_Controller.getAllCoach);


  //common api
  Router.post('/getTeamLeadClientsByFilter',authorization([Roles.teamLead,Roles.admin]),getTeamLeadClientsByFilter,Coach_client_Controller.getTeamClientsByFilter)



  //plan history
  Router.post('/getAllPlansByFilter',authorization([Roles.coach]),getAllPlansByFilter,Coach_Plans.getAllPlansByCoach);


  //import data 
  Router.post('/getAllDietPlansToImport',authorization([Roles.coach]),importData,Coach_Plans.getAllDietPlansToImport);
  Router.post('/getAllWorkoutPlansToImport',authorization([Roles.coach]),importData,Coach_Plans.getAllWorkoutPlanToImport);
  Router.post('/importDietPlan',authorization([Roles.coach]),importDietPlan,Coach_Plans.importDietPlan);
  Router.post('/importWorkoutPlan',authorization([Roles.coach]),importWorkoutPlan,Coach_Plans.importWorkoutPlan);

  //chat module
  Router.get('/inboxChat',authorization([Roles.coach]),ChatController.getInboxChatRooms);





  
  
  module.exports = Router;

  