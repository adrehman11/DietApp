
var mongoose = require('mongoose');
const {DietApp} = require('../utility/connection');
var WorkoutPlanSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    numberOfweeks: { type: Number, required: true }, 
    exercises: [
        {
            day: {
                type: String,
                required: true,
            }, 
            strength:{
                    WorkoutName : { type: String,required: true},
                    exercise_details:[
                        {
                            exercise_name:{type:String,required:true},
                            Set:{type:String,required:true},
                            RIR:{type:String,required:true},
                            Tempo:{type:String,required:true},
                            Rest:{type:String,required:true},
                            Kg:{type:String,required:true},
                            Reps:{type:String,required:true}
                        }
                    ]
                },
            cardio:{type:String}
        },
    ],
    status:{ type: String, required: true }, 
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    coach_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Coach' },
    coach_notes:{type: String}
},
{ timestamps: true });

const WorkoutPlan = DietApp.model('WorkoutPlan', WorkoutPlanSchema);
module.exports = {
    WorkoutPlan
};
