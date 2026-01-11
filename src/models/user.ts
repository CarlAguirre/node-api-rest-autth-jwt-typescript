import { prisma } from "../config/database.js";
import type { User }  from "../interfaces/user.interface.js";

export const createUser = async (email: string, password: string): Promise<User> => {
  return prisma.user.create({
    data: {
      email,
      password,
    },
  });
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}; 

export const findUserById = async (id: number): Promise<User | null> => {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
};