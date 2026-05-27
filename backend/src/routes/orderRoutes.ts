import { Router } from 'express';
import { OrderController } from '../controllers/OrderController.js';

const router = Router();

/**
 * @route   POST /api/orders/checkout
 * @desc    Process a checkout and create an order
 */
router.post('/checkout', OrderController.checkout);

/**
 * @route   GET /api/orders/:id
 * @desc    Get full details of a specific order
 */
router.get('/:id', OrderController.getOrderDetails);

export default router;
迫