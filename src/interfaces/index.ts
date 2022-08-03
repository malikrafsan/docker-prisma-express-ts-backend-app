import { Request, Response } from 'express';

export type handlerType = (
  req: Request,
  res: Response,
) => Promise<Response<any, Record<string, any>>>;

export interface IAuthHandler {
  loginHandler: handlerType;
  registerHandler: handlerType;
  verifyHandler: handlerType;
  verifyRequestsHandler: handlerType;
}

export interface IUserHandler {
  getProfileHandler: handlerType;
  findAllUserHandler: handlerType;
}

export interface ITransferHandler {
  transferHistoryHandler: handlerType;
  createTransferHandler: handlerType;
}

export interface ISaldoChangesHandler {
  saldoChangesHistoryHandler: handlerType;
  requestSaldoChangesHandler: handlerType;
  modifySaldoChangesHandler: handlerType;
  getAllDraftRequests: handlerType;
}

export interface IDataHandler {
  exchangeRateSymbolsHandler: handlerType;
}

