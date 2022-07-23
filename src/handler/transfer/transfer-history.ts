import { Request, Response } from 'express';
import prisma from '../../prisma';

const transferHistoryHandler = async (_: Request, res: Response) => {
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

  const transferHistorySrc = await prisma.transfer.findMany({
    where: {
      id_user_src: user.id_user,
    },
  });

  const transferHistoryDest = await prisma.transfer.findMany({
    where: {
      id_user_dest: user.id_user,
    },
  });

  return res.status(200).json({
    transferHistorySrc,
    transferHistoryDest,
  });
}

export default transferHistoryHandler;