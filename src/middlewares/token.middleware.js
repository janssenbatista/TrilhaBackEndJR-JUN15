import { verifyToken } from "../utils/token.utils.js";
import { UNAUTHORIZED } from "../constants/httpStatusCode.js";

export const tokenMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(UNAUTHORIZED)
      .json({ message: "Missing authorization header" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(UNAUTHORIZED).json({ message: "Missing token" });
  }
  verifyToken(token, req, res, next);
};
