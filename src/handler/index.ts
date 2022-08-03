import loginHandler from './auth/login';
import registerHandler from './auth/register';
import verifyHandler from './auth/verify';
import verifyRequestsHandler from './auth/verify-requests';

import getProfileHandler from './user/profile';

import transferHandler from './transfer/transfer';
import transferHistoryHandler from './transfer/transfer-history';

import saldoChangesHistoryHandler from './saldo_changes/saldo-changes-history';
import requestSaldoChangesHandler from './saldo_changes/request-saldo-changes';
import modifySaldoChangesHandler from './saldo_changes/verify-saldo-changes';
import getAllDraftRequests from './saldo_changes/get-all-draft-request';

import exchangeRateSymbolsHandler from './data/exchange-rates-symbols';

export {
  loginHandler,
  registerHandler,
  verifyHandler,
  verifyRequestsHandler,
  transferHandler,
  transferHistoryHandler,
  saldoChangesHistoryHandler,
  requestSaldoChangesHandler,
  modifySaldoChangesHandler,
  getAllDraftRequests,
  exchangeRateSymbolsHandler,
  getProfileHandler,
};
