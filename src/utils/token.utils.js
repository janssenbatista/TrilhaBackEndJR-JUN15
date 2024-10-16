import { UNAUTHORIZED } from "../constants/httpStatusCode.js";
import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

export const verifyToken = (token, req, res, next) => {
  try {
    jwt.verify(token, process.env.JWT_SECRET, (error, data) => {
      if (error) {
        return res.status(UNAUTHORIZED).json({ message: "Invalid token" });
      }
      req.userId = data.userId;
      next();
    });
  } catch (error) {
    return res.status(UNAUTHORIZED).json({ message: "Invalid token" });
  }
};
