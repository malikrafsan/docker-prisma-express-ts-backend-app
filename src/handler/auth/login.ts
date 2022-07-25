import { Request, Response } from 'express';
import prisma from '../../prisma';
import bcryptjs from 'bcryptjs';
import { VerificationStatus } from '@prisma/client'
import jwt from 'jsonwebtoken';
import { accessTokenSecret } from '../../config';

const loginHandler = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await prisma.user.findFirst({
    where: {
      username,
    },
  });

  if (user) {
    if (user.verification_status !== VerificationStatus.VERIFIED) {
      return res.status(401).json({
        message: 'User not verified',
      });
    }

    const validPassword = await bcryptjs.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const { username, is_admin } = user;
    const accessToken = jwt.sign({ username, is_admin }, accessTokenSecret);
    return res.status(200).json({
      token: accessToken,
      is_admin,
    });
  }

  return res.status(401).json({ message: "User does not exist" });
}

export default loginHandler;