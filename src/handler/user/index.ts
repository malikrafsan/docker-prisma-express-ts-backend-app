import getProfileHandler from './profile';
import findAllUserHandler from './find-all';

import { IUserHandler, handlerType } from '../../interfaces';

class UserHandler {
  getProfileHandler: handlerType;
  findAllUserHandler: handlerType;

  constructor() {
    this.getProfileHandler = getProfileHandler;
    this.findAllUserHandler = findAllUserHandler;
  }
}

export default new UserHandler() as IUserHandler;
