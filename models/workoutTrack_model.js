
var mongoose = require('mongoose');
const {DietApp} = require('../utility/connection');
var WorkoutPlanTrackSchema = new mongoose.Schema({
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    workoutPlan_id: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkoutPlan' },
},
{ timestamps: true });

const WorkoutPlanTrack = DietApp.model('WorkoutPlanTrack', WorkoutPlanTrackSchema);
module.exports = {
    WorkoutPlanTrack
};
