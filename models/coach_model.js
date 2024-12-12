
var mongoose = require('mongoose');
const {DietApp} = require('../utility/connection');
var bcrypt = require('bcrypt-nodejs');
var CoachSchema = new mongoose.Schema({
    full_name: {type: String,default :null},
    bio: {type: String,default :null},
    status: {type: String,default :null},
    email: {type: String,default:null},
    role:{type:String,default:null},
    U_ID:{type:String,default:null},
    // phoneNumber: {type: String,default:null},
    isLogin:{type: Boolean,default:false},
    // isNewUser:{type: Boolean,default:true},
    // otpCode:{type:Number,default:null},
    // otpCode_timestamp:{type:String,default:null},
    passwordHash: { type: String},
    // email_verified:{type: Boolean,default:false}
},
{ timestamps: true });

const Coach = DietApp.model('Coach', CoachSchema);
module.exports = {
    Coach
};
