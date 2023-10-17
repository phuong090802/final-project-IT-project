import express from 'express';
import multer from 'multer';
import { nanoid } from 'nanoid';
import path from 'path';
import { storage } from '../config/firebaseConfig.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const router = express.Router();

const memoryStorage = multer.memoryStorage();

const upload = multer({ memoryStorage });


router.post('/', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Không tìm thấy file.' });
    }
    const filetypes = /jpg|jpeg|png/;
    const extension = path.extname(req.file.originalname);
    const extname = filetypes.test(extension.toLowerCase());
    const mimetype = filetypes.test(req.file.mimetype);
    if (extname && mimetype) {
        try {
            const filename = `${nanoid()}${extension}`;
            const dataRef = `avatar/${filename}`;
            const storageRef = ref(storage, dataRef);
            await uploadBytes(storageRef, new Uint8Array(req.file.buffer));
            const url = await getDownloadURL(storageRef);
            return res.status(200).json({ ref: dataRef, url: url });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
    return res.status(400).json({ error: 'Định dạng không hợp lệ' });

});

export default router;