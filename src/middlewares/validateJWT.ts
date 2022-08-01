import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { accessTokenSecret } from '../configs';

const validateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      res.locals.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

export default validateJWT;