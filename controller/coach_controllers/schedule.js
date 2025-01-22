
const { ScheduleCheckIn } = require('../../models/scheduleCheckIn_model')
// const {FoodMeals,FoodCategory,DietPlanStatus,WorkoutPlanStatus} = require("../../Helpers/constants")
// const {calculateTotalNutrientsForPlan} = require("../../Helpers/helperFunction")
// const JWT = require("jsonwebtoken");
const mongoose = require('mongoose');

exports.scheduleCheckIn = async function (req, res) {
    try {
        let coach = req.user
        req.body.coach_id= coach.id
        req.body.status="Incomplete"
        await ScheduleCheckIn.create(req.body)
        res.status(200).json({msg:"Check in created"})
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }




}
exports.getAllscheduleCheckIn = async function (req, res) {
    try {
        let coach = req.user
        let data = await ScheduleCheckIn.find({coach_id:coach._id,date:{$gte:req.body.startDate,$lte:req.body.endDate}}).populate({
            path: 'client_id',
            select: '_id full_name email role diet_plan_status workout_plan_status subsctiption_status',
          })
        res.status(200).json(data)
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}