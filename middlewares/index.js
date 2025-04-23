const JOI = require("@hapi/joi");
const { FoodMeals, FoodCategory, DietPlanStatus,ScheduleCheckInType, Roles,Plan_Status,Subscription_Status } = require("../Helpers/constants")

const loginSchema = JOI.object().keys({
  email: JOI.string().regex(/[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9!#$%&'*+/=?^_`{|}~-]+\.[a-z0-9]{2,3}/).required(),
  password: JOI.string().required(),
});

exports.login = (req, res, next) => {
  const result = loginSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};
const signupSchema = JOI.object().keys({
  email: JOI.string().regex(/[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9!#$%&'*+/=?^_`{|}~-]+\.[a-z0-9]{2,3}/).required(),
  password: JOI.string().required(),
  full_name: JOI.string().required(),
  gender: JOI.string().required(),
});

exports.signup = (req, res, next) => {
  const result = signupSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};



const otpCodeVerificationSchema = JOI.object().keys({
  email: JOI.string().regex(/[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9!#$%&'*+/=?^_`{|}~-]+\.[a-z0-9]{2,3}/).required(),
  otpCode: JOI.number().required(),
});

exports.otpCodeVerification = (req, res, next) => {
  const result = otpCodeVerificationSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};

const firstTimeFormSchema = JOI.object().keys({
  generalForm: JOI.object({
    gender: JOI.string().required(),
    height: JOI.number().required(),
    weight: JOI.number().required(),
    age: JOI.number().required(),
    profession: JOI.string().required(),
    Regular_activity: JOI.string().required(),
    health_problems: JOI.boolean().required(),
    medical_analysis: JOI.string().required(),
    listOfMedicationTaken: JOI.string().required(),
    injuries_surgeries: JOI.string().required(),
  }).required(),
  workoutForm: JOI.object({
    activity_level: JOI.string().required(),
    any_injuries: JOI.string().required(),
    MRI_XRAY_CT_Details: JOI.string().optional().allow(""),
    resistance_traning: JOI.string().required(),
    workout_place: JOI.string().required(),
    available_tools_home: JOI.string().required(),
    available_days_exercise: JOI.string().required(),
    experience_exercise_regimens: JOI.string().required(),
    dont_like_exercise: JOI.array().required(),
    where_to_do_workout: JOI.string().required(),
    daily_steps: JOI.string().required(),
    previous_experience_online_coaching: JOI.string().required(),
    notes: JOI.string().required(),
    why_did_subscribe: JOI.string().required(),
  }).required(),
  dietForm: JOI.object({
    joining_target: JOI.string().required(),
    smoking: JOI.string().required(),
    dieting_before: JOI.string().required(),
    family_support_idea: JOI.string().required(),
    past_experience_diet: JOI.string().required(),
    dont_like_food: JOI.array().required(),
    meals_in_a_day: JOI.string().required(),
    meals_in_a_diet: JOI.string().required(),
    budget_for_diet: JOI.string().required(),
    rate_appetite: JOI.string().required(),
    use_vitamins_minerals: JOI.string().required(),
    nutritional_supplemets: JOI.string().required(),
  }).required()
});

exports.firstTimeForm = (req, res, next) => {
  const result = firstTimeFormSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};

exports.FlatObjects = (req, res, next) => {
  const transformed = {};

  // Iterate through the req.body keys
  Object.keys(req.body).forEach((key) => {
    const parts = key.split('.'); // Split by dot notation

    // Build the nested object
    let temp = transformed;
    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        // If the key represents an array-like string, parse it
        if ((key.includes('dont_like_exercise') || key.includes('dont_like_food')) && typeof req.body[key] === 'string') {
          try {
            // Attempt to parse the string to an array
            temp[part] = JSON.parse(req.body[key]);
          } catch (error) {
            // If parsing fails, handle the error (for instance, return an empty array)
            temp[part] = [];
          }
        } else {
          temp[part] = req.body[key];  // Set the final value (non-array values)
        }
      } else {
        temp[part] = temp[part] || {}; // Create the object if it doesn't exist
      }
      temp = temp[part]; // Drill down to the next level
    });
  });
  req.body = transformed;
  next()
};

const AddFoodItemsSchema = JOI.object().keys({
  name: JOI.string().required(),
  quantity: JOI.number().required(),
  unit: JOI.string().required(),
  calories: JOI.number().required(),
  fat: JOI.number().required(),
  protein: JOI.number().required(),
  carbohydrates: JOI.number().required(),
});

exports.AddFoodItems = (req, res, next) => {
  const result = AddFoodItemsSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};


const AddFoodRecipeSchema = JOI.object().keys({
  name: JOI.string().required(),
  description: JOI.string().required(),
  ingredients: JOI.array().items(
    JOI.object({
      foodItem: JOI.string().required(),
      quantity: JOI.number().required().min(1)
    })).min(1)
});

exports.AddFoodRecipe = (req, res, next) => {
  const result = AddFoodRecipeSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};

const AllFoodItemsSchema = JOI.object().keys({
  page: JOI.number().required(),
  limit: JOI.number().required(),
  category: JOI.string().valid(FoodCategory.FoodItem, FoodCategory.Recipe, FoodCategory.Supplement).required(),
  search: JOI.string().allow(),
});

exports.AllFoodItems = (req, res, next) => {
  const result = AllFoodItemsSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};

const createDietPlanSchema = JOI.object().keys({
  name: JOI.string().required(),
  numberOfDays: JOI.number().required(),
  client_id: JOI.string().required(),
  coach_id:JOI.string().optional(),
  status: JOI.string().valid(DietPlanStatus.Saved, DietPlanStatus.Active).required(),
  coach_notes: JOI.string().allow(),
  meals: JOI.array().items(
    JOI.object({
      mealType: JOI.string().valid(FoodMeals.Breakfast, FoodMeals.Lunch, FoodMeals.Dinner, FoodMeals.Snack, FoodMeals.Pre_Workout, FoodMeals.Post_Workout).required(),
      items: JOI.array().items(
        JOI.object({
          type: JOI.string().valid(FoodCategory.FoodItem, FoodCategory.Recipe, FoodCategory.Supplement).required(),
          referenceId: JOI.string().required(),
          quantity: JOI.number().required().min(1)
        })).min(1),
      coach_notes_meals:JOI.string().allow(),
    })).min(1)
});

exports.createDietPlan = (req, res, next) => {
  const result = createDietPlanSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};
const editDietPlanSchema = JOI.object().keys({
  id:JOI.string().required(),
  name: JOI.string().required(),
  numberOfDays: JOI.number().required(),
  status: JOI.string().valid(DietPlanStatus.Saved, DietPlanStatus.Active).required(),
  coach_notes: JOI.string().allow(),
  meals: JOI.array().items(
    JOI.object({
      mealType: JOI.string().valid(FoodMeals.Breakfast, FoodMeals.Lunch, FoodMeals.Dinner, FoodMeals.Snack, FoodMeals.Pre_Workout, FoodMeals.Post_Workout).required(),
      items: JOI.array().items(
        JOI.object({
          type: JOI.string().valid(FoodCategory.FoodItem, FoodCategory.Recipe, FoodCategory.Supplement).required(),
          referenceId: JOI.string().required(),
          quantity: JOI.number().required().min(1)
        })).min(1),
      coach_notes_meals:JOI.string().allow(),
    })).min(1)
});

exports.editDietPlan = (req, res, next) => {
  const result = editDietPlanSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};
const deleteDietPlanSchema = JOI.object().keys({
  id:JOI.string().required(),
});

exports.deleteDietPlan = (req, res, next) => {
  const result = deleteDietPlanSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};


const getAllDietPlansSchema = JOI.object().keys({
  page: JOI.number().required(),
  limit: JOI.number().required(),
  client_id: JOI.string().required(),
});

exports.getAllDietPlans = (req, res, next) => {
  const result = getAllDietPlansSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};

const getDietPlanIDSchema = JOI.object().keys({
  dietPlanID: JOI.string().required(),
});

exports.getDietPlanID = (req, res, next) => {
  const result = getDietPlanIDSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};

const completeMealSchema = JOI.object().keys({
  mealType: JOI.string().valid(FoodMeals.Breakfast, FoodMeals.Lunch, FoodMeals.Dinner, FoodMeals.Snack, FoodMeals.Pre_Workout, FoodMeals.Post_Workout).required(),
  items: JOI.array().items(
    JOI.object({
      type: JOI.string().valid(FoodCategory.FoodItem, FoodCategory.Recipe, FoodCategory.Supplement).required(),
      referenceId: JOI.string().required(),
      quantity: JOI.number().required().min(1)
    })).min(1),
  meal_id: JOI.string().required(),
  totalMealNutrients: JOI.object({
    TotalCalories: JOI.number().required(),
    TotalFat: JOI.number().required(),
    TotalProtein: JOI.number().required(),
    TotalCarbohydrates: JOI.number().required(),
  }),
  dietPlan_id: JOI.string().required(),
})



exports.completeMeal = (req, res, next) => {
  const result = completeMealSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};
const completeExerciseSchema = JOI.object().keys({
  exercise_details_id: JOI.array().required().min(1),
  workoutPlan_id: JOI.string().required(),
})



exports.completeExercise = (req, res, next) => {
  const result = completeExerciseSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};



const addWorkoutExerciseSchema = JOI.object().keys({
  exercise_name: JOI.string().required(),
  category: JOI.string().required(),
  target_muscle: JOI.string().required(),
  equipment: JOI.string().required(),
  exercise_type: JOI.string().required(),
  video_url: JOI.string().required(),
  description: JOI.string().required(),
  kg: JOI.number().required(),
  RepsPerSet: JOI.number().required(),
  Tempo: JOI.number().required(),
  RestTime: JOI.number().required(),
})



exports.addWorkoutExercise = (req, res, next) => {
  const result = addWorkoutExerciseSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};

const editWorkoutExerciseSchema = JOI.object().keys({
  workoutId:JOI.string().required(),
  exercise_name: JOI.string().required(),
  category: JOI.string().required(),
  target_muscle: JOI.string().required(),
  equipment: JOI.string().required(),
  exercise_type: JOI.string().required(),
  video_url: JOI.string().required(),
  description: JOI.string().required(),
  kg: JOI.number().required(),
  RepsPerSet: JOI.number().required(),
  Tempo: JOI.number().required(),
  RestTime: JOI.number().required(),
})



exports.editWorkoutExercise = (req, res, next) => {
  const result = editWorkoutExerciseSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};


const AllWorkoutExerciseSchema = JOI.object().keys({
  page: JOI.number().required(),
  limit: JOI.number().required(),
  search: JOI.string().allow(),
});

exports.AllWorkoutExercise = (req, res, next) => {
  const result = AllWorkoutExerciseSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};

const createWorkoutPlanSchema = JOI.object().keys({
  name: JOI.string().required(),
  numberOfweeks: JOI.number().required(),
  exercises: JOI.array().items(
    JOI.object({
      day: JOI.string().required(),
      strength: JOI.object({
        WorkoutName: JOI.string().required(),
        exercise_details: JOI.array().items(
          JOI.object({
            exercise_name: JOI.string().required(),
            workoutDetails:JOI.array().items(
              JOI.object({
                Set: JOI.string().required(),
                RIR: JOI.string().required(),
                Tempo: JOI.string().required(),
                Rest: JOI.string().required(),
                Kg: JOI.string().required(),
                Reps: JOI.string().required()
              })).min(1)
          })).min(1)
      }),
      cardio: JOI.string().required(),
    })).min(1),
  status: JOI.string().required(),
  client_id: JOI.string().required(),
  coach_id: JOI.string().optional(),
  coach_notes: JOI.string().required()
});

exports.createWorkoutPlan = (req, res, next) => {
  const result = createWorkoutPlanSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};
const editWorkoutPlanSchema = JOI.object().keys({
  name: JOI.string().required(),
  id:JOI.string().required(),
  numberOfweeks: JOI.number().required(),
  exercises: JOI.array().items(
    JOI.object({
      day: JOI.string().required(),
      strength: JOI.object({
        WorkoutName: JOI.string().required(),
        exercise_details: JOI.array().items(
          JOI.object({
            exercise_name: JOI.string().required(),
            workoutDetails:JOI.array().items(
              JOI.object({
                Set: JOI.string().required(),
                RIR: JOI.string().required(),
                Tempo: JOI.string().required(),
                Rest: JOI.string().required(),
                Kg: JOI.string().required(),
                Reps: JOI.string().required()
              })).min(1)
          })).min(1)
      }),
      cardio: JOI.string().required(),
    })).min(1),
  status: JOI.string().required(),
  coach_notes: JOI.string().required()
});

exports.editWorkoutPlan = (req, res, next) => {
  const result = editWorkoutPlanSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};



const getAllWorkoutPlansSchema = JOI.object().keys({
  page: JOI.number().required(),
  limit: JOI.number().required(),
  client_id: JOI.string().required(),
});

exports.getAllWorkoutPlans = (req, res, next) => {
  const result = getAllWorkoutPlansSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};

const getWorkoutPlanIDSchema = JOI.object().keys({
  workoutPlanId: JOI.string().required(),
});

exports.getWorkoutPlanID = (req, res, next) => {
  const result = getWorkoutPlanIDSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};

const getAllClientsByFilterSchema = JOI.object().keys({
  page: JOI.number().required(),
  pageSize: JOI.number().required(),
  type:JOI.string().required(),
  filter:JOI.string().valid("",Plan_Status.AllReady,Plan_Status.UpdateNeeded,Plan_Status.FirstPlanNeeded).allow(""),
  search:JOI.string().optional().allow("")
});

exports.getAllClientsByFilter = (req, res, next) => {
  const result = getAllClientsByFilterSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};
const getClientByIdSchema = JOI.object().keys({
  client_id: JOI.string().required(),
});

exports.getClientById = (req, res, next) => {
  const result = getClientByIdSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};
exports.getAllClientsByFilter = (req, res, next) => {
  const result = getAllClientsByFilterSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};
const scheduleCheckInInSchema = JOI.object().keys({
  date: JOI.string().required(),
  type:JOI.string().valid(ScheduleCheckInType.Diet,ScheduleCheckInType.Workout).required(),
  client_id: JOI.string().required(),
  coach_id:JOI.string().optional(),

});

exports.scheduleCheckIn = (req, res, next) => {
  const result = scheduleCheckInInSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};

const getAllScheduleCheckInSchema = JOI.object().keys({
  startDate: JOI.string().required(),
  endDate:JOI.string().required(),
});

exports.getAllScheduleCheckIn = (req, res, next) => {
  const result = getAllScheduleCheckInSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};
const scheduleCheckInByTypeSchema = JOI.object().keys({
  type: JOI.string().valid(ScheduleCheckInType.Diet,ScheduleCheckInType.Workout).required(),
  client_id:JOI.string().required(),
});

exports.scheduleCheckInByType = (req, res, next) => {
  const result = scheduleCheckInByTypeSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};


const scheduleCheckInTrackDietSchema = JOI.object().keys({
  schedule_id:JOI.string().required(),
    // client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    committementLevel :JOI.string().required(),
    weight :JOI.string().required(),
    // bodyImages:JOI.string().allow(),
    chestMeasurement:JOI.string().required(),
    stomachMeasurement:JOI.string().required(),
    waistMeasurement:JOI.string().required(),
    hipsMeasurement:JOI.string().required(),
    thighMeasurement:JOI.string().required(),
    calvesMeasurement:JOI.string().required(),
    reviewExperience:JOI.string().required(),
});

exports.scheduleCheckInTrackDiet = (req, res, next) => {
  const result = scheduleCheckInTrackDietSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};
const scheduleCheckInTrackWorkoutSchema = JOI.object().keys({
  schedule_id:JOI.string().required(),
    // client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    committementLevel :JOI.string().allow(),
    trainingInGeneral:JOI.string().allow(),
    progressWeightsReps:JOI.string().allow(),
    noOfSetsSuitable:JOI.string().allow(),
    trainingIntensity:JOI.string().allow(),
    rateDegreeMuscleRecovery:JOI.string().allow(),
    exerciseCausePain:JOI.string().allow(),
    reviewExperience:JOI.string().allow(),
});

exports.scheduleCheckInTrackWorkout = (req, res, next) => {
  const result = scheduleCheckInTrackWorkoutSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};



const assignCoachSchema = JOI.object().keys({
  assign:JOI.array().items(
    JOI.object({
      type:JOI.string().valid(ScheduleCheckInType.Diet,ScheduleCheckInType.Workout).required(),
      _id:JOI.string().required(),
    })),
  clientId:JOI.string().required()

 
});

exports.assignCoach = (req, res, next) => {
  const result = assignCoachSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};



const getAllCoachScehma = JOI.object().keys({
  page: JOI.number().required(),
  pageSize: JOI.number().required(),
  search: JOI.string().allow(),
});

exports.getAllCoach = (req, res, next) => {
  const result = getAllCoachScehma.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};

const getAllWorkoutExercisesScehma = JOI.object().keys({
  page: JOI.number().required(),
  pageSize: JOI.number().required(),
  search: JOI.string().allow(),
});

exports.getAllWorkoutExercises = (req, res, next) => {
  const result = getAllWorkoutExercisesScehma.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};



const generateSupportTicketScehma = JOI.object().keys({
  name: JOI.string().required(),
  email:  JOI.string().regex(/[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9!#$%&'*+/=?^_`{|}~-]+\.[a-z0-9]{2,3}/).required(),
  department: JOI.string().required(),
  description:JOI.string().optional(),
});

exports.generateSupportTicket = (req, res, next) => {
  const result = generateSupportTicketScehma.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};

const AddRoleScehma = JOI.object().keys({
  full_name: JOI.string().required(),
  email:  JOI.string().regex(/[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9!#$%&'*+/=?^_`{|}~-]+\.[a-z0-9]{2,3}/).required(),
  password: JOI.string().required(),
  role: JOI.string().valid(Roles.coach,Roles.customerSupport,Roles.staff,Roles.teamLead).required(),
});

exports.AddRole = (req, res, next) => {
  const result = AddRoleScehma.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};


const getSupportTicketByTypeSchema = JOI.object().keys({
  page: JOI.number().required(),
  pageSize: JOI.number().required(),
  type:JOI.string().valid("All","Pending","Processing","Resolved").required(),
});

exports.getSupportTicketByType = (req, res, next) => {
  const result = getSupportTicketByTypeSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};

const updateTicketStatusSchema = JOI.object().keys({
  _id: JOI.string().required(),
  status:JOI.string().valid("Pending","Processing","Resolved").required(),
});

exports.updateTicketStatus = (req, res, next) => {
  const result = updateTicketStatusSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};
const chatOnTicketSchema = JOI.object().keys({
  supportTicket_id: JOI.string().required(),
  // client_id: JOI.string().required(),
  message: JOI.string().required()
});

exports.chatOnTicket = (req, res, next) => {
  const result = chatOnTicketSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};

const getSupportTicketChatByIdSchema = JOI.object().keys({
  page: JOI.number().required(),
  pageSize: JOI.number().required(),
  ticket_id:JOI.string().required(),
  client_id:JOI.string().required(),
});

exports.getSupportTicketChatById = (req, res, next) => {
  const result = getSupportTicketChatByIdSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};

const getAllFoodItemsSchema = JOI.object().keys({
  page: JOI.number().optional(),
  pageSize: JOI.number().optional(),
  search:JOI.string().optional(),
});

exports.getAllFoodItems = (req, res, next) => {
  const result = getAllFoodItemsSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};
const getAllFoodRecipeSchema = JOI.object().keys({
  page: JOI.number().required(),
  pageSize: JOI.number().required(),
});

exports.getAllFoodRecipe = (req, res, next) => {
  const result = getAllFoodRecipeSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};

const AddSupplementSchema = JOI.object().keys({
  name: JOI.string().required(),
});

exports.AddSupplement = (req, res, next) => {
  const result = AddSupplementSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};

const getTeamLeadClientsByFilterSchema = JOI.object().keys({
  filter:JOI.string().valid("","Assigned Clients","Unassigned Clients").allow(""),
  type:JOI.string().valid("All","Diet Plans","Workout Plans").required(),
  page:JOI.number().required(),
  pageSize:JOI.number().required()
});

exports.getTeamLeadClientsByFilter = (req, res, next) => {
  const result = getTeamLeadClientsByFilterSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};
const getAllPlansByFilterSchema = JOI.object().keys({
  filter:JOI.string().valid("","Diet Plans","Workout Plans").allow(""),
  search:JOI.string().allow(""),
  page:JOI.number().required(),
  pageSize:JOI.number().required()
});

exports.getAllPlansByFilter = (req, res, next) => {
  const result = getAllPlansByFilterSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};

const getAllCoachSchema = JOI.object().keys({
  search:JOI.string().allow(""),
  page:JOI.number().required(),
  pageSize:JOI.number().required()
});

exports.getAllCoach = (req, res, next) => {
  const result = getAllCoachSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};
const getCoachAdminDataSchema = JOI.object().keys({
  _id:JOI.string().required(),
});

exports.getCoachAdminData = (req, res, next) => {
  const result = getCoachAdminDataSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};

const getCustomerSupportByIDScehma = JOI.object().keys({
  page: JOI.number().required(),
  pageSize: JOI.number().required(),
  _id:JOI.string().required()
});

exports.getCustomerSupportByID = (req, res, next) => {
  const result = getCustomerSupportByIDScehma.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};

const editProfileScehma = JOI.object().keys({
  full_name : JOI.string().required(),
  bio: JOI.string().required(),
  status:JOI.string().required()
});

exports.editProfile = (req, res, next) => {
  const result = editProfileScehma.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};

const getStaffClientsByFilterSchema = JOI.object().keys({
  page: JOI.number().required(),
  pageSize: JOI.number().required(),
  filter:JOI.string().valid("All Plans","Active Plans" ,"Freezed Plans" ,"Expired Plans"),
  search:JOI.string().optional().allow("")
});

exports.getStaffClientsByFilter = (req, res, next) => {
  const result = getStaffClientsByFilterSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};
const changeSubscriptionStatusByClientIdScehma = JOI.object().keys({
  client_id: JOI.string().required(),
  subscriptionId: JOI.string().required(),
  status: JOI.string().required().valid("Active","Freezed"),
  freezDuaration: JOI.number().required()
});

exports.changeSubscriptionStatusByClientId = (req, res, next) => {
  const result = changeSubscriptionStatusByClientIdScehma.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};

const importDataSchema = JOI.object().keys({
  page:JOI.number().required(),
  pageSize:JOI.number().required(),
  search:JOI.string().optional().allow("")

});

exports.importData = (req, res, next) => {
  const result = importDataSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};

const importDietPlanSchema = JOI.object().keys({
  dietPlanID:JOI.string().required(),
  coach_id:JOI.string().required(),
  client_id:JOI.string().required(),

});

exports.importDietPlan = (req, res, next) => {
  const result = importDietPlanSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};

const importWorkoutPlanSchema = JOI.object().keys({
  workoutPlanID:JOI.string().required(),
  coach_id:JOI.string().required(),
  client_id:JOI.string().required(),

});

exports.importWorkoutPlan = (req, res, next) => {
  const result = importWorkoutPlanSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};
const inboxChatByRoomIdSchema = JOI.object().keys({
  page:JOI.number().required(),
  pageSize:JOI.number().required(),
  chatRoomId:JOI.string().required(),

});

exports.inboxChatByRoomId = (req, res, next) => {
  const result = inboxChatByRoomIdSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ msg: result.error.message });
  } else {
    next();
  }
};


