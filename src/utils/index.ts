import bcryptjs from 'bcryptjs';
import { exchangeRatesSymbols } from '../data';

export const hasher = async (str: string) => {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(str, salt);
};

export const validCurrency = (currency: string) => {
  return Object.keys(exchangeRatesSymbols).includes(currency);
};
