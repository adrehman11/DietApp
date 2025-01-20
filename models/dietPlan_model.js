
var mongoose = require('mongoose');
const {FoodMeals,FoodCategory} = require("../Helpers/constants")
const {DietApp} = require('../utility/connection');
var DietPlanSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    numberOfDays: { type: Number, required: true }, 
    meals: [
        {
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
        },
    ],
    status:{ type: String, required: true }, 
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    coach_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Coach' },
    coach_notes:{type: String}
},
{ timestamps: true });

const DietPlan = DietApp.model('DietPlan', DietPlanSchema);
module.exports = {
    DietPlan
};
