const { FoodItem } = require("../../models/foodItem_model");
const { User } = require("../../models/client_model");
const { Coach } = require("../../models/coach_model");

const { Form } = require("../../models/form_model");
const { DietPlan } = require("../../models/dietPlan_model");
const mongoose = require("mongoose");
const { Roles, Form_Types, Plan_Status } = require("../../Helpers/constants");
const { WorkoutPlan } = require("../../models/workoutPlan_model");


exports.getAllCoach = async function (req, res) {
  try {
    const page = req.body.page || 1;
    const pageSize = req.body.pageSize || 10;
    const skip = (page - 1) * pageSize;

    const searchFilter = req.body.search != ""
      ? {
          role: Roles.coach,
          full_name: { $regex: req.body.search, $options: "i" },
        }
      : { role: Roles.coach };
    let data = await Coach.find(searchFilter)
      .skip(skip)
      .limit(pageSize)
      .select("full_name bio status email U_ID");

    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.getCoachAdminData = async function (req, res) {
  try {
    let users = await User.find({
      $or: [{ coach_id: req.body._id }, { workoutCoach_id: req.body._id  }],
    })
      .select(
        "full_name diet_plan_status workout_plan_status subsctiption_status"
      )
      .populate({ path: "coach_id", select: "_id full_name email role U_ID" })
      .populate({
        path: "workoutCoach_id",
        select: "_id full_name email role U_ID",
      });
    const userIds = users.map((user) => user._id);

    // Fetch all forms in a single query
    const forms = await Form.find({ client_id: { $in: userIds } }).exec();

    // Create a map of form data by client_id for quick access
    const formsMap = forms.reduce((acc, form) => {
      acc[form.client_id.toString()] = form;
      return acc;
    }, {});
    // Attach the form data to the corresponding user
    const responseData = users.map((user) => ({
      ...user.toObject(),
      formData: formsMap[user._id.toString()] || null,
    }));

    let dietPlansData = await DietPlan.find({coach_id: req.body._id })
    let workoutPlansData = await WorkoutPlan.find({coach_id: req.body._id })
    return res.status(200).json({clients:responseData,dietPlansData,workoutPlansData});
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.getAllTeamleads = async function (req, res) {
  try {
    const page = req.body.page || 1;
    const pageSize = req.body.pageSize || 10;
    const skip = (page - 1) * pageSize;

    const searchFilter = req.body.search != ""
      ? {
          role: Roles.teamLead,
          full_name: { $regex: req.body.search, $options: "i" },
        }
      : { role: Roles.teamLead };
    let data = await Coach.find(searchFilter)
      .skip(skip)
      .limit(pageSize)
      .select("full_name bio status email U_ID");

    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
