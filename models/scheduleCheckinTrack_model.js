
var mongoose = require('mongoose');
const {DietApp} = require('../utility/connection');

var ScheduleCheckInTrackSchema = new mongoose.Schema({
    schedule_id:{type: mongoose.Schema.Types.ObjectId, ref: 'ScheduleCheckIn'},
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    committementLevel :{type:String},
    weight :{type:String},
    bodyImages:{type:String},
    chestMeasurement:{type:String},
    stomachMeasurement:{type:String},
    waistMeasurement:{type:String},
    hipsMeasurement:{type:String},
    thighMeasurement:{type:String},
    calvesMeasurement:{type:String},
    reviewExperience:{type:String},
    trainingInGeneral:{type:String},
    progressWeightsReps:{type:String},
    noOfSetsSuitable:{type:String},
    trainingIntensity:{type:String},
    rateDegreeMuscleRecovery:{type:String},
    exerciseCausePain:{type:String},
},
{ timestamps: true });

const ScheduleCheckInTrack = DietApp.model('ScheduleCheckInTrack', ScheduleCheckInTrackSchema);
module.exports = {
    ScheduleCheckInTrack
};
