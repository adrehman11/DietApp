var express = require('express');
const Router = express.Router();
const AdminControllerFood = require("../../controller/admin_controllers/admin_food");
const AdminControllerExercise = require("../../controller/admin_controllers/admin_workout");
// const Coach_client_Controller = require("../../controller/coach_controllers/coach_clients");
// const upload = require("../../utility/aws")
// const authMiddleware = require("../../middlewares/coachauth");
const upload = require("../../utility/aws")

const {
  AddFoodItems,
  AddFoodRecipe,
  addWorkoutExercise 
  } = require("../../middlewares/index");


  Router.post('/addFoodItems',AddFoodItems,AdminControllerFood.addFoodItems);
  Router.post('/addFoodRecipe',AddFoodRecipe,AdminControllerFood.addFoodRecipe);


  Router.post('/addWorkoutExercise',upload.single("image"),addWorkoutExercise,AdminControllerExercise.addWorkoutExercise);
  
  module.exports = Router;

  