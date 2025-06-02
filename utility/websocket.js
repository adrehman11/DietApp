// const { Sequelize, sequelize, Raffles, RafflesCategory, RafflesTicket, User, Role, BoltHistory, TicketHistory } = require('../models/db');
// const Op = Sequelize.Op;
var mongoose = require("mongoose");
const { User } = require("../models/client_model");
const { Coach } = require("../models/coach_model");
const { Chat } = require("../models/chat_model");
const { Message } = require("../models/message_model");
const socketAuth = require("socketio-auth");
const JWT = require("jsonwebtoken");
const { Roles } = require("../Helpers/constants");

let onlineUsers = new Map();
let ioInstance;
module.exports.socketsConnection = async (server) => {
  try {
    // let onlineUsers = new Map();
    const io = require("socket.io")(server, {
      cors: {
        origin: "*",
      },
      transports: ["websocket", "polling"],
    });
    ioInstance = io;
    socketAuth(io, {
      authenticate: async (socket, data, callback) => {
        try {
          const { token } = data;
          let result = await verifyJwt(token);
          socket.user = result.user;
          return callback(null, true);
        } catch (ex) {
          return callback({ message: "UnAuthorized" });
        }
      },
      postAuthenticate: async (socket) => {
        console.log("PostAuthentication");
        onlineUsers.set(socket.user.id.toString(), socket.id);
        // const userId = socket.user.id;
        // const userRole = socket.user.role;
        // let chats = await getChatsForUser(userId,userRole);
        // // io.emit("inboxChats", chats);
        // io.to(socket.id).emit("inboxChats", chats);
        // socket.conn.on("packet", async (packet) => {
        //     if (socket.auth && packet.type === "pong") {
        //         let userobj = {
        //             userId: socket.user.id,
        //             socketId: socket.id
        //         }
        //         socketuserData.push(userobj)
        //     }
        // });
      },
      disconnect: async (socket) => {
        console.log("disconecting socket.user:::::", socket.id);
        if (socket.user) {
          onlineUsers.delete(socket.user.id.toString());
        }
        // console.log(socket)
      },
      timeout: 2000,
    });
    io.on("connection", (socket) => {
        console.log("=========>a user connected");
        socket.on("sendMessage", async function (data) { // Make the callback async
          try {
            let chatDetails = await validateUsers(socket, data); // Await the result
      
            if (chatDetails.error) {
              console.log("Invalid RecieverID");
              socket.emit("messageError", { msg: "Invalid RecieverID" });
              return; // Important: Stop further execution
            } else {
              const newMessage = await Message.create({
                chat: chatDetails._id,
                sender: socket.user.id,
                senderType:
                  socket.user.role === Roles.client ? "User" : socket.user.role,
                text: data.message,
                image:data.image || ""
              });
      
              io.to(socket.id).emit("messageSent", newMessage);
              if (onlineUsers.has(data.recieverId.toString())) {
                const receiverSocketId = onlineUsers.get(
                  data.recieverId.toString()
                );
                io.to(receiverSocketId).emit("Notification", {
                  message: `Your have a new chat message`,
                  timestamp: new Date(),
                });
                io.to(receiverSocketId).emit("newMessage", newMessage);
              }
            }
          } catch (error) {
            console.error("Error in sendMessage:", error);
            socket.emit("messageError", { msg: "Internal server error" }); //Handle unexpected errors
          }
        });
        socket.on("check", async function () {
          try {
            console.log(onlineUsers)
            console.log(socket.user.id);
          } catch (error) {
            console.error("Error in getInboxChatRooms:", error);
            socket.emit("messageError", { msg: "Internal server error" });
          }
        }
        );
      });
    return io;
  
  } catch (err) {
    console.log(err);
  }
};
async function validateUsers(socket, data) {
  let chatData;

  if (socket.user.role === Roles.client) {
    // Client sending message to Coach
    let coachData = await Coach.findById(data.recieverId);
    if (!coachData) {
      return { msg: "Invalid RecieverID", error: true };
    }

    // Find or create chat
    chatData = await Chat.findOneAndUpdate(
      { client_id: socket.user.id, coach_id: data.recieverId },
      {},
      { upsert: true, new: true }
    );
  } else {
    // Coach sending message to Client
    let clientData = await User.findById(data.recieverId);
    if (!clientData) {
      return { msg: "Invalid RecieverID", error: true };
    }

    // Find or create chat
    chatData = await Chat.findOneAndUpdate(
      { client_id: data.recieverId, coach_id: socket.user.id },
      {},
      { upsert: true, new: true }
    );
  }

  return chatData; // Always return chat (new or existing)
}

async function verifyJwt(token) {
  try {
    let secret;
    secret = process.env.jwtSecret;
    var decoded = JWT.verify(token, secret);
    let user = await User.findOne({ _id: decoded.id });
    if (!user) {
      user = await Coach.findOne({ _id: decoded.id });
      if (!user) {
        return { bool: false };
      } else {
        return { bool: true, user };
      }
    } else {
      return { bool: true, user };
    }
  } catch (err) {
    throw err;
  }
}

module.exports.io = () => ioInstance;
module.exports.onlineUsers = () => onlineUsers;