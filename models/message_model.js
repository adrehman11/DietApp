const mongoose = require("mongoose");
const { DietApp } = require('../utility/connection'); 

const MessageSchema = new mongoose.Schema({
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true }, // The chat this message belongs to
    sender: { type: mongoose.Schema.Types.ObjectId, required: true }, // Sender ID (Client or Coach)
    senderType: { type: String, enum: ["User", "Coach"], required: true }, // Identify sender type
    text: { type: String}, // Message content
    image: { type: String }, // Message content
    createdAt: { type: Date, default: Date.now }, // Timestamp for sorting messages
    isread: { type: Boolean, default: false }, // Read status
}, { timestamps: true });

const Message = DietApp.model("Message", MessageSchema);

module.exports = { Message };