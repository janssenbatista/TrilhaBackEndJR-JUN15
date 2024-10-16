import { Router } from "express";
import TaskController from "../controllers/task.controller.js";
import { tokenMiddleware } from "../middlewares/token.middleware.js";

const taskRoutes = Router();

taskRoutes.use(tokenMiddleware);
taskRoutes.post("/tasks", TaskController.create);
taskRoutes.get("/tasks", TaskController.findAll);
taskRoutes.patch("/tasks/:taskId", TaskController.update);

export { taskRoutes };
