
const Roles = {
   client:"Client",
   coach:"Coach",
   admin:"Admin"
}


Object.freeze(Roles);

const Form_Types = {
   General:"General",
   Workout:"Workout",
   Diet:"Diet"
}
 
Object.freeze(Form_Types);

const Form_Status = {
   Initial:"Initial",
}
 
Object.freeze(Form_Status);

const Plan_Status = {
   AllReady:"All Ready",
   FirstPlanNeeded:"First Plan Needed",
   UpdateNeeded:"Update Needed"
}
 
Object.freeze(Plan_Status);

const Subscription_Status = {
   Active:"Active",
   Expired:"Expired",
   NotStarted:"Not Started",
   Freezed:"Freezed",

}
 
Object.freeze(Subscription_Status);

const FoodMeals = {
   Breakfast:"Breakfast",
   Lunch:"Lunch",
   Dinner:"Dinner",
   Snack:"Snack",
   Pre_Workout:"Pre-Workout",
   Post_Workout:"Post-Workout"

}
 
Object.freeze(FoodMeals);

const FoodCategory = {
   FoodItem:"FoodItem",
   Recipe:"FoodRecipe",
   Supplement:"Supplement",
}
 
Object.freeze(FoodCategory);

const DietPlanStatus = {
   Saved:"Saved",
   Active:"Active",
   Expired:"Expired",
}
 
Object.freeze(DietPlanStatus);

const WorkoutPlanStatus = {
   Saved:"Saved",
   Active:"Active",
   Expired:"Expired",
}
 
Object.freeze(WorkoutPlanStatus);

const ScheduleCheckInType = {
   Diet:"Diet",
   Workout:"Workout",
}
 
Object.freeze(ScheduleCheckInType);


 module.exports = {
    Roles,
    Form_Types,
    Form_Status,
    Plan_Status,
    Subscription_Status,
    FoodMeals,
    FoodCategory,
    DietPlanStatus,
    WorkoutPlanStatus,
    ScheduleCheckInType
 }