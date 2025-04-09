const { SupportTicket } = require("../../models/supportTicket_model");
const { SupportTicketChat } = require("../../models/supportTicketChat_model");
const { User } = require("../../models/client_model");
const { Form } = require("../../models/form_model");
const { Coach } = require("../../models/coach_model");
const { Roles } = require("../../Helpers/constants");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const mongoose = require("mongoose");

exports.login = async function (req, res) {
  try {
    let data = await Coach.findOne({
      email: req.body.email,
      role: { $in: [Roles.customerSupport] },
    });
    if (!data) {
      throw "No email found";
    }
    // if(!data.email_verified)
    // {
    //   throw "email not verified"
    // }
    if (!bcrypt.compareSync(req.body.password, data.passwordHash)) {
      throw "Invalid Password";
    }
    const secret = process.env.jwtSecret;
    const token = JWT.sign(
      {
        id: data._id,
      },
      secret,
      { expiresIn: "3650d" }
    );

    //login work
    await Coach.updateOne({ _id: data._id }, { isLogin: true });
    return res.status(200).json({ token: token });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
exports.GetAllTickets = async function (req, res) {
  try {
    let { type, page = 1, pageSize = 10 } = req.body; // Default page = 1, pageSize = 10
    let query = {};

    if (type && type !== "All") {
      const validStatuses = ["Pending", "Processing", "Resolved"];
      if (!validStatuses.includes(type)) {
        return res.status(400).json({ message: "Invalid Filter type" });
      }
      query.status = type;
    }

    // Convert page and pageSize to numbers
    page = parseInt(page);
    pageSize = parseInt(pageSize);

    // Get total count for pagination metadata
    const totalTickets = await SupportTicket.countDocuments(query);

    // Fetch tickets with pagination and populate client_id with only 'fullName' & 'image'
    let data = await SupportTicket.find(query)
      .populate("client_id", "full_name image") // Selective population
      .skip((page - 1) * pageSize) // Skipping previous pages
      .limit(pageSize) // Limiting results per page
      .sort({ createdAt: -1 }); // Sorting by latest created

    return res.status(200).json({
      totalTickets,
      page,
      pageSize,
      totalPages: Math.ceil(totalTickets / pageSize),
      data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};
exports.UpdateTicketStatus = async function (req, res) {
  try {
    const { _id, status } = req.body;

    // Validate input
    if (!_id || !status) {
      return res
        .status(400)
        .json({ message: "Ticket _id and status are required" });
    }

    const validStatuses = ["Pending", "Processing", "Resolved"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Find and update the ticket
    const updatedTicket = await SupportTicket.findByIdAndUpdate(
      _id,
      { status },
      { new: true } // Return updated document
    ).populate("client_id", "full_name image"); // Populate client details

    if (!updatedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    return res.status(200).json({
      message: "Ticket status updated successfully",
      updatedTicket,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};
exports.chatOnTicket = async function (req, res) {
  try {
    req.body.Support_id = req.user._id;
    await SupportTicketChat.create(req.body);
    return res.status(200).json({ message: "Response submitted" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err });
  }
};
exports.GetChatByTicketId = async function (req, res) {
  try {
    let { page = 1, pageSize = 10 } = req.body;
    page = parseInt(page);
    pageSize = parseInt(pageSize);
    let data = await SupportTicketChat.find({
      supportTicket_id: req.body.ticket_id,
    })
      .populate("client_id", "full_name image") // Selective population
      .populate("Support_id", "full_name image") // Selective population
      .skip((page - 1) * pageSize) // Skipping previous pages
      .limit(pageSize) // Limiting results per page
      .sort({ createdAt: -1 });

    let clientData = await User.findOne({ _id: req.body.client_id })
      .select(
        "image full_name diet_plan_status workout_plan_status subsctiption_status"
      )
      .populate({ path: "coach_id", select: "_id image full_name email role U_ID" })
      .populate({
        path: "workoutCoach_id",
        select: "_id image full_name email role U_ID",
      })
      // .exec()
      .lean()
    

    // Fetch all forms in a single query
    const forms = await Form.find({ client_id:clientData._id}).exec();

    // Create a map of form data by client_id for quick access
    // const formsMap = forms.reduce((acc, form) => {
    //   acc[form.client_id.toString()] = form;
    //   return acc;
    // }, {});

   let responseData = {
    ...clientData,
    forms
   }
    return res.status(200).json({data,responseData});
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err });
  }
};
