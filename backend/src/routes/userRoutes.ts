import { Router } from 'express';
import { UserController } from '../controllers/UserController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/saved-designs', authenticate, UserController.saveDesign);
router.get('/saved-designs', authenticate, UserController.getSavedDesigns);

export default router;
迫