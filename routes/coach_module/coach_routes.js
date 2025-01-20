var express = require('express');
const Router = express.Router();
const CoachController = require("../../controller/coach_controllers/coach.js");
const Coach_client_Controller = require("../../controller/coach_controllers/coach_clients");
const Coach_Plans = require("../../controller/coach_controllers/coach_plans");
const upload = require("../../utility/aws")
const authMiddleware = require("../../middlewares/coachauth");

const {
    login, 
    AllFoodItems,
    createDietPlan,
    getAllDietPlans,
    getDietPlanID,
    AllWorkoutExercise,
    createWorkoutPlan,
    getAllWorkoutPlans,
    getWorkoutPlanID
  } = require("../../middlewares/index");


  Router.post('/login',login,CoachController.login);
  Router.post('/getAllClientsByFilter',authMiddleware,Coach_client_Controller.getClientsByFilter);

  
  //Diet Plan Apis
  Router.get('/get/MealsAndCategory',authMiddleware,Coach_Plans.getMealsAndCategory);
  Router.post('/get/AllFoodItems',authMiddleware,AllFoodItems,Coach_Plans.getAllFood);
  Router.post('/create/DietPlan',authMiddleware,createDietPlan,Coach_Plans.createDietPlan);
  Router.post('/get/DietPlans',authMiddleware,getAllDietPlans,Coach_Plans.getAllDietPlans);
  Router.post('/get/DietPlanById',authMiddleware,getDietPlanID,Coach_Plans.getDietPlanById);

  //Workout Plan Apis

  Router.post('/get/workoutExercises',authMiddleware,AllWorkoutExercise,Coach_Plans.getAllWorkoutExercises);
  Router.post('/create/workoutPlan',authMiddleware,createWorkoutPlan,Coach_Plans.createWorkoutPlan);
  Router.post('/get/workoutPlan',authMiddleware,getAllWorkoutPlans,Coach_Plans.getAllWorkoutplan);
  Router.post('/get/workoutPlanById',authMiddleware,getWorkoutPlanID,Coach_Plans.getWorkoutplanById);



  
  
  module.exports = Router;

  