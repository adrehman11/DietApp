
const { Coach } = require('../../models/coach_model')
const { Form } = require('../../models/form_model')
const { User } = require('../../models/client_model')
const {Roles,Form_Types,Plan_Status} = require("../../Helpers/constants")
const JWT = require("jsonwebtoken");
const mongoose = require('mongoose');

exports.getClientsByFilter = async function (req, res) {
    try {
        const coach = req.user
        const page = req.body.page || 1;
        const pageSize = req.body.pageSize || 10;
        const skip = (page - 1) * pageSize;
        if (req.body.type === "All") {
            // Fetch users with pagination
            const users = await User.find({ coach_id: coach._id })
                .select('full_name diet_plan_status workout_plan_status subsctiption_status')
                .limit(pageSize)
                .skip(skip)
                .exec();

            // Extract user IDs to fetch associated form data
            const userIds = users.map(user => user._id);

            // Fetch all forms in a single query
            const forms = await Form.find({ client_id: { $in: userIds } }).exec();

            // Create a map of form data by client_id for quick access
            const formsMap = forms.reduce((acc, form) => {
                acc[form.client_id.toString()] = form;
                return acc;
            }, {});

            // Attach the form data to the corresponding user
            const responseData = users.map(user => ({
                ...user.toObject(),
                formData: formsMap[user._id.toString()] || null
            }));

            return res.status(200).json(responseData);
        }
        else if(req.body.type === "Workout Plans")
        {
            if(req.body.filter === "")
            {
                const statusesToMatch = [Plan_Status.AllReady, Plan_Status.FirstPlanNeeded, Plan_Status.UpdateNeeded];
                const users = await User.find({ coach_id: coach._id ,  workout_plan_status: { $in: statusesToMatch } })
                .select('full_name diet_plan_status workout_plan_status subsctiption_status')
                .limit(pageSize)
                .skip(skip)
                .exec();

            // Extract user IDs to fetch associated form data
            const userIds = users.map(user => user._id);

            // Fetch all forms in a single query
            const forms = await Form.find({ client_id: { $in: userIds } }).exec();

            // Create a map of form data by client_id for quick access
            const formsMap = forms.reduce((acc, form) => {
                acc[form.client_id.toString()] = form;
                return acc;
            }, {});

            // Attach the form data to the corresponding user
            const responseData = users.map(user => ({
                ...user.toObject(),
                formData: formsMap[user._id.toString()] || null
            }));

            return res.status(200).json(responseData);
            }
            else if(req.body.filter === "First Plan Needed")
            {
              
                const users = await User.find({ coach_id: coach._id ,  workout_plan_status: Plan_Status.FirstPlanNeeded })
                .select('full_name diet_plan_status workout_plan_status subsctiption_status')
                .limit(pageSize)
                .skip(skip)
                .exec();

            // Extract user IDs to fetch associated form data
            const userIds = users.map(user => user._id);

            // Fetch all forms in a single query
            const forms = await Form.find({ client_id: { $in: userIds } }).exec();

            // Create a map of form data by client_id for quick access
            const formsMap = forms.reduce((acc, form) => {
                acc[form.client_id.toString()] = form;
                return acc;
            }, {});

            // Attach the form data to the corresponding user
            const responseData = users.map(user => ({
                ...user.toObject(),
                formData: formsMap[user._id.toString()] || null
            }));

            return res.status(200).json(responseData);
            }
            else if(req.body.filter === "Update Needed")
            {
              
                const users = await User.find({ coach_id: coach._id ,  workout_plan_status: Plan_Status.UpdateNeeded })
                .select('full_name diet_plan_status workout_plan_status subsctiption_status')
                .limit(pageSize)
                .skip(skip)
                .exec();

            // Extract user IDs to fetch associated form data
            const userIds = users.map(user => user._id);

            // Fetch all forms in a single query
            const forms = await Form.find({ client_id: { $in: userIds } }).exec();

            // Create a map of form data by client_id for quick access
            const formsMap = forms.reduce((acc, form) => {
                acc[form.client_id.toString()] = form;
                return acc;
            }, {});

            // Attach the form data to the corresponding user
            const responseData = users.map(user => ({
                ...user.toObject(),
                formData: formsMap[user._id.toString()] || null
            }));

            return res.status(200).json(responseData);
            }
            else if(req.body.filter === "All Ready")
            {
              
                const users = await User.find({ coach_id: coach._id ,  workout_plan_status: Plan_Status.AllReady })
                .select('full_name diet_plan_status workout_plan_status subsctiption_status')
                .limit(pageSize)
                .skip(skip)
                .exec();

            // Extract user IDs to fetch associated form data
            const userIds = users.map(user => user._id);

            // Fetch all forms in a single query
            const forms = await Form.find({ client_id: { $in: userIds } }).exec();

            // Create a map of form data by client_id for quick access
            const formsMap = forms.reduce((acc, form) => {
                acc[form.client_id.toString()] = form;
                return acc;
            }, {});

            // Attach the form data to the corresponding user
            const responseData = users.map(user => ({
                ...user.toObject(),
                formData: formsMap[user._id.toString()] || null
            }));

            return res.status(200).json(responseData);
            }
            else
            {
            return res.status(200).json({ msg:"No Filter Selected " });
            }
        }
        else if(req.body.type === "Diet Plans")
        {
            if(req.body.filter === "")
            {
                const statusesToMatch = [Plan_Status.AllReady, Plan_Status.FirstPlanNeeded, Plan_Status.UpdateNeeded];
                const users = await User.find({ coach_id: coach._id ,  diet_plan_status: { $in: statusesToMatch } })
                .select('full_name diet_plan_status workout_plan_status subsctiption_status')
                .limit(pageSize)
                .skip(skip)
                .exec();

            // Extract user IDs to fetch associated form data
            const userIds = users.map(user => user._id);

            // Fetch all forms in a single query
            const forms = await Form.find({ client_id: { $in: userIds } }).exec();

            // Create a map of form data by client_id for quick access
            const formsMap = forms.reduce((acc, form) => {
                acc[form.client_id.toString()] = form;
                return acc;
            }, {});

            // Attach the form data to the corresponding user
            const responseData = users.map(user => ({
                ...user.toObject(),
                formData: formsMap[user._id.toString()] || null
            }));

            return res.status(200).json(responseData);
            }
            else if(req.body.filter === "First Plan Needed")
            {
              
                const users = await User.find({ coach_id: coach._id ,  diet_plan_status: Plan_Status.FirstPlanNeeded })
                .select('full_name diet_plan_status workout_plan_status subsctiption_status')
                .limit(pageSize)
                .skip(skip)
                .exec();

            // Extract user IDs to fetch associated form data
            const userIds = users.map(user => user._id);

            // Fetch all forms in a single query
            const forms = await Form.find({ client_id: { $in: userIds } }).exec();

            // Create a map of form data by client_id for quick access
            const formsMap = forms.reduce((acc, form) => {
                acc[form.client_id.toString()] = form;
                return acc;
            }, {});

            // Attach the form data to the corresponding user
            const responseData = users.map(user => ({
                ...user.toObject(),
                formData: formsMap[user._id.toString()] || null
            }));

            return res.status(200).json(responseData);
            }
            else if(req.body.filter === "Update Needed")
            {
              
                const users = await User.find({ coach_id: coach._id ,  diet_plan_status: Plan_Status.UpdateNeeded })
                .select('full_name diet_plan_status workout_plan_status subsctiption_status')
                .limit(pageSize)
                .skip(skip)
                .exec();

            // Extract user IDs to fetch associated form data
            const userIds = users.map(user => user._id);

            // Fetch all forms in a single query
            const forms = await Form.find({ client_id: { $in: userIds } }).exec();

            // Create a map of form data by client_id for quick access
            const formsMap = forms.reduce((acc, form) => {
                acc[form.client_id.toString()] = form;
                return acc;
            }, {});

            // Attach the form data to the corresponding user
            const responseData = users.map(user => ({
                ...user.toObject(),
                formData: formsMap[user._id.toString()] || null
            }));

            return res.status(200).json(responseData);
            }
            else if(req.body.filter === "All Ready")
            {
              
                const users = await User.find({ coach_id: coach._id ,  diet_plan_status: Plan_Status.AllReady })
                .select('full_name diet_plan_status workout_plan_status subsctiption_status')
                .limit(pageSize)
                .skip(skip)
                .exec();

            // Extract user IDs to fetch associated form data
            const userIds = users.map(user => user._id);

            // Fetch all forms in a single query
            const forms = await Form.find({ client_id: { $in: userIds } }).exec();

            // Create a map of form data by client_id for quick access
            const formsMap = forms.reduce((acc, form) => {
                acc[form.client_id.toString()] = form;
                return acc;
            }, {});

            // Attach the form data to the corresponding user
            const responseData = users.map(user => ({
                ...user.toObject(),
                formData: formsMap[user._id.toString()] || null
            }));

            return res.status(200).json(responseData);
            }
            else
            {
            return res.status(200).json({ msg:"No Filter Selected " });
            }
        }
        else
        {
            return res.status(200).json({ msg:"No Type Selected" });
        }
        
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }




}
