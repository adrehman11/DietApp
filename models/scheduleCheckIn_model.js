
var mongoose = require('mongoose');
const {DietApp} = require('../utility/connection');
const {ScheduleCheckInType} = require("../Helpers/constants")

var ScheduleCheckInSchema = new mongoose.Schema({
    type: { 
        type: String,
        enum: [ScheduleCheckInType.Diet,ScheduleCheckInType.Workout],
        required: true 
        }, 
    date: { type: Date, required: true }, 
    status:{ type: String, required: true }, 
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    coach_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Coach' },
},
{ timestamps: true });

const ScheduleCheckIn = DietApp.model('ScheduleCheckIn', ScheduleCheckInSchema);
module.exports = {
    ScheduleCheckIn
};
