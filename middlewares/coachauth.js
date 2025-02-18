const JWT = require("jsonwebtoken");
const { Coach } = require("../models/coach_model");
const { Roles } = require("../Helpers/constants");

function authorization(allowedRoles = []) {
  return async (req, res, next) => {
    try {
      let token = req.headers["authorization"];
      if (!token) {
        return res.status(401).json({ msg: "No Token", logoutStatus: true });
      }

      token = token.split(" ")[1];
      let secret = process.env.jwtSecret;
      var decoded = JWT.verify(token, secret);

      let user = await Coach.findOne({
        _id: decoded.id,
        role: { $in: [Roles.coach, Roles.teamLead, Roles.admin, Roles.staff, Roles.customerSupport] },
        isLogin: true
      });

      if (!user) {
        return res.status(401).json({
          msg: "Unauthorized. Please login again",
          logoutStatus: true,
        });
      }

      // Check if user role is in the allowedRoles array
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          msg: "Access Denied. You do not have permission.",
          logoutStatus: false,
        });
      }

      req.token = decoded;
      req.user = user;
      req.accessToken = token;
      next();
    } catch (exception) {
      if (exception.name === "TokenExpiredError") {
        return res.status(401).json({
          isTokenExpire: true,
          msg: "Session token has expired!",
          logoutStatus: true,
        });
      }
      return res.status(401).json({
        isTokenExpire: false,
        msg: exception.message,
        logoutStatus: true,
      });
    }
  };
}

module.exports = authorization;
