import type { Request, Response } from 'express';
import { hashPassword } from '../services/password.service.js';
import { prisma } from '../config/database.js';


export const createUser = async (req: Request, res: Response): Promise<void> => {
    
    try {
      // Lógica para registrar un nuevo usuario
      const { email, password } = req.body;
      
      // Validar que se envíen los campos requeridos
      if (!email || !password) {
        res.status(400).json({ message: 'Email y contraseña son requeridos' });
        return;
      }

      // Verificar si el usuario ya existe
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        res.status(409).json({ message: 'El email ya está registrado' });
        return;
      }

      const hashedPassword = await hashPassword(password);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

     res.status(201).json({
      message: 'Usuario creado exitosamente',
      user});

    } catch (error: any) {
      console.error('Error al crear el usuario:', error);
      
      // Error de Prisma para constraint único
      if (error.code === 'P2002') {
        res.status(409).json({ message: 'El email ya está registrado' });
        return;
      }
      
      res.status(500).json({ message: 'Error al crear el usuario' });
    }
}

    
export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      // Lógica para obtener todos los usuarios
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          // No incluir password por seguridad
        },
      });
      res.status(200).json({ users, count: users.length });
    } catch (error: any) {
      console.error('Error al obtener los usuarios:', error);
      res.status(500).json({ 
        message: 'Error al obtener los usuarios',
        error: error.message 
      });
    }
}

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      // Lógica para obtener un usuario por ID
      const userId = Number(req.params.id);
      
      // Validar que el ID sea un número válido
      if (isNaN(userId) || userId <= 0) {
        res.status(400).json({ message: 'ID de usuario inválido' });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          // No incluir password por seguridad
        },
      });
  
      if (!user) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
      }
  
      res.status(200).json({ user });
    } catch (error: any) {
      console.error('Error al obtener el usuario:', error);
      res.status(500).json({ 
        message: 'Error al obtener el usuario',
        error: error.message 
      });
    }
}

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      // Lógica para actualizar un usuario por ID
      const userId = Number(req.params.id);
      
      // Validar que el ID sea un número válido
      if (isNaN(userId) || userId <= 0) {
        res.status(400).json({ message: 'ID de usuario inválido' });
        return;
      }

      const { email, password } = req.body;
      
      // Validar que se envíe al menos un campo para actualizar
      if (!email && !password) {
        res.status(400).json({ message: 'Debe proporcionar al menos un campo para actualizar' });
        return;
      }

      // Verificar que el usuario existe
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
      }

      // Si se está actualizando el email, verificar que no esté en uso
      if (email && email !== existingUser.email) {
        const emailInUse = await prisma.user.findUnique({
          where: { email },
        });

        if (emailInUse) {
          res.status(409).json({ message: 'El email ya está en uso por otro usuario' });
          return;
        }
      }

      const updatedData: any = {};
  
      if (password) {
        const hashedPassword = await hashPassword(password);
        updatedData.password = hashedPassword;
      }

      if (email) {
        updatedData.email = email;
      } 
  
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updatedData,
        select: {
          id: true,
          email: true,
        },
      });
  
      res.status(200).json({
        message: 'Usuario actualizado exitosamente',
        user: updatedUser,
      });
    } catch (error: any) {
      console.error('Error al actualizar el usuario:', error);
      
      // Error de Prisma para registro no encontrado
      if (error.code === 'P2025') {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
      }
      
      // Error de Prisma para constraint único
      if (error.code === 'P2002') {
        res.status(409).json({ message: 'El email ya está en uso' });
        return;
      }
      
      res.status(500).json({ 
        message: 'Error al actualizar el usuario',
        error: error.message 
      });
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      // Lógica para eliminar un usuario por ID
      const userId = Number(req.params.id);
      
      // Validar que el ID sea un número válido
      if (isNaN(userId) || userId <= 0) {
        res.status(400).json({ message: 'ID de usuario inválido' });
        return;
      }

      // Verificar que el usuario existe antes de eliminarlo
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
      }

      await prisma.user.delete({
        where: { id: userId },
      });
  
      res.status(200).json({ 
        message: 'Usuario eliminado exitosamente',
        deletedUser: {
          email: user.email,
        },
      });
    } catch (error: any) {
      console.error('Error al eliminar el usuario:', error);
      
      // Error de Prisma para registro no encontrado
      if (error.code === 'P2025') {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
      }
      
      res.status(500).json({ 
        message: 'Error al eliminar el usuario',
        error: error.message 
      });
    }
}   