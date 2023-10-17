import express from 'express';
import { handleCreateUserDetails, handleGet, handleGetAll, handleUserDetailsExists } from '../controllers/userController.js';
import { verifyToken, roleUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

//#region test
router.route('/test', verifyToken, (req, res) => res.json({ message: 'Xác thực thành công.' }));
//#endregion

router.get('/exists', verifyToken, roleUser, handleUserDetailsExists);
router.route('/:id').get(handleGet);
router.route('/').post(verifyToken, roleUser, handleCreateUserDetails).get(handleGetAll);

export default router;