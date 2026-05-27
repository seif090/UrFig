import { Router } from 'express';
import { AuthController } from '../controllers/AuthController.js';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 */
router.post('/register', AuthController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT
 */
router.post('/login', AuthController.login);

export default router;
迫