import { Request, Response } from 'express';
import prisma from '../../prisma';

const findAllUserHandler = async (_: Request, res: Response) => {
  const users = await prisma.user.findMany();

  return res.status(200).json(users);
};

export default findAllUserHandler;
