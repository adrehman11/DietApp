
const { FoodItem } = require('../../models/foodItem_model')
const { FoodRecipe } = require('../../models/foodRecipe_model')
const { DietPlan } = require('../../models/dietPlan_model')
const { WorkoutExercise } = require('../../models/workout_exercises_model')
const { WorkoutPlan } = require('../../models/workoutPlan_model')
const {FoodMeals,FoodCategory,DietPlanStatus,WorkoutPlanStatus} = require("../../Helpers/constants")
const {calculateTotalNutrientsForPlan} = require("../../Helpers/helperFunction")
const JWT = require("jsonwebtoken");
const mongoose = require('mongoose');

exports.getMealsAndCategory = async function (req, res) {
    try {
        res.status(200).json({FoodMeals,FoodCategory})
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }




}
exports.getAllFood=  async function (req, res) {
    try {
        let page = req.body.page
        let limit = req.body.limit
        const skip = (page - 1) * limit
        const searchFilter = req.body.search ? { name: { $regex: req.body.search, $options: "i" } } : {}
        if (req.body.category == FoodCategory.FoodItem)
        {
            let data = await FoodItem.find(searchFilter).skip(skip).limit(limit)
            res.status(200).json(data)
        }
        else if(req.body.category == FoodCategory.Recipe)
        {
            let data = await FoodRecipe.find(searchFilter).skip(skip).limit(limit).populate({path: 'ingredients.foodItem'}).lean();
            const result = data.map((recipe) => {
                const total = recipe.ingredients.reduce((acc,ingredient) =>{
                    const foodItem = ingredient.foodItem
                    if(foodItem)
                    {
                        acc.calories += foodItem.calories || 0;
                        acc.fat += foodItem.fat || 0;
                        acc.protein += foodItem.protein || 0;
                        acc.carbohydrates += foodItem.carbohydrates || 0;
                        
                    }
                    return acc
                },{calories:0,fat:0,protein:0,carbohydrates:0})
                return {...recipe,totalNutrients:total}
            })
            res.status(200).json(result)

        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

exports.createDietPlan=  async function (req, res) {
    try {
        let client = req.user
        req.body.coach_id = client.id 
        if(req.body.status == DietPlanStatus.Saved)
        {
            req.body.status = DietPlanStatus.Saved
        }
        else if(req.body.status == DietPlanStatus.Active)
        {
            req.body.status = DietPlanStatus.Active
        }
        else
        {
            res.status(401).json({message:"Please Provide status"})
        }
        await DietPlan.create(req.body)
        res.status(200).json({message:"Diet plan created"})

    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}
exports.getAllDietPlans=  async function (req, res) {
    try {
        let coach = req.user
        let page = req.body.page
        let limit = req.body.limit
        const skip = (page - 1) * limit

        let data = await DietPlan.find({coach_id:coach._id,client_id:req.body.client_id}).skip(skip).limit(limit).populate({path: 'meals.items.referenceId',options: { strictPopulate: false },
        populate: {
            path: 'ingredients.foodItem', // Field inside FoodRecipe to populate
            model: 'FoodItem', // Explicitly specify the FoodItem model
            options: { strictPopulate: false }
        }
    }).populate({
        path: 'client_id',
        select: '_id full_name email role diet_plan_status workout_plan_status subsctiption_status',
    }).populate({
        path: 'coach_id',
        select: '_id full_name email role U_ID',
    }).lean();

        let dietPlansWithNutrients = calculateTotalNutrients(data);



        return res.status(200).json(dietPlansWithNutrients)



    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}
exports.getDietPlanById=  async function (req, res) {
    try {
        // let coach = req.user
        let data = await DietPlan.findOne({_id:req.body.dietPlanID}).populate({path: 'meals.items.referenceId',options: { strictPopulate: false },
        populate: {
            path: 'ingredients.foodItem', // Field inside FoodRecipe to populate
            model: 'FoodItem', // Explicitly specify the FoodItem model
            options: { strictPopulate: false }
        },}).populate({
            path: 'client_id',
            select: '_id full_name email role diet_plan_status workout_plan_status subsctiption_status',
        }).populate({
            path: 'coach_id',
            select: '_id full_name email role U_ID', 
        }).lean();
        if(!data)
        {   
            throw "No Data found"
        }
        let totalNutrients = await calculateTotalNutrientsForPlan(data);
        let dietPlanById = {
            ...data,
            totalNutrients
        }



        res.status(200).json(dietPlanById)



    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

function calculateTotalNutrients(dietPlans) {
    return dietPlans.map(plan => ({
        ...plan, // Spread the original data of the plan
        totalNutrients: calculateTotalNutrientsForPlan(plan) // Add the calculated total nutrients
    }));
}


exports.getAllWorkoutExercises=  async function (req, res) {
    try {
        let page = req.body.page
        let limit = req.body.limit
        const skip = (page - 1) * limit
        const searchFilter = req.body.search ? { exercise_name: { $regex: req.body.search, $options: "i" } } : {}
        let data =await WorkoutExercise.find(searchFilter).skip(skip).limit(limit)
       res.status(200).json(data)

    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}
exports.createWorkoutPlan=  async function (req, res) {
    try {
        let coach = req.user
        req.body.coach_id = coach.id 
        if(req.body.status == WorkoutPlanStatus.Saved)
        {
            req.body.status = WorkoutPlanStatus.Saved
        }
        else if(req.body.status == WorkoutPlanStatus.Active)
        {
            req.body.status = WorkoutPlanStatus.Active
        }
        else
        {
            res.status(401).json({message:"Please Provide status"})
        }
        await WorkoutPlan.create(req.body)
        res.status(200).json({message:"Workout plan created"})

    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}
exports.getAllWorkoutplan=  async function (req, res) {
    try {
        let coach = req.user
        let page = req.body.page
        let limit = req.body.limit
        const skip = (page - 1) * limit

        let data = await WorkoutPlan.find({coach_id:coach._id,client_id:req.body.client_id}).skip(skip).limit(limit)
        .populate({
        path: 'client_id',
        select: '_id full_name email role diet_plan_status workout_plan_status subsctiption_status',
    }).populate({
        path: 'coach_id',
        select: '_id full_name email role U_ID',
    }).lean();




        return res.status(200).json(data)



    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}
exports.getWorkoutplanById=  async function (req, res) {
    try {
        let data = await WorkoutPlan.findOne({_id:req.body.workoutPlanId}).populate({
            path: 'client_id',
            select: '_id full_name email role diet_plan_status workout_plan_status subsctiption_status',
        }).populate({
            path: 'coach_id',
            select: '_id full_name email role U_ID', 
        }).lean();
        if(!data)
        {   
            throw "No Data found"
        }
        
        res.status(200).json(data)
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}