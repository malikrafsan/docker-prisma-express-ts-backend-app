import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCOGEE-6UDaJ_LuLWVR-xz3Lusho4UdKOw",
  authDomain: "labpro-selection.firebaseapp.com",
  projectId: "labpro-selection",
  storageBucket: "labpro-selection.appspot.com",
  messagingSenderId: "308811841589",
  appId: "1:308811841589:web:0e1c3ffca10109f150317c"
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);