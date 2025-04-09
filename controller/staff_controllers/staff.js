const { User } = require("../../models/client_model");
const { Coach } = require("../../models/coach_model");
const { Form } = require("../../models/form_model");
const { Subscription } = require("../../models/subscription_model");
const { Roles,Subscription_Status } = require("../../Helpers/constants");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const mongoose = require("mongoose");

exports.login = async function (req, res) {
  try {
    let data = await Coach.findOne({
      email: req.body.email,
      role: { $in: [Roles.staff] },
    });
    if (!data) {
      throw "No email found";
    }
    // if(!data.email_verified)
    // {
    //   throw "email not verified"
    // }
    if (!bcrypt.compareSync(req.body.password, data.passwordHash)) {
      throw "Invalid Password";
    }
    const secret = process.env.jwtSecret;
    const token = JWT.sign(
      {
        id: data._id,
      },
      secret,
      { expiresIn: "3650d" }
    );

    //login work
    await Coach.updateOne({ _id: data._id }, { isLogin: true });
    return res.status(200).json({ token: token });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.getClientsByFilter = async function (req, res) {
    try {
        const coach = req.user;
        const page = req.body.page || 1;
        const pageSize = req.body.pageSize || 10;
        const skip = (page - 1) * pageSize;
        

        if (req.body.type === "All Plans") {
            let query = {};
            if (req.body.search) {
                query.full_name = { $regex: req.body.search, $options: "i" };
            }
            // Fetch users with pagination
            const users = await User.find(query)
                .select(
                    "image full_name diet_plan_status workout_plan_status subsctiption_status"
                )
                .populate({ path: "coach_id", select: "_id image full_name email role U_ID" })
                .populate({
                    path: "workoutCoach_id",
                    select: "_id image full_name email role U_ID",
                })
                .limit(pageSize)
                .skip(skip)
                .exec();
            // Extract user IDs to fetch associated form data
            const userIds = users.map((user) => user._id);

            // Fetch all forms in a single query
            const forms = await Form.find({ client_id: { $in: userIds } }).exec();

            // Create a map of form data by client_id for quick access
            const formsMap = forms.reduce((acc, form) => {
                acc[form.client_id.toString()] = form;
                return acc;
            }, {});
            // const counts = await getCounts(coach);
            const TotalDocuments = await User.countDocuments(query)
            // Attach the form data to the corresponding user
            const responseData = users.map((user) => ({
                ...user.toObject(),
                formData: formsMap[user._id.toString()] || null,
            }));
            let AllCount =TotalDocuments
            let ActivePlans =await User.countDocuments({subsctiption_status:Subscription_Status.Active})
            let FreezedPlans =await User.countDocuments({subsctiption_status:Subscription_Status.Freezed})
            let ExpiredPlans =await User.countDocuments({subsctiption_status:Subscription_Status.Expired})
            let NotStartedPlans =await User.countDocuments({subsctiption_status:Subscription_Status.NotStarted})
            let ToalCounts = {
                AllCount:AllCount,
                ActivePlans:ActivePlans,
                FreezedPlans:FreezedPlans,
                ExpiredPlans:ExpiredPlans,
                NotStartedPlans : NotStartedPlans
            }
            return res.status(200).json({responseData,counts,TotalDocuments,page,pageSize,ToalCounts});
           
        } else if (req.body.type === "Active Plans") {
            let query = {subsctiption_status:Subscription_Status.Active};
            if (req.body.search) {
                query.full_name = { $regex: req.body.search, $options: "i" };
            }
            // Fetch users with pagination
            const users = await User.find(query)
                .select(
                    "image full_name diet_plan_status workout_plan_status subsctiption_status"
                )
                .populate({ path: "coach_id", select: "_id image full_name email role U_ID" })
                .populate({
                    path: "workoutCoach_id",
                    select: "_id image full_name email role U_ID",
                })
                .limit(pageSize)
                .skip(skip)
                .exec();
            // Extract user IDs to fetch associated form data
            const userIds = users.map((user) => user._id);

            // Fetch all forms in a single query
            const forms = await Form.find({ client_id: { $in: userIds } }).exec();

            // Create a map of form data by client_id for quick access
            const formsMap = forms.reduce((acc, form) => {
                acc[form.client_id.toString()] = form;
                return acc;
            }, {});
            // const counts = await getCounts(coach);
            const TotalDocuments = await User.countDocuments(query)
            // Attach the form data to the corresponding user
            const responseData = users.map((user) => ({
                ...user.toObject(),
                formData: formsMap[user._id.toString()] || null,
            }));
            let AllCount =await User.countDocuments({})
            let ActivePlans =TotalDocuments
            let FreezedPlans =await User.countDocuments({subsctiption_status:Subscription_Status.Freezed})
            let ExpiredPlans =await User.countDocuments({subsctiption_status:Subscription_Status.Expired})
            let NotStartedPlans =await User.countDocuments({subsctiption_status:Subscription_Status.NotStarted})
            let ToalCounts = {
                AllCount:AllCount,
                ActivePlans:ActivePlans,
                FreezedPlans:FreezedPlans,
                ExpiredPlans:ExpiredPlans,
                NotStartedPlans : NotStartedPlans
            }
            return res.status(200).json({responseData,counts,TotalDocuments,page,pageSize,ToalCounts});
           
        } else if (req.body.type === "Freezed Plans") {
            let query = {subsctiption_status:Subscription_Status.Freezed};
            if (req.body.search) {
                query.full_name = { $regex: req.body.search, $options: "i" };
            }
            // Fetch users with pagination
            const users = await User.find(query)
                .select(
                    "image full_name diet_plan_status workout_plan_status subsctiption_status"
                )
                .populate({ path: "coach_id", select: "_id image full_name email role U_ID" })
                .populate({
                    path: "workoutCoach_id",
                    select: "_id image full_name email role U_ID",
                })
                .limit(pageSize)
                .skip(skip)
                .exec();
            // Extract user IDs to fetch associated form data
            const userIds = users.map((user) => user._id);

            // Fetch all forms in a single query
            const forms = await Form.find({ client_id: { $in: userIds } }).exec();

            // Create a map of form data by client_id for quick access
            const formsMap = forms.reduce((acc, form) => {
                acc[form.client_id.toString()] = form;
                return acc;
            }, {});
            // const counts = await getCounts(coach);
            const TotalDocuments = await User.countDocuments(query)
            // Attach the form data to the corresponding user
            const responseData = users.map((user) => ({
                ...user.toObject(),
                formData: formsMap[user._id.toString()] || null,
            }));
            let AllCount =await User.countDocuments({})
            let ActivePlans =await User.countDocuments({subsctiption_status:Subscription_Status.ActivePlans})
            let FreezedPlans =TotalDocuments
            let ExpiredPlans =await User.countDocuments({subsctiption_status:Subscription_Status.Expired})
            let NotStartedPlans =await User.countDocuments({subsctiption_status:Subscription_Status.NotStarted})
            let ToalCounts = {
                AllCount:AllCount,
                ActivePlans:ActivePlans,
                FreezedPlans:FreezedPlans,
                ExpiredPlans:ExpiredPlans,
                NotStartedPlans : NotStartedPlans
            }
            return res.status(200).json({responseData,counts,TotalDocuments,page,pageSize,ToalCounts});
        } 
        else if (req.body.type === "Expired Plans") {
            let query = {subsctiption_status:Subscription_Status.Expired};
            if (req.body.search) {
                query.full_name = { $regex: req.body.search, $options: "i" };
            }
            // Fetch users with pagination
            const users = await User.find(query)
                .select(
                    "image full_name diet_plan_status workout_plan_status subsctiption_status"
                )
                .populate({ path: "coach_id", select: "_id image full_name email role U_ID" })
                .populate({
                    path: "workoutCoach_id",
                    select: "_id image full_name email role U_ID",
                })
                .limit(pageSize)
                .skip(skip)
                .exec();
            // Extract user IDs to fetch associated form data
            const userIds = users.map((user) => user._id);

            // Fetch all forms in a single query
            const forms = await Form.find({ client_id: { $in: userIds } }).exec();

            // Create a map of form data by client_id for quick access
            const formsMap = forms.reduce((acc, form) => {
                acc[form.client_id.toString()] = form;
                return acc;
            }, {});
            // const counts = await getCounts(coach);
            const TotalDocuments = await User.countDocuments(query)
            // Attach the form data to the corresponding user
            const responseData = users.map((user) => ({
                ...user.toObject(),
                formData: formsMap[user._id.toString()] || null,
            }));
            let AllCount =await User.countDocuments({})
            let ActivePlans =await User.countDocuments({subsctiption_status:Subscription_Status.ActivePlans})
            let FreezedPlans =await User.countDocuments({subsctiption_status:Subscription_Status.Freezed})
            let ExpiredPlans =TotalDocuments
            let NotStartedPlans =await User.countDocuments({subsctiption_status:Subscription_Status.NotStarted})
            let ToalCounts = {
                AllCount:AllCount,
                ActivePlans:ActivePlans,
                FreezedPlans:FreezedPlans,
                ExpiredPlans:ExpiredPlans,
                NotStartedPlans : NotStartedPlans
            }
            return res.status(200).json({responseData,counts,TotalDocuments,page,pageSize,ToalCounts});
        } 
        else if (req.body.type === "NotStarted Plans") {
            let query = {subsctiption_status:Subscription_Status.NotStarted};
            if (req.body.search) {
                query.full_name = { $regex: req.body.search, $options: "i" };
            }
            // Fetch users with pagination
            const users = await User.find(query)
                .select(
                    "image full_name diet_plan_status workout_plan_status subsctiption_status"
                )
                .populate({ path: "coach_id", select: "_id image full_name email role U_ID" })
                .populate({
                    path: "workoutCoach_id",
                    select: "_id image full_name email role U_ID",
                })
                .limit(pageSize)
                .skip(skip)
                .exec();
            // Extract user IDs to fetch associated form data
            const userIds = users.map((user) => user._id);

            // Fetch all forms in a single query
            const forms = await Form.find({ client_id: { $in: userIds } }).exec();

            // Create a map of form data by client_id for quick access
            const formsMap = forms.reduce((acc, form) => {
                acc[form.client_id.toString()] = form;
                return acc;
            }, {});
            // const counts = await getCounts(coach);
            const TotalDocuments = await User.countDocuments(query)
            // Attach the form data to the corresponding user
            const responseData = users.map((user) => ({
                ...user.toObject(),
                formData: formsMap[user._id.toString()] || null,
            }));
            let AllCount =await User.countDocuments({})
            let ActivePlans =await User.countDocuments({subsctiption_status:Subscription_Status.ActivePlans})
            let FreezedPlans =await User.countDocuments({subsctiption_status:Subscription_Status.Freezed})
            let ExpiredPlans =await User.countDocuments({subsctiption_status:Subscription_Status.Expired})
            let NotStartedPlans =TotalDocuments
            let ToalCounts = {
                AllCount:AllCount,
                ActivePlans:ActivePlans,
                FreezedPlans:FreezedPlans,
                ExpiredPlans:ExpiredPlans,
                NotStartedPlans : NotStartedPlans
            }
            return res.status(200).json({responseData,counts,TotalDocuments,page,pageSize,ToalCounts});
        } 
        else {
            return res.status(200).json({ msg: "No Type Selected" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

exports.getClientById = async function (req, res) {
    try {
        const coach = req.user;

        const users = await User.findOne({ _id: req.body.client_id })
            .select(
                "image full_name diet_plan_status workout_plan_status subsctiption_status"
            )
            .populate({ path: "coach_id", select: "_id image full_name email role U_ID" })
            .populate({
                path: "workoutCoach_id",
                select: "_id image full_name email role U_ID",
            })
            .lean();

        const forms = await Form.findOne({ client_id: req.body.client_id }).lean();
        const subscriptionData = await Subscription.find({user_id:req.body.client_id})
        const responseData = {
            ...users,
            formData: forms,
            subscription:subscriptionData
        };


        return res.status(200).json(responseData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};