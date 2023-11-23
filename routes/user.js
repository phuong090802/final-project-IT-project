import express from 'express';
import {
    handleUpdatePassword
} from '../controllers/user.js';

const router = express.Router();


router.route('/:id')
    .patch(handleUpdatePassword)


export default router;