import { BAD_REQUEST, CONFLICT, CREATED } from "../constants/httpStatusCode.js";
import { connectToDatabase } from "../database/db.config.js";
import { hash } from "bcrypt";
import { generateToken } from "../utils/token.utils.js";
import { validateEmail } from "../utils/email.utils.js";

class AuthController {
  register = async (req, res) => {
    const { name, email, password } = req.body;
    // verifica se todos os campos foram preenchidos
    if (!name || !email || !password) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Name, email and password are required" });
    }
    // verifica se os campos não estão vazios
    if (!name.trim() || !email.trim() || !password.trim()) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Name, email and password must not be empty" });
    }
    // verifica se o email é valido
    if (!validateEmail(email)) {
      return res.status(BAD_REQUEST).json({ message: "Invalid email" });
    }
    // verifica se a senha contém pelo menos 8 caracteres
    if (password.trim().length < 8) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Password must contain at least 8 characters" });
    }
    const db = await connectToDatabase();
    // verifica se o usuário já existe
    const user = await db.get("SELECT * FROM tb_users WHERE email = ?", [
      email,
    ]);
    if (user) {
      return res.status(CONFLICT).json({ message: "User already exists" });
    }
    const hashedPassword = await hash(password, 10);
    // cria o novo usuário
    const { lastID } = await db.run(
      "INSERT INTO tb_users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );
    const accessToken = generateToken(lastID);
    return res.status(CREATED).json({
      id: lastID,
      name,
      email,
      auth: {
        accessToken,
      },
    });
  };
}

export default new AuthController();
