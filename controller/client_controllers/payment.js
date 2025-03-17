const { User } = require('../../models/client_model')
const jwt = require("jsonwebtoken")
const { Roles, Form_Types, Form_Status, Plan_Status, Subscription_Status, DietPlanStatus, FoodCategory, WorkoutPlanStatus } = require("../../Helpers/constants")
const stripe = require("stripe")(process.env.STRIPE_SECRETE_KEY)

exports.checkout_session = async function (req, res) {
    try {
        const prices = await stripe.prices.list({
            lookup_keys: [req.body.lookup_key],
            expand: ['data.product'],
          });
          const session = await stripe.checkout.sessions.create({
            billing_address_collection: 'auto',
            line_items: [
              {
                price: prices.data[0].id,
                // For metered billing, do not pass quantity
                quantity: 1,
        
              },
            ],
            mode: 'subscription',
            success_url: `${YOUR_DOMAIN}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${YOUR_DOMAIN}/cancel.html`,
          });
        
          res.redirect(303, session.url);
    }
    catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  }