import express from "express";
import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/auth.service.js";
import { createUser, deleteUser, getUserById, getUsers, updateUser } from "../controllers/userController.js";

const router = express.Router();

//* Middleware de JWT y autorizacion aqui *//

// Rutas de usuario
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // Lógica para autenticar el token JWT
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" }); // Unauthorized
  }

  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(403).json({ message: "No tienes acceso a este recurso" }); // Forbidden
  }
  
  // Agregar el usuario decodificado al request
  (req as any).user = decoded;
  next();
}

router.post("/", authenticateToken,  createUser);
router.get("/", authenticateToken,  getUsers);
router.get("/:id", authenticateToken,  getUserById);
router.put("/:id", authenticateToken,  updateUser);
router.delete("/:id", authenticateToken,  deleteUser);

export default router;