
var mongoose = require('mongoose');
const {DietApp} = require('../utility/connection');

var ChatSchema = new mongoose.Schema({
    client_id:{ type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    coach_id:{ type: mongoose.Schema.Types.ObjectId, ref: "Coach" },
    createdAt: { type: Date, default: Date.now },
    lastMessage: {
        image: { type: String },
        text: { type: String },
        createdAt: { type: Date },
      },
},
{ timestamps: true });

const Chat = DietApp.model('Chat', ChatSchema);
module.exports = {
    Chat
};
