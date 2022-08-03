import axios from 'axios';
import cache from 'memory-cache';

import { exchangeRatesSymbolsType } from '../../data';

class ExchangeRateSrv {
  private readonly API_URL =
    'https://api.apilayer.com/exchangerates_data';
  private readonly API_KEY = process.env.API_KEY_EXCHANGE_RATE || '-';

  private readonly DEFAULT_TO_CURRENCY = 'IDR';

  constructor() {}

  async convert(from: exchangeRatesSymbolsType, amount: number) {
    const cache = this.getCache(from);
    if (cache) {
      console.log('HIT CACHE', cache);
      const result = Math.floor(cache * amount);

      return {
        data: {
          result,
        },
        err: null,
      };
    }

    console.log('MISS CACHE');

    const url = `${this.API_URL}/convert?to=${this.DEFAULT_TO_CURRENCY}&from=${from}&amount=${amount}`;

    const res = await axios.get(url, {
      headers: {
        apikey: this.API_KEY,
      },
      responseType: 'text',
    });

    const data = res.data;
    this.putCache(from, data.info.rate);

    return {
      data: {
        result: Math.floor(data.result),
      },
      err: null,
    };
  }

  private putCache(key: any, value: unknown) {
    return cache.put(key, value);
  }

  private getCache(key: any) {
    return cache.get(key);
  }
}

export default new ExchangeRateSrv();
