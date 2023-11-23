import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
    storageBucket: process.env.STORAGEBUCKET
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);