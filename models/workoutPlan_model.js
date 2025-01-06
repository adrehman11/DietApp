
var mongoose = require('mongoose');
// const {FoodMeals,FoodCategory} = require("../Helpers/constants")
const {DietApp} = require('../utility/connection');
var WorkoutPlanSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    numberOfweeks: { type: Number, required: true }, 
    exercises: [
        {
            day: {
                name: String,
                // enum: [FoodMeals.Breakfast, FoodMeals.Lunch, FoodMeals.Dinner, FoodMeals.Snack, FoodMeals.Pre_Workout, FoodMeals.Post_Workout],
                required: true,
            }, 
            strength:[
                {
                    exercise_name : { name: String,required: true},
                    exercise_details:[
                        {
                            RIR:{type:String,required:true},
                            Tempo:{type:String,required:true},
                            Rest:{type:String,required:true},
                            Kg:{type:String,required:true},
                            Reps:{type:String,required:true}
                        }
                    ]
                }

            ],
            cardio:[

            ],
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
},
{ timestamps: true });

const WorkoutPlan = DietApp.model('workoutPlan', WorkoutPlanSchema);
module.exports = {
    WorkoutPlan
};
