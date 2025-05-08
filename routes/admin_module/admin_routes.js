var express = require('express');
const Router = express.Router();
const AdminControllerFood = require("../../controller/admin_controllers/admin_food");
const AdminControllerExercise = require("../../controller/admin_controllers/admin_workout");
const AdminControllerRoles = require("../../controller/admin_controllers/admin_roles");
const AdminControllerListing = require("../../controller/admin_controllers/admin_listing");

const { Roles } = require("../../Helpers/constants");

// const Coach_client_Controller = require("../../controller/coach_controllers/coach_clients");
// const upload = require("../../utility/aws")
const authorization = require("../../middlewares/coachauth");
const upload = require("../../utility/aws")

const {
  AddFoodItems,
  getAllFoodItems,
  AddFoodRecipe,
  addWorkoutExercise ,
  AddRole,
  getAllFoodRecipe,
  AddSupplement,
  getCoachAdminData,
  getAllCoach,
  login,
  getAllWorkoutExercises,
  getCustomerSupportByID,
  editWorkoutExercise,
  getAllStaff
  } = require("../../middlewares/index");

  Router.post('/login',login,AdminControllerRoles.login);



  Router.post('/addFoodItems',authorization([Roles.admin]),AddFoodItems,AdminControllerFood.addFoodItems);
  Router.post('/getAllFoodItems',authorization([Roles.admin]),getAllFoodItems,AdminControllerFood.getAllFoodItems);
  Router.post('/addFoodRecipe',authorization([Roles.admin]),AddFoodRecipe,AdminControllerFood.addFoodRecipe);
  Router.post('/getAllFoodRecipe',authorization([Roles.admin]),getAllFoodRecipe,AdminControllerFood.getAllFoodRecipe);
  Router.post('/addSupplement',authorization([Roles.admin]),AddSupplement,AdminControllerFood.AddSupplement);
  Router.post('/getAllSupplement',authorization([Roles.admin]),getAllFoodRecipe,AdminControllerFood.getAllSupplement);


  Router.post('/addWorkoutExercise',authorization([Roles.admin]),upload.single("image"),addWorkoutExercise,AdminControllerExercise.addWorkoutExercise);
  Router.post('/editWorkoutExercise',authorization([Roles.admin]),upload.single("image"),editWorkoutExercise,AdminControllerExercise.editWorkoutExercise);
  Router.post('/getAllWorkoutExercises',authorization([Roles.admin]),getAllWorkoutExercises,AdminControllerExercise.getAllWorkoutExercises);


  //Add Roles
  Router.post('/addRoll',authorization([Roles.admin]),upload.single("image"),AddRole,AdminControllerRoles.AddRoles);


//coach
Router.post('/getAllCoach',authorization([Roles.admin]),getAllCoach,AdminControllerListing.getAllCoach);
Router.post('/getCoachAdminData',authorization([Roles.admin]),getCoachAdminData,AdminControllerListing.getCoachAdminData);
Router.post('/getAllTeamLeads',authorization([Roles.admin]),getAllCoach,AdminControllerListing.getAllTeamleads);
Router.post('/GetAllCustomerSupport',authorization([Roles.admin]),getAllCoach,AdminControllerListing.getAllCustomerSupport);
Router.post('/getCustomerSupportByID',authorization([Roles.admin]),getCustomerSupportByID,AdminControllerListing.getCustomerSupportByID);
Router.post('/GetAllStaff',authorization([Roles.admin]),getAllStaff,AdminControllerListing.getAllStaff);




  
  
  module.exports = Router;

  