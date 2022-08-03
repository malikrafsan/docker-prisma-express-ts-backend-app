import loginHandler from './login';
import registerHandler from './register';
import verifyHandler from './verify';
import verifyRequestsHandler from './verify-requests';

import { IAuthHandler, handlerType } from '../../interfaces';

class AuthHandler {
  loginHandler: handlerType;
  registerHandler: handlerType;
  verifyHandler: handlerType;
  verifyRequestsHandler: handlerType;

  constructor() {
    this.loginHandler = loginHandler;
    this.registerHandler = registerHandler;
    this.verifyHandler = verifyHandler;
    this.verifyRequestsHandler = verifyRequestsHandler;
  }
}

export default new AuthHandler() as IAuthHandler;