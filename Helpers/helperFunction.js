const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { Subscription } = require("../models/subscription_model");
const { User } = require("../models/client_model");
const {Plan_Status,Subscription_Status} = require("../Helpers/constants")


function otp_code() {
  return new Promise(async (resolve) => {
    var result = "";
    var characters = "0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    resolve(result);
  });
}
function generateTicketId() {
  return new Promise(async (resolve) => {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    resolve(result);
  });
}
function hash(password) {
  return bcrypt.hashSync(password, 10);
}

function calculateTotalNutrientsForPlan(plan) {
  try {
    return plan.meals.reduce(
      (totals, meal) => {
        meal.items.forEach((item) => {
          if (item.type === "FoodItem" && item.referenceId) {
            // Sum nutrients for FoodItem
            totals.TotalCalories +=
              item.referenceId.calories * item.quantity || 0;
            totals.TotalFat += item.referenceId.fat * item.quantity || 0;
            totals.TotalProtein +=
              item.referenceId.protein * item.quantity || 0;
            totals.TotalCarbohydrates +=
              item.referenceId.carbohydrates * item.quantity || 0;
          }

          if (item.type === "FoodRecipe" && item.referenceId) {
            // Sum nutrients for FoodRecipe ingredients
            item.referenceId.ingredients.forEach((ingredient) => {
              if (ingredient.foodItem) {
                totals.TotalCalories +=
                  ingredient.foodItem.calories *
                    ingredient.quantity *
                    item.quantity || 0;
                totals.TotalFat +=
                  ingredient.foodItem.fat *
                    ingredient.quantity *
                    item.quantity || 0;
                totals.TotalProtein +=
                  ingredient.foodItem.protein *
                    ingredient.quantity *
                    item.quantity || 0;
                totals.TotalCarbohydrates +=
                  ingredient.foodItem.carbohydrates *
                    ingredient.quantity *
                    item.quantity || 0;
              }
            });
          }
        });

        return totals;
      },
      {
        TotalCalories: 0,
        TotalFat: 0,
        TotalProtein: 0,
        TotalCarbohydrates: 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
}

async function subscribSuccess(session, subscription) {
  try {
    const userId = session.metadata?.userId;
    let userData = await User.findOne({ _id: userId });

    if (!userData) {
      return;
    }
    let subscriptionData = await Subscription.findOne({
      user_id: userId,
      currentPeriodEnd: { $gte: new Date() },
    });
    if (!subscriptionData) {
      let subscriptionName = "";
      if (subscription.plan.id == process.env.STARTER_SUBSCRIPTION_PRICE_ID) {
        subscriptionName = "Starter"
      }
      if (subscription.plan.id == process.env.PRO_SUBSCRIPTION_PRICE_ID) {
        subscriptionName = "Pro"

      }
      if (subscription.plan.id == process.env.VIP_SUBSCRIPTION_PRICE_ID) {
        subscriptionName = "Vip"

      }
      const sessionId = session.id;
      const customerId = session.customer;
      const invoice = session.invoice;
      const paymentStatus = session.payment_status;
      const subscriptionId = session.subscription;
      const createdAt = new Date(session.created * 1000);
      const currentPeriodEnd = new Date(subscription.current_period_end * 1000);
      const currentPeriodStart = new Date(
        subscription.current_period_start * 1000
      );

      await Subscription.create({
        user_id: userId,
        sessionId: sessionId,
        customerId: customerId,
        invoice: invoice,
        paymentStatus: paymentStatus,
        subscriptionId: subscriptionId,
        createdAt: createdAt,
        currentPeriodEnd: currentPeriodEnd,
        currentPeriodStart: currentPeriodStart,
        subscriptionName:subscriptionName
      });
      await User.updateOne({_id:userId},{$set:{subscription_status:Subscription_Status.Active}})
    }
  } catch (error) {
    throw error;
  }
}
async function subscribe(subscription, userId, subscriptionId) {
  try {
    let userData = await User.findOne({ _id: userId });

    if (!userData) {
      return;
    }
    let subscriptionData = await Subscription.findOne({
      user_id: userId,
      subscriptionId: subscriptionId,
    });
    if (subscriptionData) {
      const currentPeriodStart = new Date(
        subscription.current_period_start * 1000
      ); // Convert Unix timestamp to Date
      const currentPeriodEnd = new Date(subscription.current_period_end * 1000); // Convert Unix timestamp to Date

      // Update the subscription in your database
      subscriptionData.status = subscription.status; // For example, active or past_due
      // subscriptionData.lastPaymentAmount = amountPaid;
      // subscriptionData.lastPaymentDate = new Date(); // Store the date of payment
      subscriptionData.currentPeriodStart = currentPeriodStart;
      subscriptionData.currentPeriodEnd = currentPeriodEnd;
      // subscriptionData.nextBillingDate = currentPeriodEnd;

      // Save the updated subscription data to the database
      await subscriptionData.save();
    }
  } catch (error) {
    throw error;
  }
}
module.exports = {
  otp_code,
  hash,
  calculateTotalNutrientsForPlan,
  generateTicketId,
  subscribe,
  subscribSuccess,
};
