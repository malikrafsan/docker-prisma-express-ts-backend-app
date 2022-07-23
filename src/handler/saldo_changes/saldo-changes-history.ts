import { Request, Response } from 'express';
import prisma from '../../prisma';

const saldoChangesHistoryHandler = async (_: Request, res: Response) => {
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

  const saldoChangesHistory = await prisma.reqSaldoChange.findMany({
    where: {
      id_user: user.id_user,
    },
  });

  return res.status(200).json(saldoChangesHistory);
}

export default saldoChangesHistoryHandler;