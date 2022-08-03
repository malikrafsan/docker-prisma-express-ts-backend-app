import { Request, Response } from 'express';
import prisma from '../../prisma';
import { VerificationStatus } from '@prisma/client';
import { exchangeRateSrv } from '../../services';
import { validCurrency } from '../../utils';
import { exchangeRatesSymbolsType } from '../../data';

const requestSaldoChangesHandler = async (
  req: Request,
  res: Response,
) => {
  const { currency, amount_source } = req.body;
  const username = res.locals.user.username;

  if (
    typeof currency !== 'string' ||
    typeof amount_source !== 'number'
  ) {
    return res.status(400).json({ message: 'Invalid request' });
  }

  if (!validCurrency(currency)) {
    return res.status(400).json({ message: 'Invalid currency' });
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

  if (user.verification_status !== VerificationStatus.VERIFIED) {
    return res.status(401).json({
      message: 'User is not verified',
    });
  }

  const exchangeRes = await exchangeRateSrv.convert(
    currency as exchangeRatesSymbolsType,
    amount_source,
  );
  const amount = exchangeRes.data.result;

  if (user.saldo + amount < 0) {
    return res.status(400).json({
      message: 'Not enough saldo',
    });
  }

  const reqSaldoChange = await prisma.reqSaldoChange.create({
    data: {
      id_user: user.id_user,
      currency,
      amount,
    },
  });

  return res.status(200).json(reqSaldoChange);
};

export default requestSaldoChangesHandler;
