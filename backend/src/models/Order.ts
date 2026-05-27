import { Schema, model, Document, Types } from 'mongoose';

interface ICustomKeychainItem {
  head: Types.ObjectId;
  torso: Types.ObjectId;
  legs: Types.ObjectId;
  accessory?: Types.ObjectId;
  customText?: string;
  price: number;
}

export interface IOrderItem {
  product?: Types.ObjectId; // Reference to Product if ready-made
  customKeychain?: ICustomKeychainItem; // Configuration if custom
  quantity: number;
  subtotal: number;
}

export interface IOrder extends Document {
  user?: Types.ObjectId;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  items: IOrderItem[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product' },
  customKeychain: {
    head: { type: Schema.Types.ObjectId, ref: 'LegoPart' },
    torso: { type: Schema.Types.ObjectId, ref: 'LegoPart' },
    legs: { type: Schema.Types.ObjectId, ref: 'LegoPart' },
    accessory: { type: Schema.Types.ObjectId, ref: 'LegoPart' },
    customText: { type: String },
    price: { type: Number }
  },
  quantity: { type: Number, required: true, min: 1 },
  subtotal: { type: Number, required: true }
}, { _id: false });

const OrderSchema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  shippingAddress: { type: String, required: true },
  items: [OrderItemSchema],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });

export const Order = model<IOrder>('Order', OrderSchema);
