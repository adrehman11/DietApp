const JOI = require("@hapi/joi");
const {FoodMeals,FoodCategory,DietPlanStatus} = require("../Helpers/constants")

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
  full_name:JOI.string().required(),
  gender:JOI.string().required(),
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
    use_vitamins_minerals:JOI.string().required(),
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
  unit:JOI.string().required(),
  calories:JOI.number().required(),
  fat: JOI.number().required(),
  protein:JOI.number().required(),
  carbohydrates:JOI.number().required(),
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
      foodItem:JOI.string().required(),
      quantity:JOI.number().required().min(1)
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
  category: JOI.string().valid(FoodCategory.FoodItem, FoodCategory.Recipe, FoodCategory.Supplement).required()
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
  client_id:JOI.string().required(),
  status:JOI.string().valid(DietPlanStatus.Saved,DietPlanStatus.Active).required(),
  meals: JOI.array().items(
    JOI.object({
      mealType:JOI.string().valid(FoodMeals.Breakfast, FoodMeals.Lunch, FoodMeals.Dinner, FoodMeals.Snack, FoodMeals.Pre_Workout, FoodMeals.Post_Workout).required(),
      items:JOI.array().items(
        JOI.object({
          type:JOI.string().valid(FoodCategory.FoodItem, FoodCategory.Recipe, FoodCategory.Supplement).required(),
          referenceId:JOI.string().required(),
          quantity:JOI.number().required().min(1)
         })).min(1)
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

const getAllDietPlansSchema = JOI.object().keys({
  page: JOI.number().required(),
  limit: JOI.number().required(),
  client_id:JOI.string().required(),
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
  mealType:JOI.string().valid(FoodMeals.Breakfast, FoodMeals.Lunch, FoodMeals.Dinner, FoodMeals.Snack, FoodMeals.Pre_Workout, FoodMeals.Post_Workout).required(),
  items:JOI.array().items(
    JOI.object({
      type:JOI.string().valid(FoodCategory.FoodItem, FoodCategory.Recipe, FoodCategory.Supplement).required(),
      referenceId:JOI.string().required(),
      quantity:JOI.number().required().min(1)
      })).min(1),
  meal_id:JOI.string().required(),
  totalMealNutrients: JOI.object({
    TotalCalories: JOI.number().required(),
    TotalFat: JOI.number().required(),
    TotalProtein: JOI.number().required(),
    TotalCarbohydrates:JOI.number().required(),
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
