import exchangeRateSymbolsHandler from './exchange-rates-symbols';

import { IDataHandler, handlerType } from '../../interfaces';

class DataHandler {
  exchangeRateSymbolsHandler: handlerType;

  constructor() {
    this.exchangeRateSymbolsHandler = exchangeRateSymbolsHandler;
  }
}

export default new DataHandler() as IDataHandler;
