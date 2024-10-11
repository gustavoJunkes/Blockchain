import { Router } from 'express';
import { AppController } from '../controller/app-controller.js';

const router = Router();

router.post('/new-transaction', AppController.newTransaction);
router.get('/chain', AppController.getChain);
router.get('/mempool', AppController.getMemPool);

export { router as appRoutes };
