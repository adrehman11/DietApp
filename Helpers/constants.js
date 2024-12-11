
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



 module.exports = {
    Roles,
    Form_Types,
    Form_Status
 }