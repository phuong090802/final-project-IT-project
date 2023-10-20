import express from 'express';
import multer from 'multer';
import { verifyToken, isUser } from '../middlewares/authMiddleware.js';
import { nanoid } from 'nanoid';
import { storage } from '../config/firebaseConfig.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import path from 'path';


const router = express.Router();
const memoryStorage = multer.memoryStorage();
const upload = multer({ memoryStorage });

router.post('/', verifyToken, isUser, upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Không tìm thấy file.' });
    }

    if (!validateFormat(req.file)) {
        return res.status(400).json({ success: false, message: 'Định dạng không hợp lệ.' });
    }

    uploadFile(req.file, res);
});

const validateFormat = (file) => {
    const filetypes = /jpg|jpeg|png/;
    const extension = path.extname(file.originalname);
    const extname = filetypes.test(extension.toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    return extname && mimetype;
}

const uploadFile = async (file, res) => {
    try {
        const extension = path.extname(file.originalname);
        const filename = `${nanoid()}${extension}`;
        const dataRef = `images/${filename}`;
        const storageRef = ref(storage, dataRef);
        await uploadBytes(storageRef, new Uint8Array(file.buffer));
        const url = await getDownloadURL(storageRef);
        return res.status(200).json({ success: true, data: { ref: dataRef, url: url } });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}


export default router;