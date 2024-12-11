
var mongoose = require('mongoose');
const {DietApp} = require('../utility/connection');
var bcrypt = require('bcrypt-nodejs');
var UserSchema = new mongoose.Schema({
    full_name: {type: String,default :null},
    email: {type: String,default:null},
    phoneNumber: {type: String,default:null},
    isLogin:{type: Boolean,default:false},
    isNewUser:{type: Boolean,default:true},
    otpCode:{type:Number,default:null},
    otpCode_timestamp:{type:String,default:null},
    role:{type:String,default:null},
    passwordHash: { type: String},
    email_verified:{type: Boolean,default:false}
},
{ timestamps: true });

const User = DietApp.model('Users', UserSchema);
module.exports = {
    User
};
