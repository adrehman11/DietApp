
var mongoose = require('mongoose');
const {Plan_Status} = require("../Helpers/constants")
const {DietApp} = require('../utility/connection');
var bcrypt = require('bcrypt-nodejs');
var UserSchema = new mongoose.Schema({
    full_name: {type: String,default :null},
    image: {type: String,default :null},
    email: {type: String,default:null},
    phoneNumber: {type: String,default:null},
    isLogin:{type: Boolean,default:false},
    isNewUser:{type: Boolean,default:true},
    otpCode:{type:Number,default:null},
    otpCode_timestamp:{type:String,default:null},
    role:{type:String,default:null},
    passwordHash: { type: String},
    email_verified:{type: Boolean,default:false},
    coach_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Coach' },
    workoutCoach_id:{ type: mongoose.Schema.Types.ObjectId, ref: 'Coach' },
    diet_plan_status: {type: String,default :null},
    workout_plan_status: {type: String,default :Plan_Status.FirstPlanNeeded},
    subsctiption_status: {type: String,default :Plan_Status.FirstPlanNeeded},
},
{ timestamps: true });

const User = DietApp.model('Users', UserSchema);
module.exports = {
    User
};
