var express = require('express');
const Router = express.Router();
const AdminController = require("../../controller/admin_controllers/admin_food");
// const Coach_client_Controller = require("../../controller/coach_controllers/coach_clients");
// const upload = require("../../utility/aws")
// const authMiddleware = require("../../middlewares/coachauth");

const {
  AddFoodItems,
  AddFoodRecipe 
  } = require("../../middlewares/index");


  Router.post('/addFoodItems',AddFoodItems,AdminController.addFoodItems);
  Router.post('/addFoodRecipe',AddFoodRecipe,AdminController.addFoodRecipe);
  
  module.exports = Router;

  