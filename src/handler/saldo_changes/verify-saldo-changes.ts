import { Request, Response } from 'express';
import prisma from '../../prisma';
import { VerificationStatus } from '@prisma/client';

const modifySaldoChangesHandler = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;
  const { verified } = req.body;

  const reqSaldoChange = await prisma.reqSaldoChange.findFirst({
    where: {
      id_req_saldo_change: parseInt(id),
    },
  });

  if (!reqSaldoChange) {
    return res.status(401).json({
      message: 'Request saldo changes does not exist',
    });
  }

  const user = await prisma.user.findFirst({
    where: {
      id_user: reqSaldoChange.id_user,
    },
  });

  if (!user) {
    return res.status(401).json({
      message: 'User does not exist',
    });
  }

  const updatedRequest = await prisma.reqSaldoChange.update({
    where: {
      id_req_saldo_change: parseInt(id),
    },
    data: {
      verification_status: verified
        ? VerificationStatus.VERIFIED
        : VerificationStatus.REJECTED,
    },
  });

  if (
    updatedRequest.verification_status === VerificationStatus.VERIFIED
  ) {
    const updatedUser = await prisma.user.update({
      where: {
        id_user: user.id_user,
      },
      data: {
        saldo: user.saldo + reqSaldoChange.amount,
      },
    });

    return res.status(200).json({
      request: updatedRequest,
      user: updatedUser,
    });
  }

  return res.status(200).json({
    request: updatedRequest,
  });
};

export default modifySaldoChangesHandler;
