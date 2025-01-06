
var mongoose = require('mongoose');
const {DietApp} = require('../utility/connection');
var FoodRecipeSchema = new mongoose.Schema({
    name: {type: String,default :null},
    description: {type: String,default :null},
    ingredients: [
        {
            foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: true }, // Link to FoodItem
            quantity: { type: Number, required: true }, // Quantity of this ingredient
        },
    ]
},
{ timestamps: true });

const FoodRecipe = DietApp.model('FoodRecipe', FoodRecipeSchema);
module.exports = {
    FoodRecipe
};
