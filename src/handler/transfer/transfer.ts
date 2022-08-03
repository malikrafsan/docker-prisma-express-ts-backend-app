import { Request, Response } from 'express';
import prisma from '../../prisma';
import { VerificationStatus } from '@prisma/client';
import { exchangeRateSrv } from '../../services';
import { validCurrency } from '../../utils';
import { exchangeRatesSymbolsType } from '../../data';

const createTransferHandler = async (req: Request, res: Response) => {
  const { username_dest, amount, currency } = req.body;

  const username_src = res.locals.user.username;

  if (username_src === username_dest) {
    return res.status(400).json({
      message: 'Username is same for source and destination',
    });
  }

  if (!validCurrency(currency)) {
    return res.status(400).json({ message: 'Invalid currency' });
  }

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

  if (
    user_src.verification_status !== VerificationStatus.VERIFIED ||
    user_dest.verification_status !== VerificationStatus.VERIFIED
  ) {
    return res.status(401).json({
      message: 'User is not verified',
    });
  }

  const exchangeRes = await exchangeRateSrv.convert(
    currency as exchangeRatesSymbolsType,
    amount,
  );
  
  if (exchangeRes.err || !exchangeRes.data) {
    return res.status(500).json({ message: 'Internal server error' });
  } 

  const convertedAmount = exchangeRes.data.result;

  if (user_src.saldo < convertedAmount) {
    return res.status(400).json({
      message: 'Not enough saldo',
    });
  }

  const [updatedUserSrc, updatedUserDest] = await prisma.$transaction(
    [
      prisma.user.update({
        where: {
          username: username_src,
        },
        data: {
          saldo: user_src.saldo - convertedAmount,
        },
      }),
      prisma.user.update({
        where: {
          username: username_dest,
        },
        data: {
          saldo: user_dest.saldo + convertedAmount,
        },
      }),
    ],
  );

  if (!updatedUserSrc || !updatedUserDest) {
    return res.status(400).json({ message: 'Update failed' });
  }

  const transaction = await prisma.transfer.create({
    data: {
      id_user_src: user_src.id_user,
      id_user_dest: user_dest.id_user,
      amount: convertedAmount,
      currency,
    },
  });

  return res.status(200).json({
    message: 'Transfer success',
    transaction,
  });
};

export default createTransferHandler;
