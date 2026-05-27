import { Order, IOrder, IOrderItem } from '../models/Order.js';
import { CustomizerService } from './CustomizerService.js';
import { Product } from '../models/Product.js';

export class OrderService {
  /**
   * Processes a new order: Validates prices server-side, checked stock, and saves to DB.
   */
  static async createOrder(orderData: {
    userId?: string;
    customerName: string;
    customerEmail: string;
    shippingAddress: string;
    items: any[]; // Raw items from cart
  }): Promise<IOrder> {
    const processedItems: IOrderItem[] = [];
    let grandTotal = 0;

    for (const item of orderData.items) {
      let subtotal = 0;

      if (item.type === 'custom' && item.customConfig) {
        // 1. Server-side Price Re-calculation for security
        const partIds = [
          item.customConfig.headId,
          item.customConfig.torsoId,
          item.customConfig.legsId,
          item.customConfig.accessoryId
        ].filter(id => !!id);

        const officialPrice = await CustomizerService.calculateConfigurationPrice(partIds);
        subtotal = officialPrice * item.quantity;

        processedItems.push({
          customKeychain: {
            head: item.customConfig.headId,
            torso: item.customConfig.torsoId,
            legs: item.customConfig.legsId,
            accessory: item.customConfig.accessoryId,
            customText: item.customConfig.customText,
            price: officialPrice
          },
          quantity: item.quantity,
          subtotal: parseFloat(subtotal.toFixed(2))
        });
      } else if (item.type === 'ready-made' && item.productId) {
        // 2. Ready-made product price verification
        const product = await Product.findById(item.productId);
        if (!product) throw new Error(`Product ${item.productId} not found`);
        
        subtotal = product.price * item.quantity;
        processedItems.push({
          product: item.productId,
          quantity: item.quantity,
          subtotal: parseFloat(subtotal.toFixed(2))
        });
      }

      grandTotal += subtotal;
    }

    // 3. Create and Save the Order
    const newOrder = new Order({
      user: orderData.userId,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      shippingAddress: orderData.shippingAddress,
      items: processedItems,
      totalAmount: parseFloat(grandTotal.toFixed(2)),
      status: 'pending'
    });

    return await newOrder.save();
  }

  static async getOrderById(orderId: string) {
    return await Order.findById(orderId)
      .populate('items.customKeychain.head')
      .populate('items.customKeychain.torso')
      .populate('items.customKeychain.legs')
      .populate('items.customKeychain.accessory')
      .populate('items.product');
  }

  static async getAllOrders() {
    return await Order.find()
      .sort({ createdAt: -1 })
      .populate('items.customKeychain.head')
      .populate('items.customKeychain.torso')
      .populate('items.customKeychain.legs')
      .populate('items.customKeychain.accessory')
      .populate('items.product');
  }

  static async updateOrderStatus(orderId: string, status: string) {
    return await Order.findByIdAndUpdate(orderId, { status }, { new: true });
  }

  static async getOrdersByEmail(email: string) {
    return await Order.find({ customerEmail: email })
      .sort({ createdAt: -1 })
      .populate('items.customKeychain.head')
      .populate('items.customKeychain.torso')
      .populate('items.customKeychain.legs')
      .populate('items.customKeychain.accessory')
      .populate('items.product');
  }
}
迫