import express from 'express';
import multer from 'multer';
import { nanoid } from 'nanoid';
import { storage } from '../config/firebaseConfig.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import path from 'path';
import ErrorHandler from '../utils/errorHandler.js';
import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';


const router = express.Router();
const memoryStorage = multer.memoryStorage();
const upload = multer({ memoryStorage });

export const handleUpload = catchAsyncErrors(async (req, res, next) => {

    if (!req.file) {
        return next(new ErrorHandler(400, 'Không tìm thấy file', 'Không tìm thấy file được upload', 10037));
    }

    if (!validatorFormat(req.file)) {
        return next(new ErrorHandler(400, 'Định dạng file không hợp lệ', 'Định dạng file phải là .jpg hoặc .jpeg hoặc .png', 10038));
    }

    const extension = path.extname(req.file.originalname);
    const filename = `${nanoid()}${extension}`;
    const dataRef = `images/${filename}`;
    try {
        const storageRef = ref(storage, dataRef);
        await uploadBytes(storageRef, new Uint8Array(req.file.buffer));
        const url = await getDownloadURL(storageRef);
        return res.json({
            success: true,
            image: { ref: dataRef, url: url }
        });
    } catch (err) {
        console.log(err);
        return next(new ErrorHandler(400, 'Lỗi upload file', err, 10039));
    }

})

router.post('/', upload.single('image'), handleUpload);

const validatorFormat = (file) => {
    const filetypes = /jpg|jpeg|png/;
    const extension = path.extname(file.originalname);
    const extname = filetypes.test(extension.toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    return extname && mimetype;
}

export default router;