const { Chat } = require("../../models/chat_model");
const { Message } = require("../../models/message_model");
const { Roles } = require("../../Helpers/constants");
// const JWT = require("jsonwebtoken");
const mongoose = require("mongoose");

exports.getInboxChatRooms = async function (req, res) {
  try {
    const user = req.user;
    let query ={}
    if (user.role == Roles.coach) {
        query ={coach_id:user.id}
    }
    else if (user.role == Roles.client)
    {
        query ={client_id:user.id}

    }
    else
    {
        throw " Not authorized "
    }
    let chatdata = await Chat.find(query).populate("client_id", "image coach_id diet_plan_status email full_name role  subsctiption_status workoutCoach_id workout_plan_status  _id").populate("coach_id" , "image U_ID bio email full_name role status _id")
    return res.status(200).json(chatdata);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.getInboxChatByRoomId = async function (req, res) {
  try {
    const user = req.user;
    const { chatRoomId, page = 1, limit = 20 } = req.body;
    let query ={chat : chatRoomId}
    
    let roomChatData = await Message.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit));
    return res.status(200).json(roomChatData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};