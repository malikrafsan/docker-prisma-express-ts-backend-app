import express from 'express'
import prisma from './prisma';
import cors from 'cors';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';

global.atob = require("atob");
global.Blob = require('node-blob');

import { loginHandler, registerHandler, verifyHandler } from './handler';
import { validateJWT } from './utils';
import { ref, getDownloadURL, uploadBytesResumable, uploadString } from "firebase/storage";
import { storage } from '../firebase';

const app = express()
const PORT = 5000

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb' }));
app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());

app.get('/', (req, res) => {
  res.json('hello there')
})

app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany()
    res.json(users)
  } catch (err) {
    console.log(err)
  }
});

const uploadFiles = async (file: any) => {// (base64: string, filename: string) => {
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

app.post('/login', loginHandler);
app.post('/register', registerHandler);
app.post('/verify', validateJWT, verifyHandler);
app.post('/upload', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // console.log(req.files.fotoKTP);
  const link = await uploadFiles(req.files.fotoKTP);
  res.json({ message: 'hello', link })
})

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
