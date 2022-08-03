import createTransferHandler from './transfer';
import transferHistoryHandler from './transfer-history';

import { ITransferHandler, handlerType } from '../../interfaces';

class TransferHandler {
  createTransferHandler: handlerType;
  transferHistoryHandler: handlerType;

  constructor() {
    this.createTransferHandler = createTransferHandler;
    this.transferHistoryHandler = transferHistoryHandler;
  }
}

export default new TransferHandler() as ITransferHandler;
