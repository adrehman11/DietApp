
const { WorkoutExercise } = require('../../models/workout_exercises_model')
// const {Roles,Form_Types} = require("../../Helpers/constants")
// const JWT = require("jsonwebtoken");
const mongoose = require('mongoose');

exports.addWorkoutExercise = async function (req, res) {
    try {
        if ( req.file.location) {
            req.body.image =  req.file.location
          }
       await WorkoutExercise.create(req.body)        
        return res.status(200).json({ message:"Workout exercise Added" });
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}
