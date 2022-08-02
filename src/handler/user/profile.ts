import { Request, Response } from 'express';
import prisma from '../../prisma';

const getProfileHandler = async (_: Request, res: Response) => {
  const username = res.locals.user.username;

  const user = await prisma.user.findFirst({
    where: {
      username: username,
    },
  });

  if (!user) {
    return res.status(401).json({
      message: 'User does not exist',
    });
  }

  return res.status(200).json(user);
}

export default getProfileHandler;