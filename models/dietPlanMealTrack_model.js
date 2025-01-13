
var mongoose = require('mongoose');
const {FoodMeals,FoodCategory} = require("../Helpers/constants")
const {DietApp} = require('../utility/connection');
var DietPlanTrackSchema = new mongoose.Schema({
    mealType: {
        type: String,
        enum: [FoodMeals.Breakfast, FoodMeals.Lunch, FoodMeals.Dinner, FoodMeals.Snack, FoodMeals.Pre_Workout, FoodMeals.Post_Workout],
        required: true,
    }, 
    items: [
        {
            type: { 
                type: String, 
                enum: [FoodCategory.FoodItem, FoodCategory.Recipe],  //FoodCategory.Supplement
                required: true 
            },
            referenceId: { type: mongoose.Schema.Types.ObjectId, refPath: 'meals.items.type', required: true },
            quantity:{type:Number,required:true}
        },
    ],
    meal_id:{type:String ,required:true},
    totalMealNutrients:{
        TotalCalories: {type:String ,required:true},
        TotalFat: {type:String ,required:true},
        TotalProtein: {type:String ,required:true},
        TotalCarbohydrates:{type:String ,required:true} 
    },
    // status:{ type: String, required: true }, 
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    dietPlan_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DietPlan' },
},
{ timestamps: true });

const DietPlanTrack = DietApp.model('DietPlanTrack', DietPlanTrackSchema);
module.exports = {
    DietPlanTrack
};
