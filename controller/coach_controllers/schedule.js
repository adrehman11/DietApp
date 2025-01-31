
const { ScheduleCheckIn } = require('../../models/scheduleCheckIn_model')
// const {FoodMeals,FoodCategory,DietPlanStatus,WorkoutPlanStatus} = require("../../Helpers/constants")
// const {calculateTotalNutrientsForPlan} = require("../../Helpers/helperFunction")
// const JWT = require("jsonwebtoken");
const mongoose = require('mongoose');

exports.scheduleCheckIn = async function (req, res) {
    try {
        let coach = req.user
        if(coach.role == Roles.coach)
        {
            req.body.coach_id = coach.id 
        }
        else if (coach.role == Roles.teamLead)
        {
           if(!req.body.coach_id)
           {
             throw "coach id is missing in payload"
           }
        }
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
        let query = {}
        if (coach.role == Roles.coach) {
            query = {coach_id:coach._id,date:{$gte:req.body.startDate,$lte:req.body.endDate}}
        }
        else if (coach.role == Roles.teamLead) {
            query = {date:{$gte:req.body.startDate,$lte:req.body.endDate}}
        }
        let data = await ScheduleCheckIn.find(query).populate({
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
exports.getScheduleCheckData = async function (req, res) {
    try {
        let coach = req.user
        // let data = await ScheduleCheckIn.find({coach_id:coach._id,status:"Completed"}).populate({
        //     path: 'client_id',
        //     select: '_id full_name email role diet_plan_status workout_plan_status subsctiption_status',
        //   })
        let matchQuery = {}
        if (coach.role == Roles.coach) {
            matchQuery = {
                status: "Completed",  // Filter for completed check-ins
                coach_id:coach._id,
                type:req.body.type
            }
        }
        else if (coach.role == Roles.teamLead) {
            matchQuery = {
                status: "Completed",  // Filter for completed check-ins
                type:req.body.type
            }
        }
        const completedCheckIns = await ScheduleCheckIn.aggregate([
            {
                $match: matchQuery
            },
            {
                $lookup: {
                    from: "schedulecheckintracks",  // Collection for check-in track data
                    localField: "_id",
                    foreignField: "schedule_id",
                    as: "checkInTrackData"
                }
            },
            {
                $lookup: {
                    from: "users",  // Collection for users
                    localField: "client_id",
                    foreignField: "_id",
                    as: "clientDetails"
                }
            },
            {
                $unwind: "$clientDetails"  // Convert clientDetails array to object
            },
            {
                $project: {
                    _id: 1,
                    type: 1,
                    date: 1,
                    status: 1,
                    checkInTrackData: 1,  // Include all check-in track data
                    "clientDetails._id": 1,
                    "clientDetails.full_name": 1,
                    "clientDetails.email": 1,
                    "clientDetails.role": 1,
                    "clientDetails.diet_plan_status": 1,
                    "clientDetails.workout_plan_status": 1,
                    "clientDetails.subscription_status": 1
                }
            },
            {
                $sort: { date: -1 }  // Sort results by date (newest first)
            }
        ]);
        res.status(200).json(completedCheckIns)
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}