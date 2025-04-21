const { FoodItem } = require("../../models/foodItem_model");
const { Supplement } = require("../../models/supplements_model");
const { FoodRecipe } = require("../../models/foodRecipe_model");
const { DietPlan } = require("../../models/dietPlan_model");
const { WorkoutExercise } = require("../../models/workout_exercises_model");
const { WorkoutPlan } = require("../../models/workoutPlan_model");
const { Form } = require("../../models/form_model");
const {
  FoodMeals,
  FoodCategory,
  DietPlanStatus,
  WorkoutPlanStatus,
  Roles,
  Plan_Status,
} = require("../../Helpers/constants");
const {
  calculateTotalNutrientsForPlan,
} = require("../../Helpers/helperFunction");
const JWT = require("jsonwebtoken");
const mongoose = require("mongoose");
const { User } = require("../../models/client_model");

exports.getMealsAndCategory = async function (req, res) {
  try {
    res.status(200).json({ FoodMeals, FoodCategory });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
exports.getAllFood = async function (req, res) {
  try {
    let page = req.body.page;
    let limit = req.body.limit;
    const skip = (page - 1) * limit;
    const searchFilter = req.body.search
      ? { name: { $regex: req.body.search, $options: "i" } }
      : {};
    if (req.body.category == FoodCategory.FoodItem) {
      let data = await FoodItem.find(searchFilter).skip(skip).limit(limit);
      res.status(200).json(data);
    } else if (req.body.category == FoodCategory.Recipe) {
      let data = await FoodRecipe.find(searchFilter)
        .skip(skip)
        .limit(limit)
        .populate({ path: "ingredients.foodItem" })
        .lean();
      const result = data.map((recipe) => {
        const total = recipe.ingredients.reduce(
          (acc, ingredient) => {
            const foodItem = ingredient.foodItem;
            if (foodItem) {
              acc.TotalCalories += foodItem.calories * ingredient.quantity || 0;
              acc.TotalFat += foodItem.fat * ingredient.quantity || 0;
              acc.TotalProtein += foodItem.protein * ingredient.quantity || 0;
              acc.TotalCarbohydrates +=
                foodItem.carbohydrates * ingredient.quantity || 0;
            }
            return acc;
          },
          {
            TotalCalories: 0,
            TotalFat: 0,
            TotalProtein: 0,
            TotalCarbohydrates: 0,
          }
        );
        return { ...recipe, totalRecipeNutrients: total };
      });
      res.status(200).json(result);
    } else if (req.body.category == FoodCategory.Supplement) {
      let data = await Supplement.find(searchFilter).skip(skip).limit(limit);
      res.status(200).json(data);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.createDietPlan = async function (req, res) {
  try {
    let coach = req.user;
    if (coach.role == Roles.coach) {
      req.body.coach_id = coach.id;
    } else if (coach.role == Roles.teamLead || coach.role == Roles.admin) {
      if (!req.body.coach_id) {
        throw "coach id is missing in payload";
      }
    }
    if (req.body.status == DietPlanStatus.Saved) {
      req.body.status = DietPlanStatus.Saved;
    } else if (req.body.status == DietPlanStatus.Active) {
      req.body.status = DietPlanStatus.Active;
    } else {
      res.status(401).json({ message: "Please Provide status" });
    }
    if (req.body.status === DietPlanStatus.Active) {
      await DietPlan.updateMany(
        { client_id: req.body.client_id, status: DietPlanStatus.Active },
        { $set: { status: DietPlanStatus.Saved } }
      );
      await User.updateOne(
        { _id: req.body.client_id },
        { $set: { diet_plan_status: Plan_Status.AllReady } }
      );
    }
    await DietPlan.create(req.body);

    res.status(200).json({ message: "Diet plan created" });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
exports.editDietPlan = async function (req, res) {
  try {
    let client = req.user;
    const { id } = req.body;
    const updateData = req.body;
    if (req.body.status == DietPlanStatus.Saved) {
      req.body.status = DietPlanStatus.Saved;
    } else if (req.body.status == DietPlanStatus.Active) {
      req.body.status = DietPlanStatus.Active;
    } else {
      res.status(401).json({ message: "Please Provide status" });
    }

    if (req.body.status === DietPlanStatus.Active) {
      // Deactivate all other plans for the client before activating a new one
      await DietPlan.updateMany(
        { client_id: req.body.client_id, status: DietPlanStatus.Active },
        { $set: { status: DietPlanStatus.Saved } }
      );
      await User.updateOne(
        { _id: req.body.client_id },
        { $set: { diet_plan_status: Plan_Status.AllReady } }
      );
    }
    const updatedDietPlan = await DietPlan.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true } // Return updated document and run schema validation
    );
    res.status(200).json({ message: "Diet plan updated", updatedDietPlan });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
exports.getAllDietPlans = async function (req, res) {
  try {
    let coach = req.user;
    let page = req.body.page;
    let pageSize = req.body.limit;
    const skip = (page - 1) * pageSize;
    let query = {};
    if (coach.role == Roles.coach) {
      query = { coach_id: coach._id, client_id: req.body.client_id };
    } else if (coach.role == Roles.teamLead || coach.role == Roles.admin) {
      query = { client_id: req.body.client_id };
    }
    let data = await DietPlan.find(query)
      .skip(skip)
      .limit(pageSize)
      .populate({
        path: "meals.items.referenceId",
        options: { strictPopulate: false },
        populate: {
          path: "ingredients.foodItem", // Field inside FoodRecipe to populate
          model: "FoodItem", // Explicitly specify the FoodItem model
          options: { strictPopulate: false },
        },
      })
      .populate({
        path: "client_id",
        select:
          "_id full_name email role diet_plan_status workout_plan_status subscription_status",
      })
      .populate({
        path: "coach_id",
        select: "_id image full_name email role U_ID",
      })
      .lean();
    const TotalDocuments = await DietPlan.countDocuments(query);

    for (let plan of data) {
      let formData = await Form.findOne({
        client_id: plan.client_id._id,
      }).lean();
      plan.client_id.form = formData || {}; // Attach form data to client
    }
    let dietPlansWithNutrients = calculateTotalNutrients(data);
    dietPlansWithNutrients.forEach((plan) => {
      plan.meals.forEach((meal) => {
        const totalNutrientsMeal = {
          TotalCalories: 0,
          TotalFat: 0,
          TotalProtein: 0,
          TotalCarbohydrates: 0,
        };

        meal.items.forEach((item) => {
          if (item.type === FoodCategory.FoodItem) {
            const nutrients = item.referenceId;
            totalNutrientsMeal.TotalCalories +=
              nutrients.calories * item.quantity || 0;
            totalNutrientsMeal.TotalFat += nutrients.fat * item.quantity || 0;
            totalNutrientsMeal.TotalProtein +=
              nutrients.protein * item.quantity || 0;
            totalNutrientsMeal.TotalCarbohydrates +=
              nutrients.carbohydrates * item.quantity || 0;
          } else if (item.type === FoodCategory.Recipe) {
            const totalRecipeNutrients = {
              TotalCalories: 0,
              TotalFat: 0,
              TotalProtein: 0,
              TotalCarbohydrates: 0,
            };
            item.referenceId.ingredients.forEach((ingredient) => {
              const foodItem = ingredient.foodItem;

              totalRecipeNutrients.TotalCalories +=
                foodItem.calories * ingredient.quantity * item.quantity || 0;
              totalRecipeNutrients.TotalFat +=
                foodItem.fat * ingredient.quantity * item.quantity || 0;
              totalRecipeNutrients.TotalProtein +=
                foodItem.protein * ingredient.quantity * item.quantity || 0;
              totalRecipeNutrients.TotalCarbohydrates +=
                foodItem.carbohydrates * ingredient.quantity * item.quantity ||
                0;
            });
            item.referenceId.totalRecipeNutrients = totalRecipeNutrients;
            totalNutrientsMeal.TotalCalories +=
              totalRecipeNutrients.TotalCalories;
            totalNutrientsMeal.TotalFat += totalRecipeNutrients.TotalFat;
            totalNutrientsMeal.TotalProtein +=
              totalRecipeNutrients.TotalProtein;
            totalNutrientsMeal.TotalCarbohydrates +=
              totalRecipeNutrients.TotalCarbohydrates;
          }
        });

        meal.totalMealNutrients = totalNutrientsMeal;
      });
    });

    return res
      .status(200)
      .json({ dietPlansWithNutrients, TotalDocuments, page, pageSize });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
exports.getDietPlanById = async function (req, res) {
  try {
    // let coach = req.user
    let data = await DietPlan.findOne({ _id: req.body.dietPlanID })
      .populate({
        path: "meals.items.referenceId",
        options: { strictPopulate: false },
        populate: {
          path: "ingredients.foodItem", // Field inside FoodRecipe to populate
          model: "FoodItem", // Explicitly specify the FoodItem model
          options: { strictPopulate: false },
        },
      })
      .populate({
        path: "client_id",
        select:
          "_id full_name email role diet_plan_status workout_plan_status subscription_status",
      })
      .populate({
        path: "coach_id",
        select: "_id image full_name email role U_ID",
      })
      .lean();
    if (!data) {
      throw "No Data found";
    }
    let totalNutrients = await calculateTotalNutrientsForPlan(data);
    let dietPlanById = {
      ...data,
      totalNutrients,
    };

    res.status(200).json(dietPlanById);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
exports.deletePlan = async function (req, res) {
  try {
    let client = req.user;

    const dietPlan = await DietPlan.findById(req.body.id);
    if (!dietPlan) {
      return res.status(404).json({ message: "Diet plan not found" });
    }

    // Delete the diet plan
    await DietPlan.findByIdAndDelete(req.body.id);
    res.status(200).json({ message: "Diet plan deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

function calculateTotalNutrients(dietPlans) {
  return dietPlans.map((plan) => ({
    ...plan, // Spread the original data of the plan
    totalNutrients: calculateTotalNutrientsForPlan(plan), // Add the calculated total nutrients
  }));
}

exports.getAllWorkoutExercises = async function (req, res) {
  try {
    let page = req.body.page;
    let limit = req.body.limit;
    const skip = (page - 1) * limit;
    const searchFilter = req.body.search
      ? { exercise_name: { $regex: req.body.search, $options: "i" } }
      : {};
    let data = await WorkoutExercise.find(searchFilter).skip(skip).limit(limit);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
exports.createWorkoutPlan = async function (req, res) {
  try {
    let coach = req.user;

    if (coach.role == Roles.coach) {
      req.body.coach_id = coach.id;
    } else if (coach.role == Roles.teamLead || coach.role == Roles.admin) {
      if (!req.body.coach_id) {
        throw "coach id is missing in payload";
      }
    }
    if (req.body.status == WorkoutPlanStatus.Saved) {
      req.body.status = WorkoutPlanStatus.Saved;
    } else if (req.body.status == WorkoutPlanStatus.Active) {
      req.body.status = WorkoutPlanStatus.Active;
    } else {
      res.status(401).json({ message: "Please Provide status" });
    }
    if (req.body.status === WorkoutPlanStatus.Active) {
      await WorkoutPlan.updateMany(
        { client_id: req.body.client_id, status: WorkoutPlanStatus.Active },
        { $set: { status: WorkoutPlanStatus.Saved } }
      );
      await User.updateOne(
        { _id: req.body.client_id },
        { $set: { workout_plan_status: Plan_Status.AllReady } }
      );
    }
    await WorkoutPlan.create(req.body);
    res.status(200).json({ message: "Workout plan created" });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
exports.editWorkoutPlan = async function (req, res) {
  try {
    let coach = req.user;
    const { id } = req.body;
    const updateData = req.body;
    if (req.body.status == WorkoutPlanStatus.Saved) {
      req.body.status = WorkoutPlanStatus.Saved;
    } else if (req.body.status == WorkoutPlanStatus.Active) {
      req.body.status = WorkoutPlanStatus.Active;
    } else {
      res.status(401).json({ message: "Please Provide status" });
    }
    if (req.body.status === WorkoutPlanStatus.Active) {
      await WorkoutPlan.updateMany(
        { client_id: req.body.client_id, status: WorkoutPlanStatus.Active },
        { $set: { status: WorkoutPlanStatus.Saved } }
      );
      await User.updateOne(
        { _id: req.body.client_id },
        { $set: { workout_plan_status: Plan_Status.AllReady } }
      );
    }
    const updatedWorkOutPlan = await WorkoutPlan.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true } // Return updated document and run schema validation
    );
    res
      .status(200)
      .json({ message: "Workout plan Edited", updatedWorkOutPlan });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
exports.getAllWorkoutplan = async function (req, res) {
  try {
    let coach = req.user;
    let page = req.body.page;
    let pageSize = req.body.limit;
    const skip = (page - 1) * pageSize;
    let query = {};
    if (coach.role == Roles.coach) {
      query = { coach_id: coach._id, client_id: req.body.client_id };
    } else if (coach.role == Roles.teamLead || coach.role == Roles.admin) {
      query = { client_id: req.body.client_id };
    }
    let data = await WorkoutPlan.find(query)
      .skip(skip)
      .limit(pageSize)
      .populate({
        path: "client_id",
        select:
          "_id full_name email role diet_plan_status workout_plan_status subscription_status",
      })
      .populate({
        path: "coach_id",
        select: "_id image full_name email role U_ID",
      })
      .lean();
    const TotalDocuments = await WorkoutPlan.countDocuments(query);
    return res.status(200).json({ data, TotalDocuments, page, pageSize });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
exports.getWorkoutplanById = async function (req, res) {
  try {
    let data = await WorkoutPlan.findOne({ _id: req.body.workoutPlanId })
      .populate({
        path: "client_id",
        select:
          "_id full_name email role diet_plan_status workout_plan_status subscription_status",
      })
      .populate({
        path: "coach_id",
        select: "_id image full_name email role U_ID",
      })
      .lean();
    if (!data) {
      throw "No Data found";
    }

    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
exports.deletePlanByid = async function (req, res) {
  try {
    let client = req.user;

    const workoutPlan = await WorkoutPlan.findById(req.body.id);
    if (!workoutPlan) {
      return res.status(404).json({ message: "Workout plan not found" });
    }

    // Delete the workout plan
    await WorkoutPlan.findByIdAndDelete(req.body.id);
    res.status(200).json({ message: "Workout plan deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.getAllPlansByCoach = async function (req, res) {
  try {
    let coach = req.user;
    let page = req.body.page;
    let pageSize = req.body.pageSize;
    const skip = (page - 1) * pageSize;
    let query = { coach_id: coach._id };

    if (req.body.filter == "") {
      if (req.body.search != "") {
        const matchingClients = await User.find({
          full_name: { $regex: req.body.search, $options: "i" }, // Case-insensitive search
        })
          .select("_id")
          .lean();

        // Extract client IDs
        const clientIds = matchingClients.map((client) => client._id);

        // Modify query to filter DietPlans and WorkoutPlans by client_id
        query.client_id = { $in: clientIds };
        // query= { coach_id: coach._id, full_name: { $regex: req.body.search, $options: "i" } }
      }
      const [dietPlans, workoutPlans] = await Promise.all([
        DietPlan.find(query)
          .populate({
            path: "client_id",
            select:
              "_id full_name email role diet_plan_status workout_plan_status subscription_status",
          })
          .populate({
            path: "coach_id",
            select: "_id image full_name email role U_ID",
          })
          .lean(),

        WorkoutPlan.find(query)
          .populate({
            path: "client_id",
            select:
              "_id full_name email role diet_plan_status workout_plan_status subscription_status",
          })
          .populate({
            path: "coach_id",
            select: "_id image full_name email role U_ID",
          })
          .lean(),
      ]);
      // Attach form data for each plan
      for (let plan of [...dietPlans, ...workoutPlans]) {
        let formData = await Form.findOne({
          client_id: plan.client_id._id,
        }).lean();
        plan.client_id.form = formData || {}; // Attach form data to client
      }

      // Merge both results
      const mergedData = [...dietPlans, ...workoutPlans];

      // Sort merged data by createdAt (latest first)
      mergedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const totalRecords = mergedData.length;

      // Apply pagination manually using slice
      const paginatedData = mergedData.slice(skip, skip + pageSize);
      // Send response
      return res.status(200).json({
        success: true,
        data: paginatedData,
        meta: {
          totalRecords,
          currentPage: page,
          pageSize,
          totalPages: Math.ceil(totalRecords / pageSize),
        },
      });
    } else if (req.body.filter == "Diet Plans") {
      if (req.body.search != "") {
        const matchingClients = await User.find({
          full_name: { $regex: req.body.search, $options: "i" }, // Case-insensitive search
        })
          .select("_id")
          .lean();

        // Extract client IDs
        const clientIds = matchingClients.map((client) => client._id);

        // Modify query to filter DietPlans and WorkoutPlans by client_id
        query.client_id = { $in: clientIds };
        // query= { coach_id: coach._id, full_name: { $regex: req.body.search, $options: "i" } }
      }
      const [mergedData] = await Promise.all([
        DietPlan.find(query)
          .populate({
            path: "client_id",
            select:
              "_id full_name email role diet_plan_status workout_plan_status subscription_status",
          })
          .populate({
            path: "coach_id",
            select: "_id image full_name email role U_ID",
          })
          .lean(),
      ]);
      // Attach form data for each plan
      for (let plan of [...mergedData]) {
        let formData = await Form.findOne({
          client_id: plan.client_id._id,
        }).lean();
        plan.client_id.form = formData || {}; // Attach form data to client
      }


      // Sort merged data by createdAt (latest first)
      mergedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const totalRecords = await DietPlan.countDocuments(query);
      // Apply pagination manually using slice
      // Send response
      return res.status(200).json({
        success: true,
        data: mergedData,
        meta: {
          totalRecords,
          currentPage: page,
          pageSize,
          totalPages: Math.ceil(totalRecords / pageSize),
        },
      });
    } else if (req.body.filter == "Workout Plans") {
      if (req.body.search != "") {
        const matchingClients = await User.find({
          full_name: { $regex: req.body.search, $options: "i" }, // Case-insensitive search
        })
          .select("_id")
          .lean();

        // Extract client IDs
        const clientIds = matchingClients.map((client) => client._id);

        // Modify query to filter DietPlans and WorkoutPlans by client_id
        query.client_id = { $in: clientIds };
        // query= { coach_id: coach._id, full_name: { $regex: req.body.search, $options: "i" } }
      }
      const [mergedData] = await Promise.all([
        WorkoutPlan.find(query)
          .populate({
            path: "client_id",
            select:
              "_id full_name email role diet_plan_status workout_plan_status subscription_status",
          })
          .populate({
            path: "coach_id",
            select: "_id image full_name email role U_ID",
          })
          .lean(),
      ]);
      // Attach form data for each plan
      for (let plan of [...mergedData]) {
        let formData = await Form.findOne({
          client_id: plan.client_id._id,
        }).lean();
        plan.client_id.form = formData || {}; // Attach form data to client
      }


      // Sort merged data by createdAt (latest first)
      mergedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const totalRecords = await WorkoutPlan.countDocuments(query);
      // Apply pagination manually using slice
      // Send response
      return res.status(200).json({
        success: true,
        data: mergedData,
        meta: {
          totalRecords,
          currentPage: page,
          pageSize,
          totalPages: Math.ceil(totalRecords / pageSize),
        },
      });
    }
    else
    {
      return res.status(400).json({msg:"Invalid filter"})
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};


exports.getAllDietPlansToImport = async function (req, res) {
  try {
    let coach = req.user;
    let page = req.body.page;
    let pageSize = req.body.pageSize;
    const skip = (page - 1) * pageSize;
    const searchFilter = req.body.search
      ? { name: { $regex: req.body.search, $options: "i" } }
      : {};
    let data = await DietPlan.find(searchFilter)
      .skip(skip)
      .limit(pageSize)
      .populate({
        path: "meals.items.referenceId",
        options: { strictPopulate: false },
        populate: {
          path: "ingredients.foodItem", // Field inside FoodRecipe to populate
          model: "FoodItem", // Explicitly specify the FoodItem model
          options: { strictPopulate: false },
        },
      })
      .populate({
        path: "coach_id",
        select: "_id image full_name email role U_ID",
      })
      .lean();
    const TotalDocuments = await DietPlan.countDocuments(searchFilter);
    let dietPlansWithNutrients = calculateTotalNutrients(data);

    // for (let plan of data) {
    //   let formData = await Form.findOne({
    //     client_id: plan.client_id._id,
    //   }).lean();
    //   plan.client_id.form = formData || {}; // Attach form data to client
    // }
    // let dietPlansWithNutrients = calculateTotalNutrients(data);
    // dietPlansWithNutrients.forEach((plan) => {
    //   plan.meals.forEach((meal) => {
    //     const totalNutrientsMeal = {
    //       TotalCalories: 0,
    //       TotalFat: 0,
    //       TotalProtein: 0,
    //       TotalCarbohydrates: 0,
    //     };

    //     meal.items.forEach((item) => {
    //       if (item.type === FoodCategory.FoodItem) {
    //         const nutrients = item.referenceId;
    //         totalNutrientsMeal.TotalCalories +=
    //           nutrients.calories * item.quantity || 0;
    //         totalNutrientsMeal.TotalFat += nutrients.fat * item.quantity || 0;
    //         totalNutrientsMeal.TotalProtein +=
    //           nutrients.protein * item.quantity || 0;
    //         totalNutrientsMeal.TotalCarbohydrates +=
    //           nutrients.carbohydrates * item.quantity || 0;
    //       } else if (item.type === FoodCategory.Recipe) {
    //         const totalRecipeNutrients = {
    //           TotalCalories: 0,
    //           TotalFat: 0,
    //           TotalProtein: 0,
    //           TotalCarbohydrates: 0,
    //         };
    //         item.referenceId.ingredients.forEach((ingredient) => {
    //           const foodItem = ingredient.foodItem;

    //           totalRecipeNutrients.TotalCalories +=
    //             foodItem.calories * ingredient.quantity * item.quantity || 0;
    //           totalRecipeNutrients.TotalFat +=
    //             foodItem.fat * ingredient.quantity * item.quantity || 0;
    //           totalRecipeNutrients.TotalProtein +=
    //             foodItem.protein * ingredient.quantity * item.quantity || 0;
    //           totalRecipeNutrients.TotalCarbohydrates +=
    //             foodItem.carbohydrates * ingredient.quantity * item.quantity ||
    //             0;
    //         });
    //         item.referenceId.totalRecipeNutrients = totalRecipeNutrients;
    //         totalNutrientsMeal.TotalCalories +=
    //           totalRecipeNutrients.TotalCalories;
    //         totalNutrientsMeal.TotalFat += totalRecipeNutrients.TotalFat;
    //         totalNutrientsMeal.TotalProtein +=
    //           totalRecipeNutrients.TotalProtein;
    //         totalNutrientsMeal.TotalCarbohydrates +=
    //           totalRecipeNutrients.TotalCarbohydrates;
    //       }
    //     });

    //     meal.totalMealNutrients = totalNutrientsMeal;
    //   });
    // });

    return res
      .status(200)
      .json({ dietPlansWithNutrients, TotalDocuments, page, pageSize });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.getAllWorkoutPlanToImport  = async function (req, res) {
  try {
    let coach = req.user;
    let page = req.body.page;
    let pageSize = req.body.pageSize;
    const skip = (page - 1) * pageSize;
    const searchFilter = req.body.search
    ? { name: { $regex: req.body.search, $options: "i" } }
    : {};
    let data = await WorkoutPlan.find(searchFilter)
      .skip(skip)
      .limit(pageSize)
      // .populate({
      //   path: "client_id",
      //   select:
      //     "_id full_name email role diet_plan_status workout_plan_status subscription_status",
      // })
      .populate({
        path: "coach_id",
        select: "_id image full_name email role U_ID",
      })
      .lean();
    const TotalDocuments = await WorkoutPlan.countDocuments(searchFilter);
    return res.status(200).json({ data, TotalDocuments, page, pageSize });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.importDietPlan = async function (req, res) {
  try {
    let coach = req.user;
    let data = await DietPlan.findOne({ _id: req.body.dietPlanID })
    if(!data) {
      throw "No Data found";
    } 
    let newDietPlan = {
      name:data.name,
      numberOfDays:data.numberOfDays,
      meals:data.meals,
      status: DietPlanStatus.Saved,
      _id: new mongoose.Types.ObjectId(),
      client_id: req.body.client_id,
      coach_id: coach._id,
      coach_notes:data.coach_notes,
    };
    await DietPlan.create(newDietPlan);


    return res
      .status(200)
      .json({ msg: 'Imported successfully' });

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.importWorkoutPlan = async function (req, res) {
  try {
    let coach = req.user;
    let data = await WorkoutPlan.findOne({ _id: req.body.workoutPlanID })
    if(!data) {
      throw "No Data found";
    }
    let newWorkoutPlan = {
      name:data.name,
      numberOfweeks:data.numberOfweeks,
      exercises:data.exercises,
      status: WorkoutPlanStatus.Saved,
      _id: new mongoose.Types.ObjectId(),
      client_id: req.body.client_id,
      coach_id: coach._id,
      coach_notes:data.coach_notes,
    };
    await WorkoutPlan.create(newWorkoutPlan);
   

    return res
      .status(200)
      .json({ msg: 'Imported successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};