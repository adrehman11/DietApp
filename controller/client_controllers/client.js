
const { User } = require('../../models/client_model')
const { Form } = require('../../models/form_model')
const { DietPlan } = require('../../models/dietPlan_model')
const { WorkoutPlan } = require('../../models/workoutPlan_model')
const { DietPlanTrack } = require("../../models/dietPlanMealTrack_model")
const { ScheduleCheckIn } = require("../../models/scheduleCheckIn_model")
const { ScheduleCheckInTrack } = require("../../models/scheduleCheckinTrack_model")
const { WorkoutPlanTrack } = require("../../models/workoutTrack_model")
const { SupportTicket } = require("../../models/supportTicket_model")
const { SupportTicketChat } = require("../../models/supportTicketChat_model")
const { Subscription } = require("../../models/subscription_model")
const jwt = require("jsonwebtoken")
const { Roles, Form_Types, Form_Status, Plan_Status, Subscription_Status, DietPlanStatus, FoodCategory, WorkoutPlanStatus } = require("../../Helpers/constants")
const { otp_code, hash, calculateTotalNutrientsForPlan,generateTicketId } = require("../../Helpers/helperFunction")
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
    await User.create({ passwordHash: passwordHash, email: req.body.email, role: Roles.client, full_name: req.body.full_name, gender: req.body.gender, fcmToken:req.body.fcmToken });
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
    await User.updateOne({ _id: data._id }, { isLogin: true,fcmToken:req.body.fcmToken })
    let formdata = await Form.findOne({client_id:data._id})
    let subscriptionData = await Subscription.findOne({user_id:data._id}).select("paymentStatus subscriptionName currentPeriodStart currentPeriodEnd")
    return res.status(200).json({ token: token, isNewUser: data.isNewUser, userData: updatedData,formdata:formdata,subscriptionData:subscriptionData });
  }
  catch (err) {
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
    await User.updateOne({ _id: client._id }, { subscription_status: Subscription_Status.NotStarted, isNewUser: false, diet_plan_status: Plan_Status.FirstPlanNeeded, workout_plan_status: Plan_Status.FirstPlanNeeded })


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
      select: '_id full_name email role diet_plan_status workout_plan_status subscription_status',
    }).populate({
      path: 'coach_id',
      select: '_id full_name email role U_ID',
    }).lean();
    if (!data) {
      return res.status(200).json({data:[]});
    }
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
  try {
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

    return res.status(200).json({ msg: "updated" })
  }
  catch (error) {
    return res.status(500).json({ msg: error.message });
  }
}
exports.getActiveWorkoutPlan = async (req, res) => {
  try {
    let client = req.user
    let data = await WorkoutPlan.findOne({ client_id: client.id, status: WorkoutPlanStatus.Active }).populate({
      path: 'client_id',
      select: '_id full_name email role diet_plan_status workout_plan_status subscription_status',
    }).populate({
      path: 'coach_id',
      select: '_id full_name email role U_ID',
    }).lean();
    if (!data) {
      return res.status(400).json({ msg: "No Data Found" });
    }
    const startOfDay = moment().startOf('day').toDate();
    const endOfDay = moment().endOf('day').toDate();
    const completedExercises = await WorkoutPlanTrack.find({
      client_id: client.id,
      workoutPlan_id: data._id,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    }).select('exercise_details_id');
    const completedExerciseIds = completedExercises.map(item => item.exercise_details_id);
    data.exercises.forEach((exercise) => {
      exercise.strength.exercise_details.forEach((detail) => {
        detail.workoutDetails.forEach((workout) => {
          workout.completed = completedExerciseIds.includes(workout._id.toString());
        });
      });
    });

    return res.status(200).json(data)
  }
  catch (error) {
    return res.status(500).json({ msg: error.message });
  }
}
exports.completeWorkoutExercise = async (req, res) => {
  try {
    let client = req.user;
    const { workoutPlan_id, exercise_details_id } = req.body;
    const startOfDay = moment().startOf('day').toDate();
    const endOfDay = moment().endOf('day').toDate();

    if (exercise_details_id.length === 0) {
      return res.status(400).json({ message: 'exercise_details_id must be a non-empty array' });
    }

    // Find existing tracking records for any of the provided exercise_details_id
    const existingTracks = await WorkoutPlanTrack.find({
      client_id: client._id,
      workoutPlan_id,
      exercise_details_id: { $in: exercise_details_id }, // Check if any exist
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    if (existingTracks.length > 0) {
      return res.status(400).json({ 
        message: 'Some exercises are already marked as completed', 
        existingExercises: existingTracks.map(track => track.exercise_details_id)
      });
    }

    // Create new tracking records for all exercise_details_id
    const tracksToCreate = exercise_details_id.map(id => ({
      client_id: client._id,
      workoutPlan_id,
      exercise_details_id: id
    }));

    const newTracks = await WorkoutPlanTrack.insertMany(tracksToCreate);

    res.status(201).json({ message: 'Workout exercises tracked successfully', newTracks });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
// exports.completeWorkoutExercise = async (req, res) => {
//   try {
//     let client = req.user
//     const existingTrack = await WorkoutPlanTrack.findOne({
//       client_id: client._id,
//       workoutPlan_id: req.body.workoutPlan_id,
//       exercise_details_id: req.body.exercise_details_id
//     });

//     if (existingTrack) {
//       return res.status(400).json({ message: 'Exercise already marked as completed' });
//     }

//     // Create new tracking record
//     const track = new WorkoutPlanTrack({ client_id: client._id, workoutPlan_id: req.body.workoutPlan_id, exercise_details_id: req.body.exercise_details_id });
//     await track.save();

//     res.status(201).json({ message: 'Workout tracked successfully', track });

//     return
//   }
//   catch (error) {
//     return res.status(500).json({ msg: error.message });
//   }
// }


exports.getScheduleCheckInByType = async function (req, res) {
  try {
    let client = req.user
    let data = await ScheduleCheckIn.find({ client_id: client._id, type: req.body.type,status:"Incomplete" })
    return res.status(200).json(data)
  }
  catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
}
exports.ScheduleCheckInTrackDiet = async function (req, res) {
  try {
    let client = req.user
    req.body.client_id = client._id
    if (req.file) {
      req.body.bodyImages =  req.file.location
    }
    let data = await ScheduleCheckIn.findOne({_id:  req.body.schedule_id})
    if(data.status == "Completed" )
    {
      return res.status(400).json({msg:"CheckIn  Already completed"})
    }
    await ScheduleCheckInTrack.create(req.body)
    await ScheduleCheckIn.updateOne({ _id:  req.body.schedule_id}, { status:"Completed"})
    return res.status(200).json({msg:"CheckIn Completed"})
  }
  catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
}
exports.ScheduleCheckInTrackWorkout = async function (req, res) {
  try {
    let client = req.user
    req.body.client_id = client._id
    let data = await ScheduleCheckIn.findOne({_id:  req.body.schedule_id})
    if(data.status == "Completed" )
    {
      return res.status(400).json({msg:"CheckIn  Already completed"})
    }
    await ScheduleCheckInTrack.create(req.body)
    await ScheduleCheckIn.updateOne({ _id:  req.body.schedule_id}, { status:"Completed"})
    return res.status(200).json({msg:"CheckIn Completed"})
  }
  catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
}


exports.createSupportTicket = async function (req, res) {
  try {
    let client = req.user
    req.body.client_id = client._id
    if (req.file) {
      req.body.image =  req.file.location
    }
    req.body.status= "Pending"
    req.body.TicketId= await generateTicketId();
    await SupportTicket.create(req.body)
    return res.status(200).json({msg:"Ticket Created"})

  }
  catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
}
exports.getAllSupportTicket = async function (req, res) {
  try {
    let client = req.user
    let data = await  SupportTicket.find({client_id :  client._id})
    res.status(200).json(data)

  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}
exports.chatOnTicket = async function (req, res) 
{
  try {
     req.body.client_id = req.user._id
    await SupportTicketChat.create(req.body)
    return res.status(200).json({ message: "Response submitted"});

  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error", error: err });
  }
};
exports.GetChatByTicketId = async function (req, res) 
{
  try {
   let {  page = 1, pageSize = 10 } = req.body;
    page = parseInt(page);
    pageSize = parseInt(pageSize);
   let data = await SupportTicketChat.find({supportTicket_id:req.body.ticket_id})
   .populate("client_id", "full_name image") // Selective population
   .populate("Support_id", "full_name image") // Selective population
   .skip((page - 1) * pageSize) // Skipping previous pages
   .limit(pageSize) // Limiting results per page
   .sort({ createdAt: 1 });
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error", error: err });
  }
};