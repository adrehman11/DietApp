const bcrypt = require('bcryptjs');
const crypto = require("crypto");

function otp_code() {
    return new Promise(async (resolve) => {
        var result = '';
        var characters = '0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        resolve(result);
    })
}
function hash(password) {
    return bcrypt.hashSync(password, 10);
}

function calculateTotalNutrientsForPlan(plan) {
    try
    {
        return plan.meals.reduce((totals, meal) => {
            meal.items.forEach(item => {
                if (item.type === "FoodItem" && item.referenceId) {
                    // Sum nutrients for FoodItem
                    totals.TotalCalories += item.referenceId.calories * item.quantity || 0;
                    totals.TotalFat += item.referenceId.fat * item.quantity || 0;
                    totals.TotalProtein += item.referenceId.protein * item.quantity || 0;
                    totals.TotalCarbohydrates += item.referenceId.carbohydrates * item.quantity || 0;
                }
    
                if (item.type === "FoodRecipe" && item.referenceId) {
                    // Sum nutrients for FoodRecipe ingredients
                    item.referenceId.ingredients.forEach(ingredient => {
                        if (ingredient.foodItem) {
                            totals.TotalCalories += (ingredient.foodItem.calories * ingredient.quantity * item.quantity) || 0;
                            totals.TotalFat += (ingredient.foodItem.fat * ingredient.quantity * item.quantity) || 0;
                            totals.TotalProtein += (ingredient.foodItem.protein * ingredient.quantity * item.quantity) || 0;
                            totals.TotalCarbohydrates += (ingredient.foodItem.carbohydrates * ingredient.quantity * item.quantity) || 0;
                        }
                    });
                }
            });
    
            return totals;
        }, {
            TotalCalories: 0,
            TotalFat: 0,
            TotalProtein: 0,
            TotalCarbohydrates: 0
        });
    }
    catch(error)
    {
        console.log(error)
    }
}
module.exports = {
    otp_code,
    hash,
    calculateTotalNutrientsForPlan
}