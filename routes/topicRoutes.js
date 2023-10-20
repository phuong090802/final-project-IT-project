import express from 'express';
import { handleCreate, handleUpdate, handleDelete, handleGetAll, handleGet } from '../controllers/topicController.js';
import { handleValidationCreate, handleValidateUpdate } from '../middlewares/topicMiddleware.js';
import { verifyToken, isUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(verifyToken, isUser, handleValidationCreate, handleCreate)
    .get(handleGetAll);

router.route('/:id')
    .put(verifyToken, isUser, handleValidateUpdate, handleUpdate)
    .delete(verifyToken, isUser, handleDelete)
    .get(handleGet);

export default router;