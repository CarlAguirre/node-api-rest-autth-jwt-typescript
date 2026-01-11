import type { User } from "../interfaces/user.interface.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

export const generateToken = (user: User): string => {
  return jwt.sign(
    { id: user.id, email: user.email }, 
    JWT_SECRET, 
    { expiresIn: '1h' }
  );
};

export const verifyToken = (token: string): Partial<User> | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
    return {
      id: decoded.id,
      email: decoded.email
    };
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return null;
  }
};  