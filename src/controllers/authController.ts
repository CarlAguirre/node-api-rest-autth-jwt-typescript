import type { Request, Response } from "express";
import { findUserByEmail, createUser } from "../models/user.js";
import { comparePassword, hashPassword } from "../services/password.service.js";
import { generateToken } from "../services/auth.service.js";
import { prisma } from "../config/database.js";

export const register = async (req: Request, res: Response) => {
  
    const { email, password } = req.body;

  try {
    // Verificar si el usuario ya existe
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Hashear la contraseña
    const hashedPassword = await hashPassword(password);

    // Crear el nuevo usuario
    const newUser = await createUser(email, hashedPassword);
    const token = generateToken(newUser); // Generar un token JWT
    
    return res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
          id: newUser.id,
          email: newUser.email
        },
        token
    });

  

  } catch (error) {

    //TODO manejo de errores

    if (!email){
      return res.status(400).json({ message: 'El email es obligatorio' });
    }
    if (!password){
      return res.status(400).json({ message: 'La contraseña es obligatoria' });
    }
    
    console.error('Error al registrar el usuario:', error);
    return res.status(500).json({ message: 'Error al registrar el usuario' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  // Lógica para autenticar un usuario
  const { email, password } = req.body;

  try {

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      res.status(400).json({ message: 'Credenciales inválidas' });
      return;
    }

    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      res.status(400).json({ message: 'Credenciales inválidas' });
      return;
    }

    const token = generateToken(user);

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      // user: {
      //   id: user.id,
      //   email: user.email
      // },
      token
    });
    
  } catch (error: Error | unknown) {
    console.log('Error', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};