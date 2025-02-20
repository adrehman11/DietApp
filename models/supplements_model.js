
var mongoose = require('mongoose');
const {DietApp} = require('../utility/connection');
var SupplementSchema = new mongoose.Schema({
    name: {type: String,default :null},
},
{ timestamps: true });

const Supplement = DietApp.model('Supplement', SupplementSchema);
module.exports = {
    Supplement
};
