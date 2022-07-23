import { Request, Response } from 'express';
import prisma from '../../prisma';
import { VerificationStatus } from '@prisma/client';

const verifyRequestsHandler = async (req: Request, res: Response) => {
  const unverifiedUsers = await prisma.user.findMany({
    where: {
      verification_status: VerificationStatus.DRAFT,
    },
  });

  return res.status(200).json(unverifiedUsers);
};

export default verifyRequestsHandler;
