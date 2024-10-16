import express from "express";
import dotenv from "dotenv";
import { authRoutes } from "./routes/auth.routes.js";
import { taskRoutes } from "./routes/task.routes.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

// routes
app.use(authRoutes);
app.use(taskRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
