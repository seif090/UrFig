import { Router } from 'express';
import { AdminController } from '../controllers/AdminController.js';
import { uploadLegoPart } from '../middleware/uploadMiddleware.js';

const router = Router();

// In a real app, you'd add an admin check middleware here
router.post('/lego-parts', uploadLegoPart.single('image'), AdminController.addLegoPart);
router.get('/stats', AdminController.getPartStats);

export default router;
迫