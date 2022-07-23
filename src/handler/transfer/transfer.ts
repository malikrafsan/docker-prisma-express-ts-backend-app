import { Request, Response } from 'express';
import prisma from '../../prisma';
import { VerificationStatus } from '@prisma/client'

const transferHandler = async (req: Request, res: Response) => {
  const { username_dest, amount, currency } = req.body;

  const username_src = res.locals.user.username;

  const user_src = await prisma.user.findFirst({
    where: {
      username: username_src,
    },
  });

  const user_dest = await prisma.user.findFirst({
    where: {
      username: username_dest,
    },
  });

  if (!user_src || !user_dest) {
    return res.status(401).json({
      message: 'User does not exist',
    });
  }

  if (user_src.verification_status !== VerificationStatus.VERIFIED || user_dest.verification_status !== VerificationStatus.VERIFIED) {
    return res.status(401).json({
      message: 'User is not verified',
    });
  }

  const updatedUserSrc = await prisma.user.update({
    where: {
      username: username_src,
    },
    data: {
      saldo: user_src.saldo - amount,
    },
  });
  const updatedUserDest = await prisma.user.update({
    where: {
      username: username_dest,
    },
    data: {
      saldo: user_dest.saldo + amount,
    },
  });

  if (updatedUserSrc && updatedUserDest) {
    const transaction = await prisma.transfer.create({
      data: {
        id_user_src: user_src.id_user,
        id_user_dest: user_dest.id_user,
        amount,
        currency,
      }
    })

    return res.status(200).json({
      message: 'Transfer success',
      transaction
    });
  }

  return res.status(400).json({ message: "Update failed" });
}

export default transferHandler;