import express from 'express';

const router = express.Router();

router.route('/test').get((req, res) => res.json('OK'));

export default router;