import { Request, Response } from 'express';
import { OrderService } from '../services/OrderService.js';

export class OrderController {
  static async checkout(req: Request, res: Response) {
    try {
      const { customerName, customerEmail, shippingAddress, items } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }

      const order = await OrderService.createOrder({
        customerName,
        customerEmail,
        shippingAddress,
        items
      });

      res.status(201).json({
        message: 'Order placed successfully',
        orderId: order._id,
        total: order.totalAmount
      });
    } catch (error: any) {
      console.error('Checkout error:', error);
      res.status(500).json({ message: 'Failed to process order', error: error.message });
    }
  }

  static async getOrderDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order = await OrderService.getOrderById(id);
      
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      res.status(200).json(order);
    } catch (error: any) {
      res.status(500).json({ message: 'Error fetching order', error: error.message });
    }
  }
}
迫