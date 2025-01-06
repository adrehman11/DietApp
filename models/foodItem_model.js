
var mongoose = require('mongoose');
const {DietApp} = require('../utility/connection');
var FoodItemSchema = new mongoose.Schema({
    name: {type: String,default :null},
    unit:{type: String,default :null},
    quantity: {type: Number,default :null},
    calories: {type: Number,default :null},
    fat: {type: Number,default:null},
    protein:{type:Number,default:null},
    carbohydrates:{type:Number,default:null},
},
{ timestamps: true });

const FoodItem = DietApp.model('FoodItem', FoodItemSchema);
module.exports = {
    FoodItem
};
