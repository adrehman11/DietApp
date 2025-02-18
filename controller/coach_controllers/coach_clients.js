const { Coach } = require("../../models/coach_model");
const { Form } = require("../../models/form_model");
const { User } = require("../../models/client_model");
const { Roles, Form_Types, Plan_Status } = require("../../Helpers/constants");
const JWT = require("jsonwebtoken");
const mongoose = require("mongoose");

exports.getClientsByFilter = async function (req, res) {
    try {
        const coach = req.user;
        const page = req.body.page || 1;
        const pageSize = req.body.pageSize || 10;
        const skip = (page - 1) * pageSize;

        if (req.body.type === "All") {
            if(req.body.filter == "")
            {
                let query = {};
                if (coach.role == Roles.coach) {
                    query = {
                        $or: [{ coach_id: coach._id }, { workoutCoach_id: coach._id }],
                    };
                } else if (coach.role == Roles.teamLead) {
                    query = {};
                }
                // Fetch users with pagination
                const users = await User.find(query)
                    .select(
                        "full_name diet_plan_status workout_plan_status subsctiption_status"
                    )
                    .populate({ path: "coach_id", select: "_id full_name email role U_ID" })
                    .populate({
                        path: "workoutCoach_id",
                        select: "_id full_name email role U_ID",
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
    
                // Attach the form data to the corresponding user
                const responseData = users.map((user) => ({
                    ...user.toObject(),
                    formData: formsMap[user._id.toString()] || null,
                }));
    
                return res.status(200).json(responseData);
            }
            else if (req.body.filter == "First Plan Needed")
            {
                let query = {};
                if (coach.role == Roles.coach) {
                    query = {
                        $or: [{ coach_id: coach._id }, { workoutCoach_id: coach._id }],
                        $or:[{ workout_plan_status: Plan_Status.FirstPlanNeeded},{ diet_plan_status: Plan_Status.FirstPlanNeeded}]
                       
                       
                    };
                } else if (coach.role == Roles.teamLead) {
                    query = {
                        $or: [{ workout_plan_status: Plan_Status.FirstPlanNeeded},{ diet_plan_status: Plan_Status.FirstPlanNeeded}],

                    };
                }
                // Fetch users with pagination
                const users = await User.find(query)
                    .select(
                        "full_name diet_plan_status workout_plan_status subsctiption_status"
                    )
                    .populate({ path: "coach_id", select: "_id full_name email role U_ID" })
                    .populate({
                        path: "workoutCoach_id",
                        select: "_id full_name email role U_ID",
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
    
                // Attach the form data to the corresponding user
                const responseData = users.map((user) => ({
                    ...user.toObject(),
                    formData: formsMap[user._id.toString()] || null,
                }));
    
                return res.status(200).json(responseData);
            }
            else if (req.body.filter = "Update Needed")
            {
                let query = {};
                if (coach.role == Roles.coach) {
                    query = {
                        $or: [{ coach_id: coach._id }, { workoutCoach_id: coach._id }],
                        $or:[{ workout_plan_status: Plan_Status.UpdateNeeded},{ diet_plan_status: Plan_Status.UpdateNeeded}]
                       
                       
                    };
                } else if (coach.role == Roles.teamLead) {
                    query = {
                        $or: [{ workout_plan_status: Plan_Status.UpdateNeeded},{ diet_plan_status: Plan_Status.UpdateNeeded}],

                    };
                }
                // Fetch users with pagination
                const users = await User.find(query)
                    .select(
                        "full_name diet_plan_status workout_plan_status subsctiption_status"
                    )
                    .populate({ path: "coach_id", select: "_id full_name email role U_ID" })
                    .populate({
                        path: "workoutCoach_id",
                        select: "_id full_name email role U_ID",
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
    
                // Attach the form data to the corresponding user
                const responseData = users.map((user) => ({
                    ...user.toObject(),
                    formData: formsMap[user._id.toString()] || null,
                }));
    
                return res.status(200).json(responseData);
            }
            else if (req.body.filter = "All Ready")
            {
                let query = {};
                if (coach.role == Roles.coach) {
                    query = {
                        $or: [{ coach_id: coach._id }, { workoutCoach_id: coach._id }],
                        $or:[{ workout_plan_status: Plan_Status.AllReady},{ diet_plan_status: Plan_Status.AllReady}]
                       
                       
                    };
                } else if (coach.role == Roles.teamLead) {
                    query = {
                        $or: [{ workout_plan_status: Plan_Status.AllReady},{ diet_plan_status: Plan_Status.AllReady}],

                    };
                }
                // Fetch users with pagination
                const users = await User.find(query)
                    .select(
                        "full_name diet_plan_status workout_plan_status subsctiption_status"
                    )
                    .populate({ path: "coach_id", select: "_id full_name email role U_ID" })
                    .populate({
                        path: "workoutCoach_id",
                        select: "_id full_name email role U_ID",
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
    
                // Attach the form data to the corresponding user
                const responseData = users.map((user) => ({
                    ...user.toObject(),
                    formData: formsMap[user._id.toString()] || null,
                }));
    
                return res.status(200).json(responseData);
            }
           
        } else if (req.body.type === "Workout Plans") {
            if (req.body.filter === "") {
                let query = {};
                const statusesToMatch = [
                    Plan_Status.AllReady,
                    Plan_Status.FirstPlanNeeded,
                    Plan_Status.UpdateNeeded,
                ];

                if (coach.role == Roles.coach) {
                    query = {
                        $or: [{ coach_id: coach._id }, { workoutCoach_id: coach._id }],
                        workout_plan_status: { $in: statusesToMatch },
                    };
                } else if (coach.role == Roles.teamLead) {
                    query = { workout_plan_status: { $in: statusesToMatch } };
                }
                const users = await User.find(query)
                    .select(
                        "full_name diet_plan_status workout_plan_status subsctiption_status"
                    )
                    .populate({
                        path: "coach_id",
                        select: "_id full_name email role U_ID",
                    })
                    .populate({
                        path: "workoutCoach_id",
                        select: "_id full_name email role U_ID",
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

                // Attach the form data to the corresponding user
                const responseData = users.map((user) => ({
                    ...user.toObject(),
                    formData: formsMap[user._id.toString()] || null,
                }));

                return res.status(200).json(responseData);
            } else if (req.body.filter === "First Plan Needed") {
                let query = {};
                if (coach.role == Roles.coach) {
                    query = {
                        $or: [{ coach_id: coach._id }, { workoutCoach_id: coach._id }],
                        workout_plan_status: Plan_Status.FirstPlanNeeded,
                    };
                } else if (coach.role == Roles.teamLead) {
                    query = { workout_plan_status: Plan_Status.FirstPlanNeeded };
                }
                const users = await User.find(query)
                    .select(
                        "full_name diet_plan_status workout_plan_status subsctiption_status"
                    )
                    .populate({
                        path: "coach_id",
                        select: "_id full_name email role U_ID",
                    })
                    .populate({
                        path: "workoutCoach_id",
                        select: "_id full_name email role U_ID",
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

                // Attach the form data to the corresponding user
                const responseData = users.map((user) => ({
                    ...user.toObject(),
                    formData: formsMap[user._id.toString()] || null,
                }));

                return res.status(200).json(responseData);
            } else if (req.body.filter === "Update Needed") {
                let query = {};
                if (coach.role == Roles.coach) {
                    query = {
                        $or: [{ coach_id: coach._id }, { workoutCoach_id: coach._id }],
                        workout_plan_status: Plan_Status.UpdateNeeded,
                    };
                } else if (coach.role == Roles.teamLead) {
                    query = { workout_plan_status: Plan_Status.UpdateNeeded };
                }
                const users = await User.find(query)
                    .select(
                        "full_name diet_plan_status workout_plan_status subsctiption_status"
                    )
                    .populate({
                        path: "coach_id",
                        select: "_id full_name email role U_ID",
                    })
                    .populate({
                        path: "workoutCoach_id",
                        select: "_id full_name email role U_ID",
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

                // Attach the form data to the corresponding user
                const responseData = users.map((user) => ({
                    ...user.toObject(),
                    formData: formsMap[user._id.toString()] || null,
                }));

                return res.status(200).json(responseData);
            } else if (req.body.filter === "All Ready") {
                let query = {};
                if (coach.role == Roles.coach) {
                    query = {
                        $or: [{ coach_id: coach._id }, { workoutCoach_id: coach._id }],
                        workout_plan_status: Plan_Status.AllReady,
                    };
                } else if (coach.role == Roles.teamLead) {
                    query = { workout_plan_status: Plan_Status.AllReady };
                }
                const users = await User.find(query)
                    .select(
                        "full_name diet_plan_status workout_plan_status subsctiption_status"
                    )
                    .populate({
                        path: "coach_id",
                        select: "_id full_name email role U_ID",
                    })
                    .populate({
                        path: "workoutCoach_id",
                        select: "_id full_name email role U_ID",
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

                // Attach the form data to the corresponding user
                const responseData = users.map((user) => ({
                    ...user.toObject(),
                    formData: formsMap[user._id.toString()] || null,
                }));

                return res.status(200).json(responseData);
            } else {
                return res.status(200).json({ msg: "No Filter Selected " });
            }
        } else if (req.body.type === "Diet Plans") {
            if (req.body.filter === "") {
                let query = {};
                const statusesToMatch = [
                    Plan_Status.AllReady,
                    Plan_Status.FirstPlanNeeded,
                    Plan_Status.UpdateNeeded,
                ];

                if (coach.role == Roles.coach) {
                    query = {
                        $or: [{ coach_id: coach._id }, { workoutCoach_id: coach._id }],
                        diet_plan_status: { $in: statusesToMatch },
                    };
                } else if (coach.role == Roles.teamLead) {
                    query = { diet_plan_status: { $in: statusesToMatch } };
                }

                query = { diet_plan_status: { $in: statusesToMatch } };
                const users = await User.find(query)
                    .select(
                        "full_name diet_plan_status workout_plan_status subsctiption_status"
                    )
                    .populate({
                        path: "coach_id",
                        select: "_id full_name email role U_ID",
                    })
                    .populate({
                        path: "workoutCoach_id",
                        select: "_id full_name email role U_ID",
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

                // Attach the form data to the corresponding user
                const responseData = users.map((user) => ({
                    ...user.toObject(),
                    formData: formsMap[user._id.toString()] || null,
                }));

                return res.status(200).json(responseData);
            } else if (req.body.filter === "First Plan Needed") {
                let query = {};

                if (coach.role == Roles.coach) {
                    query = {
                        $or: [{ coach_id: coach._id }, { workoutCoach_id: coach._id }],
                        diet_plan_status: Plan_Status.FirstPlanNeeded,
                    };
                } else if (coach.role == Roles.teamLead) {
                    query = { diet_plan_status: Plan_Status.FirstPlanNeeded };
                }
                const users = await User.find(query)
                    .select(
                        "full_name diet_plan_status workout_plan_status subsctiption_status"
                    )
                    .populate({
                        path: "coach_id",
                        select: "_id full_name email role U_ID",
                    })
                    .populate({
                        path: "workoutCoach_id",
                        select: "_id full_name email role U_ID",
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

                // Attach the form data to the corresponding user
                const responseData = users.map((user) => ({
                    ...user.toObject(),
                    formData: formsMap[user._id.toString()] || null,
                }));

                return res.status(200).json(responseData);
            } else if (req.body.filter === "Update Needed") {
                let query = {};

                if (coach.role == Roles.coach) {
                    query = {
                        $or: [{ coach_id: coach._id }, { workoutCoach_id: coach._id }],
                        diet_plan_status: Plan_Status.UpdateNeeded,
                    };
                } else if (coach.role == Roles.teamLead) {
                    query = { diet_plan_status: Plan_Status.UpdateNeeded };
                }
                const users = await User.find(query)
                    .select(
                        "full_name diet_plan_status workout_plan_status subsctiption_status"
                    )
                    .populate({
                        path: "coach_id",
                        select: "_id full_name email role U_ID",
                    })
                    .populate({
                        path: "workoutCoach_id",
                        select: "_id full_name email role U_ID",
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

                // Attach the form data to the corresponding user
                const responseData = users.map((user) => ({
                    ...user.toObject(),
                    formData: formsMap[user._id.toString()] || null,
                }));

                return res.status(200).json(responseData);
            } else if (req.body.filter === "All Ready") {
                let query = {};

                if (coach.role == Roles.coach) {
                    query = {
                        $or: [{ coach_id: coach._id }, { workoutCoach_id: coach._id }],
                        diet_plan_status: Plan_Status.AllReady,
                    };
                } else if (coach.role == Roles.teamLead) {
                    query = { diet_plan_status: Plan_Status.AllReady };
                }
                const users = await User.find(query)
                    .select(
                        "full_name diet_plan_status workout_plan_status subsctiption_status"
                    )
                    .populate({
                        path: "coach_id",
                        select: "_id full_name email role U_ID",
                    })
                    .populate({
                        path: "workoutCoach_id",
                        select: "_id full_name email role U_ID",
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

                // Attach the form data to the corresponding user
                const responseData = users.map((user) => ({
                    ...user.toObject(),
                    formData: formsMap[user._id.toString()] || null,
                }));

                return res.status(200).json(responseData);
            } else {
                return res.status(200).json({ msg: "No Filter Selected " });
            }
        } else {
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
                "full_name diet_plan_status workout_plan_status subsctiption_status"
            )
            .populate({ path: "coach_id", select: "_id full_name email role U_ID" })
            .populate({
                path: "workoutCoach_id",
                select: "_id full_name email role U_ID",
            })
            .lean();

        const forms = await Form.findOne({ client_id: req.body.client_id }).lean();
        const responseData = {
            ...users,
            formData: forms,
        };

        return res.status(200).json(responseData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

exports.getAllCoach = async function (req, res) {
    try {
        const coach = req.user;
        const page = req.body.page || 1;
        const pageSize = req.body.pageSize || 10;
        const skip = (page - 1) * pageSize;

        const searchFilter = req.body.search
            ? {
                role: Roles.coach,
                full_name: { $regex: req.body.search, $options: "i" },
            }
            : { role: Roles.coach };
        let data = await Coach.find(searchFilter)
            .skip(skip)
            .limit(page)
            .select("full_name bio status email U_ID");

        return res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};
