import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';

import {
  authHandler,
  userHandler,
  transferHandler,
  saldoChangesHandler,
  dataHandler,
} from './handler';
import {
  validateJWT,
  validateAdmin,
  validateCustomer,
} from './middlewares';
import { handlerWrapperError } from './utils';

const app = express();
const PORT = process.env.PORT || 5000;
const dateRunning = new Date();

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb' }));
app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());

app.get('/', (_, res) => {
  res.json(`Server is running from ${dateRunning.toLocaleString()}`);
});

app.get(
  '/user',
  validateJWT,
  handlerWrapperError(userHandler.getProfileHandler),
);

app.post('/login', handlerWrapperError(authHandler.loginHandler));
app.post(
  '/register',
  handlerWrapperError(authHandler.registerHandler),
);

app.get(
  '/verify',
  validateJWT,
  validateAdmin,
  handlerWrapperError(authHandler.verifyRequestsHandler),
);
app.post(
  '/verify',
  validateJWT,
  validateAdmin,
  handlerWrapperError(authHandler.verifyHandler),
);

app.post(
  '/transfer',
  validateJWT,
  validateCustomer,
  handlerWrapperError(transferHandler.createTransferHandler),
);
app.get(
  '/transfer',
  validateJWT,
  validateCustomer,
  handlerWrapperError(transferHandler.transferHistoryHandler),
);

app.get(
  '/saldo-changes',
  validateJWT,
  validateCustomer,
  handlerWrapperError(saldoChangesHandler.saldoChangesHistoryHandler),
);
app.get(
  '/saldo-changes/requests',
  validateJWT,
  validateAdmin,
  handlerWrapperError(saldoChangesHandler.getAllDraftRequests),
);
app.post(
  '/saldo-changes',
  validateJWT,
  validateCustomer,
  handlerWrapperError(saldoChangesHandler.requestSaldoChangesHandler),
);
app.patch(
  '/saldo-changes/:id',
  validateJWT,
  validateAdmin,
  handlerWrapperError(saldoChangesHandler.modifySaldoChangesHandler),
);

app.get(
  '/data/exchange-rates-symbols',
  handlerWrapperError(dataHandler.exchangeRateSymbolsHandler),
);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
