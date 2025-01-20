
var mongoose = require('mongoose');
// const {FoodMeals,FoodCategory} = require("../Helpers/constants")
const {DietApp} = require('../utility/connection');
var WorkoutExerciseSchema = new mongoose.Schema({
    exercise_name: { type: String, required: true }, 
    image: { type: String, required: true }, 
    category: { type: String, required: true }, 
    target_muscle: { type: String, required: true }, 
    equipment: { type: String, required: true }, 
    exercise_type: { type: String, required: true }, 
    video_url: { type: String, required: true }, 
    description: { type: String, required: true }, 
    // cardio_duration: { type: Number, required: true }, 
    kg:{ type: Number, required: true },
    RepsPerSet:{ type: Number, required: true },
    Tempo:{ type: Number, required: true },
    RestTime:{ type: Number, required: true },
},
{ timestamps: true });

const WorkoutExercise = DietApp.model('WorkoutExercise', WorkoutExerciseSchema);
module.exports = {
    WorkoutExercise
};
