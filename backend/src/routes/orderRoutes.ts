import { Router } from 'express';
import { OrderController } from '../controllers/OrderController.js';
import { authenticate, isAdmin } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * @route   POST /api/orders/checkout
 * @desc    Process a checkout and create an order
 */
router.post('/checkout', OrderController.checkout);

/**
 * @route   GET /api/orders/my-orders
 * @desc    Get order history for a specific customer
 */
router.get('/my-orders', OrderController.getMyOrders);

/**
 * @route   GET /api/orders
 * @desc    Get all orders (Admin)
 */
router.get('/', authenticate, isAdmin, OrderController.listOrders);

/**
 * @route   GET /api/orders/:id
 * @desc    Get full details of a specific order
 */
router.get('/:id', OrderController.getOrderDetails);

/**
 * @route   PATCH /api/orders/:id/status
 * @desc    Update order status (Admin)
 */
router.patch('/:id/status', OrderController.updateStatus);

export default router;
迫