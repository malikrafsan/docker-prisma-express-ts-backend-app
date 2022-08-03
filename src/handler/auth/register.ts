import { Request, Response } from 'express';
import prisma from '../../prisma';
import { hasher } from '../../utils';

const registerHandler = async (req: Request, res: Response) => {
  try {
    const { name, username, password, fotoKTP, urlFotoKTP } =
      req.body;

    if (!name || !username || !password || !fotoKTP || !urlFotoKTP) {
      return res.status(400).json({ message: 'Bad Request' });
    }

    const user = await prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (user) {
      return res
        .status(400)
        .json({ message: 'Username is already registered' });
    }

    const hashedPassword = await hasher(password);
    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        password: hashedPassword,
        fotoKTP,
        linkKTP: urlFotoKTP,
        is_admin: false,
      },
    });

    return res.json(newUser);
  } catch (err) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default registerHandler;
