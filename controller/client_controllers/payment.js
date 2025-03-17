const { User } = require('../../models/client_model')
const jwt = require("jsonwebtoken")
const { Roles, Form_Types, Form_Status, Plan_Status, Subscription_Status, DietPlanStatus, FoodCategory, WorkoutPlanStatus } = require("../../Helpers/constants")
const stripe = require("stripe")(process.env.STRIPE_SECRETE_KEY)

exports.checkout_session = async function (req, res) {
    try {
          const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            line_items: [
              {
                price: process.env.STARTER_SUBSCRIPTION_PRICE_ID,
                // For metered billing, do not pass quantity
                quantity: 1,
        
              },
            ],
            success_url: `http://localhost:3000/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:3000/cancel.html`,
          });
          console.log( session.url)
          res.redirect(303, session.url);
    }
    catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  }

exports.success_session = async function (req, res) {
    try {
      const session = await stripe.checkout.sessions.retrieve(req.query.session_id)
      console.log(session)
      res.send('Subscribe successfully')
      
    }
    catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  }

  // exports.cancle_session = async function (req, res) {
  //   try {
        
  //   }
  //   catch (err) {
  //     console.log(err)
  //     res.status(500).json(err)
  //   }
  // }