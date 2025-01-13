
const { User } = require('../../models/client_model')
const { Form } = require('../../models/form_model')
const { DietPlan } = require('../../models/dietPlan_model')
const {DietPlanTrack} = require("../../models/dietPlanMealTrack_model")
const jwt = require("jsonwebtoken")
const { Roles, Form_Types, Form_Status, Plan_Status, Subscription_Status, DietPlanStatus,FoodCategory } = require("../../Helpers/constants")
const { otp_code, hash, calculateTotalNutrientsForPlan } = require("../../Helpers/helperFunction")
const moment = require('moment');
const JWT = require("jsonwebtoken");
const mongoose = require('mongoose');
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.sendgrid_apikey);
const bcrypt = require('bcryptjs');

exports.signup = async function (req, res) {
  try {
    let data = await User.findOne({ email: req.body.email, role: Roles.client })
    if (data) {
      return res.status(400).json({
        msg: "Email already exsist",
      })
    }
    let passwordHash = await hash(req.body.password);
    await User.create({ passwordHash: passwordHash, email: req.body.email, role: Roles.client, full_name: req.body.full_name, gender: req.body.gender })
    let otpCode = await otp_code()
    let otpCode_timestamp = Date.now()
    await User.updateOne(
      { email: req.body.email, role: Roles.client },
      { otpCode: otpCode, otpCode_timestamp: otpCode_timestamp }
    );
    const msg = {
      to: req.body.email,
      from: {
        email: process.env.SENDER_EMAIL,
        name: process.env.SENDER_NAME,
      },
      templateId: process.env.SINGUP_OTP_EMAIL_TEMPLATE_ID,
      dynamicTemplateData: {
        otpCode,
      },
    };

    await sgMail.send(msg);
    return res.status(200).json({
      msg: "OTP Sended",
    })
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }




}
exports.login = async function (req, res) {
  try {
    let data = await User.findOne({ email: req.body.email, role: Roles.client }).lean()
    if (!data) {
      throw "No email found please signup"
    }
    if (!data.email_verified) {
      throw "email not verified"
    }
    if (!bcrypt.compareSync(req.body.password, data.passwordHash)) {
      throw "Invalid Password"
    }
    const secret = process.env.jwtSecret
    const token = JWT.sign({
      id: data._id,
    }, secret, { expiresIn: '3650d' });
    const { passwordHash, otpCode, otpCode_timestamp, ...updatedData } = data;
    //login work
    await User.updateOne({ _id: data._id }, { isLogin: true })
    return res.status(200).json({ token: token, isNewUser: data.isNewUser,userData:updatedData });
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ err })
  }




}
exports.OtpCodeVerification = async (req, res) => {
  try {
    let data = await User.findOne({ email: req.body.email, role: Roles.client })

    if (!data.otpCode_timestamp || !data.otpCode) {
      return res.status(400).json({ msg: "Please request for new email code." });
    }
    const now = moment(Date.now());
    const expDate = moment(parseInt(data.otpCode_timestamp, 10));
    const duration = moment.duration(now.diff(expDate));
    const elapsedTime = duration.asMinutes();
    if (elapsedTime > 5) {
      return res.status(400).json({ msg: 'Code expired. Please request for new code.' });
    }
    if (req.body.otpCode !== data.otpCode) {
      return res.status(409).json({ status: false, msg: 'Invalid code! Please request for a new code.' });
    }
    const secret = process.env.jwtSecret
    const token = JWT.sign({
      id: data._id,
    }, secret, { expiresIn: '3650d' });

    //login work
    await User.updateOne({ _id: data._id }, { isLogin: true, email_verified: true })
    return res.status(200).json({ msg: "Verified", token: token, isNewUser: data.isNewUser });
  } catch (error) {
    console.log("error in link verification:::::", error);
    return res.status(500).json({ msg: error.message });
  }
};
exports.firstTimeForm = async (req, res) => {
  try {
    let client = req.user
    if (req.files) {
      if (req.files.bodyImages?.length) {
        req.body.generalForm.bodyImages = []
        req.body.generalForm.bodyImages.push(
          ...req.files.bodyImages.map((file) => file.location)
        );
      }
      // else
      // {
      //     return res.status(400).json({ msg: "Bad Request, Body Image is missing" });
      // }
      if (req.files.MRI_XRAY_CT?.length) {
        req.body.workoutForm.MRI_XRAY_CT = req.files.MRI_XRAY_CT[0].location
      }
    }
    req.body.generalForm.form_Type = Form_Types.General
    req.body.workoutForm.form_Type = Form_Types.Workout
    req.body.dietForm.form_Type = Form_Types.Diet
    req.body.client_id = client.id
    req.body.form_status = Form_Status.Initial

    await Form.create(req.body)
    //update user 
    await User.updateOne({ _id: client._id }, { subsctiption_status: Subscription_Status.NotStarted, isNewUser: false, diet_plan_status: Plan_Status.FirstPlanNeeded, workout_plan_status: Plan_Status.FirstPlanNeeded })


    return res.status(200).json({ msg: "First Time Form submited" });
  } catch (error) {
    console.log("error first time submit form", error);
    return res.status(500).json({ msg: error.message });
  }
};
exports.getActiveDietPlan = async (req, res) => {
  try {
    let client = req.user
    let data = await DietPlan.findOne({ client_id: client.id, status: DietPlanStatus.Active }).populate({
      path: 'meals.items.referenceId', options: { strictPopulate: false },
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
    let totalNutrients = await calculateTotalNutrientsForPlan(data);
    let dietPlan = {
        ...data,
        totalNutrients
    }
    dietPlan.meals.forEach(meal => {
      const totalNutrientsMeal = {
        TotalCalories: 0,
        TotalFat: 0,
        TotalProtein: 0,
        TotalCarbohydrates: 0
      };
    
      meal.items.forEach(item => {
        if (item.type === FoodCategory.FoodItem) {
          const nutrients = item.referenceId;
          totalNutrientsMeal.TotalCalories += (nutrients.calories * item.quantity) || 0;
          totalNutrientsMeal.TotalFat += (nutrients.fat * item.quantity) || 0;
          totalNutrientsMeal.TotalProtein += (nutrients.protein * item.quantity) || 0;
          totalNutrientsMeal.TotalCarbohydrates += (nutrients.carbohydrates * item.quantity) || 0;
        } else if (item.type === FoodCategory.Recipe) {
          item.referenceId.ingredients.forEach(ingredient => {
            const foodItem = ingredient.foodItem;
            totalNutrientsMeal.TotalCalories += (foodItem.calories * ingredient.quantity) || 0;
            totalNutrientsMeal.TotalFat += (foodItem.fat * ingredient.quantity) || 0;
            totalNutrientsMeal.TotalProtein += (foodItem.protein * ingredient.quantity) || 0;
            totalNutrientsMeal.TotalCarbohydrates += (foodItem.carbohydrates * ingredient.quantity) || 0;
          });
        }
      });
    
      meal.totalMealNutrients = totalNutrientsMeal;
    });
    const startOfDay = moment().startOf('day').toDate();
    const endOfDay = moment().endOf('day').toDate();
    let completedMeals = await DietPlanTrack.find({
      client_id: client.id,
      dietPlan_id: data._id,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });
    const completedMealIds = completedMeals.map((meal) => meal.mealType);
    const totalNutrientsTaken = {
      TotalCalories: 0,
      TotalFat: 0,
      TotalProtein: 0,
      TotalCarbohydrates: 0,
    };
    dietPlan.meals.forEach((meal) => {
      // Determine meal status
      if (completedMealIds.includes(meal.mealType)) {
        meal.mealStatus = 'Completed';

        // Add nutrients to total nutrients taken
        totalNutrientsTaken.TotalCalories += meal.totalMealNutrients.TotalCalories || 0;
        totalNutrientsTaken.TotalFat += meal.totalMealNutrients.TotalFat || 0;
        totalNutrientsTaken.TotalProtein += meal.totalMealNutrients.TotalProtein || 0;
        totalNutrientsTaken.TotalCarbohydrates += meal.totalMealNutrients.TotalCarbohydrates || 0;
      } else {
        meal.mealStatus = 'NotCompleted';
      }
    });

    // Add total nutrients taken to the diet plan
    dietPlan.totalNutrientsTaken = totalNutrientsTaken;
    
    return res.status(200).json(dietPlan)
  }
  catch (error) {
    return res.status(500).json({ msg: error.message });
  }
}
exports.progressDietPlan = async (req, res) => {
  try
  {
    req.body.client_id = req.user.id
    const { meal_id, client_id } = req.body;

    // Get the start of the current day
    const startOfDay = moment().startOf('day').toDate();
    const endOfDay = moment().endOf('day').toDate();

    // Check if the meal_id already exists for today
    const existingMeal = await DietPlanTrack.findOne({
      client_id,
      meal_id: meal_id,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    if (existingMeal) {
      return res.status(400).json({ msg: 'This meal has already been logged for today.' });
    }

    // Proceed to create a new record
    await DietPlanTrack.create(req.body);

    return res.status(200).json({msg:"updated"})
  }
  catch(error)
  {
    return res.status(500).json({ msg: error.message });
  }
}