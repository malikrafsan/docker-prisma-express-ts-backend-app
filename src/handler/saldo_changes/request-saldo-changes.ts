import { Request, Response } from 'express';
import prisma from '../../prisma';

const requestSaldoChangesHandler = async (req: Request, res: Response) => {
  const { currency, amount_source } = req.body;
  const username = res.locals.user.username;

  if (typeof currency !== "string" || typeof amount_source !== "number") {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

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

  // TODO: change later
  const amount_target = amount_source;

  const reqSaldoChange = await prisma.reqSaldoChange.create({
    data: {
      id_user: user.id_user,
      currency,
      amount_source,
      amount_target,
    }
  });

  return res.status(200).json(reqSaldoChange);
}

export default requestSaldoChangesHandler;