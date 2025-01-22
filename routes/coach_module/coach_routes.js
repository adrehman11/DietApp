var express = require('express');
const Router = express.Router();
const CoachController = require("../../controller/coach_controllers/coach.js");
const Coach_client_Controller = require("../../controller/coach_controllers/coach_clients");
const Coach_Plans = require("../../controller/coach_controllers/coach_plans");
const Schedule_checkIn = require("../../controller/coach_controllers/schedule");
const upload = require("../../utility/aws")
const authMiddleware = require("../../middlewares/coachauth");

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
    scheduleChekcIn,
    getAllScheduleChekcIn,
    editDietPlan,
    editWorkoutPlan
  } = require("../../middlewares/index");


  Router.post('/login',login,CoachController.login);
  Router.post('/getAllClientsByFilter',authMiddleware,getAllClientsByFilter,Coach_client_Controller.getClientsByFilter);
  Router.post('/getClientById',authMiddleware,getClientById,Coach_client_Controller.getClientById);

  
  //Diet Plan Apis
  Router.get('/get/MealsAndCategory',authMiddleware,Coach_Plans.getMealsAndCategory);
  Router.post('/get/AllFoodItems',authMiddleware,AllFoodItems,Coach_Plans.getAllFood);
  Router.post('/create/DietPlan',authMiddleware,createDietPlan,Coach_Plans.createDietPlan);
  Router.post('/edit/DietPlan',authMiddleware,editDietPlan,Coach_Plans.editDietPlan);
  Router.post('/get/DietPlans',authMiddleware,getAllDietPlans,Coach_Plans.getAllDietPlans);
  Router.post('/get/DietPlanById',authMiddleware,getDietPlanID,Coach_Plans.getDietPlanById);

  //Workout Plan Apis

  Router.post('/get/workoutExercises',authMiddleware,AllWorkoutExercise,Coach_Plans.getAllWorkoutExercises);
  Router.post('/create/workoutPlan',authMiddleware,createWorkoutPlan,Coach_Plans.createWorkoutPlan);
  Router.post('/edit/workoutPlan',authMiddleware,editWorkoutPlan,Coach_Plans.editWorkoutPlan);
  
  Router.post('/get/workoutPlan',authMiddleware,getAllWorkoutPlans,Coach_Plans.getAllWorkoutplan);
  Router.post('/get/workoutPlanById',authMiddleware,getWorkoutPlanID,Coach_Plans.getWorkoutplanById);

  //schedule Check In 
  Router.post('/scheduleCheckIn',authMiddleware,scheduleChekcIn,Schedule_checkIn.scheduleCheckIn);
  Router.post('/getAllScheduleCheckIn',authMiddleware,getAllScheduleChekcIn,Schedule_checkIn.getAllscheduleCheckIn);



  
  
  module.exports = Router;

  