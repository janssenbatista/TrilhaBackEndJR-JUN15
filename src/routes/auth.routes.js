import { Router } from "express";
import authController from "../controllers/auth.controller.js";

const authRoutes = Router();

authRoutes.post("/auth/register", authController.register);
authRoutes.post("/auth/login", authController.login);

export { authRoutes };
