
var mongoose = require('mongoose');
const {DietApp} = require('../utility/connection');
var SupportTicketChatSchema = new mongoose.Schema({
    supportTicket_id: { type: mongoose.Schema.Types.ObjectId, ref: 'SupportTicket' },
    client_id:{type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
    Support_id:{type: mongoose.Schema.Types.ObjectId, ref: 'Coach'},
    message :{type:String},
    image:{type:String},
    
},
{ timestamps: true });

const SupportTicketChat = DietApp.model('SupportTicketChat', SupportTicketChatSchema);
module.exports = {
    SupportTicketChat
};
