import { Request, Response } from 'express';
import { exchangeRatesSymbols } from '../../data';

const exchangeRateSymbolsHandler = async (
  _: Request,
  res: Response,
) => {
  const symbols = Object.keys(exchangeRatesSymbols);

  return res.status(200).json(symbols);
};

export default exchangeRateSymbolsHandler;
