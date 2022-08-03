import { Request, Response } from 'express';
import prisma from '../../prisma';
import { VerificationStatus } from '@prisma/client';

const getAllDraftRequests = async (_: Request, res: Response) => {
  const allRequest = await prisma.reqSaldoChange.findMany({
    where: {
      verification_status: VerificationStatus.DRAFT,
    },
    include: {
      user: true,
    },
  });

  return res.status(200).json(allRequest);
};

export default getAllDraftRequests;
