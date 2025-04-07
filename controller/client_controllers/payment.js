const { User } = require("../../models/client_model");
const jwt = require("jsonwebtoken");
const {
  Roles,
  Form_Types,
  Form_Status,
  Plan_Status,
  Subscription_Status,
  DietPlanStatus,
  FoodCategory,
  WorkoutPlanStatus,
} = require("../../Helpers/constants");
const {subscribe,subscribSuccess} = require("../../Helpers/helperFunction")
const stripe = require("stripe")(process.env.STRIPE_SECRETE_KEY);

exports.checkout_session = async function (req, res) {
  try {
    // const testClock = await stripe.testHelpers.testClocks.create({
    //   frozen_time: Math.floor(Date.now() / 1000), // Current time as a Unix timestamp
    // });
    // const customer = await stripe.customers.update('cus_S5NavcrOpSch7h', {
    //   test_clock: 'clock_1RBD3PDFsVLBaSFfayDWx4Mm', // The ID of the test clock created in Step 1
    // });

    // const subscription = await stripe.subscriptions.create({
    //   customer: 'cus_S5NavcrOpSch7h',  // Your existing customer ID
    //   items: [{ price: 'price_ABC123' }],
    //   test_clock: 'clock_1RBD3PDFsVLBaSFfayDWx4Mm',  // Link the subscription to the test clock
    //   payment_behavior: 'default_incomplete', // This can be adjusted based on your needs
    //   expand: ['latest_invoice.payment_intent'],
    // });
    // console.log("Test Subscription created",subscription)
    // lll
    let user = req.user;
    let pakage = req.query.plan;
    let Price_id;
    if (pakage == "Starter") {
      Price_id = process.env.STARTER_SUBSCRIPTION_PRICE_ID;
    } else if (pakage == "Pro") {
      Price_id = process.env.PRO_SUBSCRIPTION_PRICE_ID;
    } else if (pakage == "Vip") {
      Price_id = process.env.VIP_SUBSCRIPTION_PRICE_ID;
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
      success_url: `https://dev-api.dietncheat.ca/client/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://dev-api.dietncheat.ca/client/cancel.html`,
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
    const subscription = await stripe.subscriptions.retrieve(
      subscriptionId
    );
    await subscribSuccess(session,subscription)

    res.send("Subscribe successfully");
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
        process.env.STRIPE_WEBHOOK_KEY
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
        await subscribe (subscription,userId,subscriptionId)
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
