import { BAD_REQUEST, CREATED } from "../constants/httpStatusCode.js";
import { connectToDatabase } from "../database/db.config.js";
import { v4 as uuid } from "uuid";

class TaskController {
  create = async (req, res) => {
    const { description, isDone } = req.body;
    const { userId } = req;
    // verifica se a descrição foi preenchida
    if (!description) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "description is required" });
    }
    // verifica se a descricão não está vazia
    if (!description.trim()) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "description must not be empty" });
    }
    const db = await connectToDatabase();
    // verifica se já não há uma tarefa com a mesma descrição
    const task = await db.get(
      "SELECT * FROM tb_tasks WHERE description = ? AND user_id = ?",
      [description, userId]
    );
    if (task) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Task with this description already exists" });
    }
    // cria uma nova tarefa
    const taskId = uuid();
    await db.run(
      "INSERT INTO tb_tasks (id, description, is_done, user_id) VALUES (?,?,?,?)",
      [taskId, description, isDone, userId]
    );
    return res.status(CREATED).json({
      id: taskId,
      description,
      isDone,
    });
  };

  findAll = async (req, res) => {
    const { userId } = req;
    const db = await connectToDatabase();
    const tasks = await db.all(
      "SELECT id, description, is_done FROM tb_tasks WHERE user_id = ?",
      [userId]
    );
    return res.json(tasks);
  };
}

export default new TaskController();
