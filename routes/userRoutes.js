import express from 'express';
import {
    handleCreateUserDetails, handleGet, handleGetAll,
    handleUserDetailsExists, handleChangePassword
} from '../controllers/userController.js';
import { verifyToken, roleUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

//#region test
router.all('/test', verifyToken, (req, res) => res.json({ success: true, message: 'Xác thực thành công.' }));
//#endregion

router.put('/password', verifyToken, roleUser, handleChangePassword);
router.get('/exists', verifyToken, roleUser, handleUserDetailsExists);
router.route('/:id').get(handleGet);
router.route('/').post(verifyToken, roleUser, handleCreateUserDetails).get(handleGetAll);

export default router;