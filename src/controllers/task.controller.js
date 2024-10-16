import {
  BAD_REQUEST,
  CONFLICT,
  CREATED,
  FORBIDDEN,
  NOT_FOUND,
  OK,
} from "../constants/httpStatusCode.js";
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
        .status(CONFLICT)
        .json({ message: "Task with this description already exists" });
    }
    // cria uma nova tarefa
    const taskId = uuid();
    await db.run(
      "INSERT INTO tb_tasks (id, description, is_done, user_id) VALUES (?,?,?,?)",
      [taskId, description, isDone ?? false, userId]
    );
    return res.status(CREATED).json({
      id: taskId,
      description,
      isDone: isDone ?? false,
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

  update = async (req, res) => {
    const { description, isDone } = req.body;
    const { userId } = req;
    const { taskId } = req.params;
    // verifica se o parâmetro descrição foi passado
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
    // verifica se a tarefa existe
    const task = await db.get("SELECT * FROM tb_tasks WHERE id = ?", [taskId]);
    if (!task) {
      return res.status(NOT_FOUND).json({ message: "Task not found" });
    }
    // verifica se o usuário tem permissão para atualizar a tarefa
    if (task.user_id !== userId) {
      return res.status(FORBIDDEN).send();
    }
    // verifica se já existe outra tarefa com a mesma descrição
    const taskWithSameDescription = await db.get(
      "SELECT * FROM tb_tasks WHERE description = ? AND user_id = ?",
      [description.trim(), userId]
    );
    if (taskWithSameDescription && taskWithSameDescription.id !== taskId) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Task with this description already exists" });
    }
    // atualiza a tarefa
    await db.run(
      "UPDATE tb_tasks SET description = ?, is_done = ? WHERE id = ?",
      [description.trim(), isDone, taskId]
    );
    return res.status(OK).json({
      id: taskId,
      description,
      isDone,
    });
  };

  delete = async (req, res) => {
    const { userId } = req;
    const { taskId } = req.params;
    const db = await connectToDatabase();
    // verifica se a tarefa existe
    const task = await db.get("SELECT * FROM tb_tasks WHERE id = ?", [taskId]);
    if (!task) {
      return res.status(NOT_FOUND).json({ message: "Task not found" });
    }
    // verifica se o usuário tem permissão para deletar a tarefa
    if (task.user_id !== userId) {
      return res.status(FORBIDDEN).send();
    }
    // deleta a tarefa
    await db.run("DELETE FROM tb_tasks WHERE id = ?", [taskId]);
    return res.status(OK).send();
  };
}

export default new TaskController();
