import { Request, Response } from 'express';
import prisma from '../../prisma';
import { hasher } from '../../utils';
import { ref, getDownloadURL, uploadBytesResumable, uploadString } from "firebase/storage";
import { storage } from '../../../firebase';

const decodeBase64Image = (dataString: string) => {
  const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

  if (!matches) {
    return null;
  }

  if (matches.length !== 3) {
    return null;
  }

  return {
    type: matches[1],
    data: new Buffer(matches[2], 'base64'),
  };
}

const dataURLtoFile = (dataurl: string, filename: string) => {
  const arr = dataurl.split(',');
  const arrMatch = arr[0].match(/:(.*?);/);

  if (!arrMatch) {
    return null;
  }

  const mime = arrMatch[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

const uploadFiles = async (file: File) => {// (base64: string, filename: string) => {
  if (!file) {
    return '';
  }

  const storageRef = ref(storage, `files/filename`);
  const uploadTask = await uploadBytesResumable(storageRef, file);
  const res = await getDownloadURL(uploadTask.ref);
  // const res = await uploadString(storageRef, base64, 'base64');

  // const url = res.ref.fullPath;

  // return url;
  return res;
};

const uploadFilesBase64 = async (base64: string, filename: string) => {
  const storageRef = ref(storage, `files/${filename}`);
  // const uploadTask = await uploadBytesResumable(storageRef, file);
  // const res = await getDownloadURL(uploadTask.ref);
  console.log(base64);
  const res = await uploadString(storageRef, base64.split(',')[1], 'base64');

  // const url = res.ref.fullPath;

  // return url;
  return res.ref.fullPath;
};

const registerHandler = async (req: Request, res: Response) => {
  // console.log
  try {
    const { name, username, password, fotoKTP, fileFoto } = req.body;

    console.log(fileFoto);

    if (!name || !username || !password || !fotoKTP) {
      return res.status(400).json({ message: 'Bad Request' });
    }

    const user = await prisma.user.findFirst({
      where: {
        username
      },
    });

    if (user) {
      return res.status(400).json({ message: 'Username is already registered' });
    }

    // const fileKTP = dataURLtoFile(fotoKTP, `${username}_ktp-${Math.floor(Math.random() * 100)}`);
    // if (!fileKTP) {
    //   return res.status(400).json({ message: 'Bad Request' });
    // }

    // const fileKTPURL = await uploadFiles(fileKTP);
    const fileKTPURL = await uploadFilesBase64(fotoKTP, `${username}_ktp-${Math.floor(Math.random() * 100)}.png`);

    // let fileKTPURL = '';
    // try {
    //   fileKTPURL = await uploadFiles(fotoKTP, `${username}_ktp-${Math.floor(Math.random() * 100)}`)
    // } catch (err) {
    //   console.log(err)
    //   throw err;
    // }


    const hashedPassword = await hasher(password);
    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        password: hashedPassword,
        fotoKTP,
        linkKTP: fileKTPURL,
        is_admin: false,
      },
    });

    return res.json(newUser);
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export default registerHandler;