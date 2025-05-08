const { User } = require("../../models/client_model");
const jwt = require("jsonwebtoken");
// const {
//   Roles,
//   Form_Types,
//   Form_Status,
//   Plan_Status,
//   Subscription_Status,
//   DietPlanStatus,
//   FoodCategory,
//   WorkoutPlanStatus,
// } = require("../../Helpers/constants");
const { subscribe, subscribSuccess } = require("../../Helpers/helperFunction");
const { Subscription } = require("../../models/subscription_model");
const { Subscription_Status } = require("../../Helpers/constants");
const stripe = require("stripe")(process.env.STRIPE_SECRETE_KEY);

exports.checkout_session = async function (req, res) {
  try {
    let user = req.user;
    let pakage = req.query.plan;
    let Price_id;
    if (pakage == "Standard") {
      Price_id = process.env.STANDARD_SUBSCRIPTION_PRICE_ID;
    } else if (pakage == "Premium") {
      Price_id = process.env.PREMIUM_SUBSCRIPTION_PRICE_ID;
    } else {
      return res.status(400).json({ msg: "Invalid Pakage type" });
    }
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: Price_id,
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id, // Attach your user's DB _id
      },
      // success_url: `http://localhost:3000/client/success?session_id={CHECKOUT_SESSION_ID}`,
      success_url: `https://dev-api.dietncheat.ca/client/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://dev-buy.dietncheat.ca/`,
    });
    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.success_session = async function (req, res) {
  try {
    const session = await stripe.checkout.sessions.retrieve(
      req.query.session_id
    );
    const subscriptionId = session.subscription;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const invoiceId = subscription.latest_invoice;
    const invoice = await stripe.invoices.retrieve(invoiceId);

    const paymentIntentId = invoice.payment_intent;
 
    await subscribSuccess(session, subscription,paymentIntentId);

    res.redirect("https://buy.dietncheat.ca/paymentsuccess");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.webhook = async function (req, res) {
  try {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_SECRETE_KEY
      );
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;

        if (session.mode === "subscription") {
          const subscriptionId = session.subscription;
          const userId = session.metadata?.userId; // Get userId from session metadata
          // console.log("subscription",session)
          if (subscriptionId && userId) {
            // ✅ Attach metadata to the subscription
            await stripe.subscriptions.update(subscriptionId, {
              metadata: { userId },
            });

            console.log(
              ` Added userId ${userId} to subscription ${subscriptionId}`
            );
          } else {
            console.log(
              " Missing subscriptionId or userId in checkout session."
            );
          }
        }
        break;
      case "invoice.payment_succeeded":
        // console.log(event.data);
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;
        if (!subscriptionId) {
          console.warn("⚠️ No subscription ID found in invoice.");
          return res.sendStatus(400);
        }

        // Retrieve the subscription details from Stripe
        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId
        );
        if (!subscription) {
          // console.warn(`⚠️ No subscription found for ID: ${subscriptionId}`);
          return res.sendStatus(400);
        }

        const userId = subscription.metadata?.userId; // Retrieve user ID from metadata
        await subscribe(subscription, userId, subscriptionId);
      default:
      // console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 res to acknowledge receipt of the event
    res.send();
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
// exports.cancle_session = async function (req, res) {
//   try {

//   }
//   catch (err) {
//     console.log(err)
//     res.status(500).json(err)
//   }
// }
exports.refundSales = async function (req, res) {
  try{
    let clientSub = await Subscription.findOne({user_id:req.body.client_id})
    if(!clientSub){
      return res.status(400).json({msg:"No Subscription Found"})
    }
    const refund = await stripe.refunds.create({
      payment_intent: clientSub.paymentIntentId,
      reason: 'requested_by_customer',
    });
    if(!refund){
      return res.status(400).json({msg:"Refund Failed"})
    }
    if(refund.status == "succeeded"){
      await Subscription.updateOne({user_id:req.body.client_id},{$set:{paymentStatus:Subscription_Status.ReFunded}})
      await User.updateOne({_id:req.body.client_id},{$set:{subscription_status:Subscription_Status.ReFunded}})
      return res.status(200).json({msg:"Refunded Successfully"})
    }
    else
    {
      return res.status(400).json({msg:"Something went wrong"})

    }
  }
  catch(err)
  {
    console.log(err);
    return res.status(500).json(err);
  }
}
