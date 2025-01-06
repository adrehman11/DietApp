
const { FoodItem } = require('../../models/foodItem_model')
const { FoodRecipe } = require('../../models/foodRecipe_model')
// const {Roles,Form_Types} = require("../../Helpers/constants")
// const JWT = require("jsonwebtoken");
const mongoose = require('mongoose');

exports.addFoodItems = async function (req, res) {
    try {
        
       await FoodItem.create(req.body)        
        return res.status(200).json({ message:"Food Item Added" });
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }




}

exports.addFoodRecipe = async function (req, res) {
    try {
        
    await FoodRecipe.create(req.body)        
    return res.status(200).json({ message:"Food Recipe Added" });
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }




}