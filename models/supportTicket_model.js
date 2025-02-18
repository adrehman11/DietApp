
var mongoose = require('mongoose');
const {DietApp} = require('../utility/connection');
var SupportTicketSchema = new mongoose.Schema({
    name: { type:String , required:true },
    email: { type:String , required:true},
    department:{type:String , required:true},
    image:{type:String },
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    status: { type:String , required:true  },
    TicketId: {type:String , required:true }
    
},
{ timestamps: true });

const SupportTicket = DietApp.model('SupportTicket', SupportTicketSchema);
module.exports = {
    SupportTicket
};
