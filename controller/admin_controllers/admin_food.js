
const { FoodItem } = require('../../models/foodItem_model')
const { FoodRecipe } = require('../../models/foodRecipe_model')
const { Supplement } = require('../../models/supplements_model')
// const {Roles,Form_Types} = require("../../Helpers/constants")
// const JWT = require("jsonwebtoken");
const mongoose = require('mongoose');

exports.addFoodItems = async function (req, res) {
    try {

        await FoodItem.create(req.body)
        return res.status(200).json({ message: "Food Item Added" });
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }




}

exports.getAllFoodItems = async function (req, res) {
    try {
        const page = req.body.page || 1;
        const pageSize = req.body.pageSize || 10;
        const searchFilter = req.body.search
            ? { name: { $regex: req.body.search, $options: "i" } }
            : {};

        let query = FoodItem.find(searchFilter);
        let totaldocuments = await  FoodItem.countDocuments(searchFilter);
        // Apply pagination only if search is NOT provided
        if (!req.body.search) {
            const skip = (page - 1) * pageSize;
            query = query.skip(skip).limit(pageSize);
        }

        const data = await query;
        
        
        return res.status(200).json({data :data ,totaldocuments:totaldocuments,page:page,pageSize:pageSize});
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};
exports.addFoodRecipe = async function (req, res) {
    try {

        await FoodRecipe.create(req.body)
        return res.status(200).json({ message: "Food Recipe Added" });
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }




}

exports.getAllFoodRecipe = async function (req, res) {
    try {
        const page = req.body.page || 1;
        const pageSize = req.body.pageSize || 10;
        const skip = (page - 1) * pageSize;
    
        let data = await FoodRecipe.find().skip(skip).limit(pageSize) .populate({ path: "ingredients.foodItem" }).lean();
        const result = data.map((recipe) => {
            const total = recipe.ingredients.reduce(
              (acc, ingredient) => {
                const foodItem = ingredient.foodItem;
                if (foodItem) {
                  acc.TotalCalories += foodItem.calories * ingredient.quantity  || 0;
                  acc.TotalFat += foodItem.fat  * ingredient.quantity || 0;
                  acc.TotalProtein += foodItem.protein  * ingredient.quantity  || 0;
                  acc.TotalCarbohydrates += foodItem.carbohydrates  * ingredient.quantity  || 0;
                }
                return acc;
              },
              {
                TotalCalories: 0,
                TotalFat: 0,
                TotalProtein: 0,
                TotalCarbohydrates: 0,
              }
            );
            return { ...recipe, totalRecipeNutrients: total };
          });
          let totaldocuments = await  FoodRecipe.countDocuments();
        return res.status(200).json({result:result,totaldocuments:totaldocuments,page:page,pageSize:pageSize});
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}


exports.AddSupplement = async function (req, res) {
    try {

        await Supplement.create(req.body)
        return res.status(200).json({ message: "Supplement Added" });
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }




}

exports.getAllSupplement = async function (req, res) {
    try {
        const page = req.body.page || 1;
        const pageSize = req.body.pageSize || 10;
        const skip = (page - 1) * pageSize;
        let data = await Supplement.find().skip(skip).limit(pageSize)
        let totaldocuments = await  Supplement.countDocuments();

        return res.status(200).json({data:data,totaldocuments:totaldocuments,page:page,pageSize:pageSize});
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }




}