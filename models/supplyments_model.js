
var mongoose = require('mongoose');
const {DietApp} = require('../utility/connection');
var SupplymentsSchema = new mongoose.Schema({
    name: {type: String,default :null},
},
{ timestamps: true });

const Supplyment = DietApp.model('Supplyment', SupplymentsSchema);
module.exports = {
    Supplyment
};
