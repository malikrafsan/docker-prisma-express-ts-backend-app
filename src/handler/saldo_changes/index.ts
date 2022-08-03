import saldoChangesHistoryHandler from './saldo-changes-history';
import requestSaldoChangesHandler from './request-saldo-changes';
import modifySaldoChangesHandler from './verify-saldo-changes';
import getAllDraftRequests from './get-all-draft-request';

import { ISaldoChangesHandler, handlerType } from '../../interfaces';

class SaldoChangesHandler {
  saldoChangesHistoryHandler: handlerType;
  requestSaldoChangesHandler: handlerType;
  modifySaldoChangesHandler: handlerType;
  getAllDraftRequests: handlerType;

  constructor() {
    this.saldoChangesHistoryHandler = saldoChangesHistoryHandler;
    this.requestSaldoChangesHandler = requestSaldoChangesHandler;
    this.modifySaldoChangesHandler = modifySaldoChangesHandler;
    this.getAllDraftRequests = getAllDraftRequests;
  }
}

export default new SaldoChangesHandler() as ISaldoChangesHandler;