import axios from 'axios';
import cache from 'memory-cache';

import { exchangeRatesSymbolsType } from '../../data';

class ExchangeRateSrv {
  private readonly API_URL =
    'https://api.apilayer.com/exchangerates_data';
  private readonly API_KEY = 'V2TwWVS4CIIpoG1cfs6WKr9nwzhSIysy';

  // 1 month in ms
  // private readonly DEFAULT_CACHE_TIME = 1000 * 60 * 60 * 24 * 30;
  private readonly DEFAULT_TO_CURRENCY = 'IDR';

  constructor() {}

  async convert(from: exchangeRatesSymbolsType, amount: number) {
    // DELETE LATER
    console.log('convert');
    return {
      data: {
        result: amount * 2,
      },
      err: null,
    };

    if (this.getCache(from)) {
      console.log('HIT CACHE');
      const result = this.getCache(from) * amount;

      return {
        data: {
          result,
        },
        err: null,
      };
    }

    console.log('MISS CACHE');

    const url = `${this.API_URL}/convert?to=${this.DEFAULT_TO_CURRENCY}&from=${from}&amount=${amount}`;

    try {
      const res = await axios.get(url, {
        headers: {
          apikey: this.API_KEY,
        },
        responseType: 'text',
      });

      const data = res.data;
      this.putCache(from, data.info.rate);

      return { data: res.data, err: null };
    } catch (err) {
      return { data: null, err };
    }
  }

  private putCache(key: any, value: unknown) {
    return cache.put(key, value);
  }

  private getCache(key: any) {
    return cache.get(key);
  }
}

export default new ExchangeRateSrv();
