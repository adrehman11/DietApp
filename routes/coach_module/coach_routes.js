var express = require('express');
const Router = express.Router();
const CoachController = require("../../controller/coach_controllers/coach.js");
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
    deleteDietPlan
  } = require("../../middlewares/index");


  Router.post('/login',login,CoachController.login);
  Router.post('/getAllClientsByFilter',authorization([Roles.coach,Roles.teamLead]),getAllClientsByFilter,Coach_client_Controller.getClientsByFilter);
  Router.post('/getClientById',authorization([Roles.coach,Roles.teamLead]),getClientById,Coach_client_Controller.getClientById);

  
  //Diet Plan Apis
  Router.get('/get/MealsAndCategory',authorization([Roles.coach,Roles.teamLead]),Coach_Plans.getMealsAndCategory);
  Router.post('/get/AllFoodItems',authorization([Roles.coach,Roles.teamLead]),AllFoodItems,Coach_Plans.getAllFood);
  Router.post('/create/DietPlan',authorization([Roles.coach,Roles.teamLead]),createDietPlan,Coach_Plans.createDietPlan);
  Router.post('/edit/DietPlan',authorization([Roles.coach,Roles.teamLead]),editDietPlan,Coach_Plans.editDietPlan);
  Router.post('/delete/DietPlan',authorization([Roles.coach,Roles.teamLead]),deleteDietPlan,Coach_Plans.deletePlan);
  Router.post('/get/DietPlans',authorization([Roles.coach,Roles.teamLead]),getAllDietPlans,Coach_Plans.getAllDietPlans);
  Router.post('/get/DietPlanById',authorization([Roles.coach,Roles.teamLead]),getDietPlanID,Coach_Plans.getDietPlanById);

  //Workout Plan Apis

  Router.post('/get/workoutExercises',authorization([Roles.coach,Roles.teamLead]),AllWorkoutExercise,Coach_Plans.getAllWorkoutExercises);
  Router.post('/create/workoutPlan',authorization([Roles.coach,Roles.teamLead]),createWorkoutPlan,Coach_Plans.createWorkoutPlan);
  Router.post('/edit/workoutPlan',authorization([Roles.coach,Roles.teamLead]),editWorkoutPlan,Coach_Plans.editWorkoutPlan);
  
  Router.post('/get/workoutPlan',authorization([Roles.coach,Roles.teamLead]),getAllWorkoutPlans,Coach_Plans.getAllWorkoutplan);
  Router.post('/get/workoutPlanById',authorization([Roles.coach,Roles.teamLead]),getWorkoutPlanID,Coach_Plans.getWorkoutplanById);

  //schedule Check In 
  Router.post('/scheduleCheckIn',authorization([Roles.coach,Roles.teamLead]),scheduleCheckIn,Schedule_checkIn.scheduleCheckIn);
  Router.post('/getAllScheduleCheckIn',authorization([Roles.coach,Roles.teamLead]),getAllScheduleCheckIn,Schedule_checkIn.getAllscheduleCheckIn);
  Router.post('/getScheduleCheckInData',authorization([Roles.coach,Roles.teamLead]),scheduleCheckInByType,Schedule_checkIn.getScheduleCheckData);

 //assign coach team lead routes
  Router.post('/AssignCoach',authorization([Roles.teamLead]),assignCoach,CoachController.assignCoach);
  Router.post('/getAllCoach',authorization([Roles.teamLead]),getAllCoach,Coach_client_Controller.getAllCoach);





  
  
  module.exports = Router;

  