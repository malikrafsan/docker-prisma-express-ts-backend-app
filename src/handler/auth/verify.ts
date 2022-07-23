import { Request, Response } from 'express';
import prisma from '../../prisma';
import { VerificationStatus } from '@prisma/client'

const verifyHandler = async (req: Request, res: Response) => {
  const { username, verified } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      username,
    },
  });

  if (!user) {
    return res.status(401).json({
      message: 'User does not exist',
    });
  }

  if (user.verification_status !== VerificationStatus.DRAFT) {
    return res.status(401).json({
      message: 'User already verified or rejected',
    });
  }

  const updatedUser = await prisma.user.update({
    where: {
      username,
    },
    data: {
      verification_status: verified ? VerificationStatus.VERIFIED : VerificationStatus.REJECTED,
    },
  });

  if (updatedUser) {
    return res.status(200).json(updatedUser);
  }

  return res.status(400).json({ message: "Update failed" });
}

export default verifyHandler;