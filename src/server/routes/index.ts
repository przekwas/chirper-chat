import * as express from 'express';
import chatRouter from './chat';

const router = express.Router();

router.use('/chat', chatRouter);

export default router;