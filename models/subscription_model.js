
var mongoose = require('mongoose');
const {Plan_Status} = require("../Helpers/constants")
const {DietApp} = require('../utility/connection');
var SubscriptionSchema = new mongoose.Schema({
    createdAt: { type: Date, required: true },
    subscriptionName:{ type: String, required: true },
    currentPeriodStart: { type: Date, required: true },
    currentPeriodEnd: { type: Date, required: true },
    user_id : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    plan:{type:String},
    sessionId:{type:String},
    customerId:{type:String},
    invoice:{type:String},
    paymentStatus:{type:String},
    subscriptionId:{type:String},
    subscription_status:{type:String},
    freezDuaration:{type:Number},
    paymentIntentId:{type:String},
},
{ timestamps: true });

const Subscription = DietApp.model('Subscription', SubscriptionSchema);
module.exports = {
    Subscription
};
