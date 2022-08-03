import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import { exchangeRatesSymbols } from '../data';

export const hasher = async (str: string) => {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(str, salt);
};

export const validCurrency = (currency: string) => {
  return Object.keys(exchangeRatesSymbols).includes(currency);
};

export const handlerWrapperError = (
  handler: (req: Request, res: Response) => void,
) => {
  return async (req: Request, res: Response) => {
    try {
      handler(req, res);
    } catch (err) {
      return res
        .status(500)
        .json({ message: 'Internal Server Error' });
    }
  };
};
