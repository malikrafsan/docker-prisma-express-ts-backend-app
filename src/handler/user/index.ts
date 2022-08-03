import getProfileHandler from './profile';

import { IUserHandler, handlerType } from '../../interfaces';

class UserHandler {
  getProfileHandler: handlerType;

  constructor() {
    this.getProfileHandler = getProfileHandler;
  }
}

export default new UserHandler() as IUserHandler;
