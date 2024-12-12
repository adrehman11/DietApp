
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

 module.exports = {
    Roles,
    Form_Types,
    Form_Status,
    Plan_Status,
    Subscription_Status
 }