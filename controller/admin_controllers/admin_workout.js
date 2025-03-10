
const { WorkoutExercise } = require('../../models/workout_exercises_model')
const {Roles,Form_Types} = require("../../Helpers/constants")
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
exports.getAllWorkoutExercises = async function (req, res) {
    try {
      const page = req.body.page || 1;
      const pageSize = req.body.pageSize || 10;
      const skip = (page - 1) * pageSize;
  
      const searchFilter = req.body.search != "" && req.body.search
        ? {
            exercise_name: { $regex: req.body.search, $options: "i" },
          }
        : {  };
      let data = await WorkoutExercise.find(searchFilter)
        .skip(skip)
        .limit(pageSize)
       let totalDocuments = await WorkoutExercise.countDocuments(searchFilter);

      return res.status(200).json({data:data,page:page,pageSize:pageSize,totalDocuments:totalDocuments});
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  };
