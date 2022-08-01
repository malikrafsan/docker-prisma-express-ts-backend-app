import express from 'express';
import prisma from './prisma';
import cors from 'cors';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';

global.atob = require('atob');
global.Blob = require('node-blob');

import {
  loginHandler,
  registerHandler,
  verifyHandler,
  transferHandler,
  transferHistoryHandler,
  saldoChangesHistoryHandler,
  requestSaldoChangesHandler,
  modifySaldoChangesHandler,
  getAllDraftRequests,
  verifyRequestsHandler,
  exchangeRateSymbolsHandler,
} from './handler';
import { validateJWT, validateAdmin } from './middlewares';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb' }));
app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());

app.get('/', (_, res) => {
  res.json('hello there');
});

app.get('/users', async (_, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    console.log(err);
  }
});

app.post('/login', loginHandler);
app.post('/register', registerHandler);

app.get('/verify', validateJWT, validateAdmin, verifyRequestsHandler);
app.post('/verify', validateJWT, validateAdmin, verifyHandler);

app.post('/transfer', validateJWT, transferHandler);
app.get('/transfer', validateJWT, transferHistoryHandler);

app.get('/saldo-changes', validateJWT, saldoChangesHistoryHandler);
app.get(
  '/saldo-changes/requests',
  validateJWT,
  validateAdmin,
  getAllDraftRequests,
);
app.post('/saldo-changes', validateJWT, requestSaldoChangesHandler);
app.patch(
  '/saldo-changes/:id',
  validateJWT,
  validateAdmin,
  modifySaldoChangesHandler,
);

app.get('/data/exchange-rates-symbols', exchangeRateSymbolsHandler);

// TODO: DELETE LATER

// import { exchangeRateSrv } from './services';

// app.get('/test-exchange-rates', async (req, res) => {
//   try {
//     const convert = await exchangeRateSrv.convert('USD', 4.14);
//     console.log(convert);
//     res.status(200).json(convert);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json(err);
//   }
// });

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
