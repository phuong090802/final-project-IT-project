import express from 'express';
import {
    handleCreate, handleUpdate, handleGet, handleGetAll,
    handleUserExists, handleChangePassword
} from '../controllers/userController.js';
import { verifyToken, isUser } from '../middlewares/authMiddleware.js';
import { handleValidationCreate, handleValidationUpdate } from '../middlewares/userMiddleware.js';

const router = express.Router();

router.all('/test', verifyToken, (req, res) => res.json({ success: true, message: 'Xác thực thành công.' }));
router.put('/password', verifyToken, isUser, handleChangePassword);
router.get('/exists', verifyToken, isUser, handleUserExists);
router.route('/:id').get(handleGet);
router.route('/')
    .post(verifyToken, isUser, handleValidationCreate, handleCreate)
    .put(verifyToken, isUser, handleValidationUpdate, handleUpdate)
    .get(handleGetAll);

export default router;