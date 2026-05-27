import { Injectable, signal, computed, effect } from '@angular/core';
import { CartItem } from '../models/cart.model';
import { CustomKeychainState } from '../models/customizer.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'urfig_cart';

  // State
  private cartItems = signal<CartItem[]>(this.loadFromStorage());

  // Derived signals
  readonly items = computed(() => this.cartItems());
  readonly itemCount = computed(() => this.cartItems().reduce((acc, item) => acc + item.quantity, 0));
  readonly totalAmount = computed(() => 
    parseFloat(this.cartItems().reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2))
  );

  constructor() {
    // Automatically sync to local storage whenever cartItems change
    effect(() => {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cartItems()));
    });
  }

  /**
   * Adds a custom-built keychain to the cart
   */
  addCustomKeychain(state: CustomKeychainState) {
    const newItem: CartItem = {
      id: crypto.randomUUID(),
      type: 'custom',
      name: 'Custom Lego Keychain',
      price: state.totalPrice,
      quantity: 1,
      imageUrl: state.torso?.imageUrl || 'assets/placeholder-keychain.png', // Torso is usually best for preview
      customConfig: {
        headId: state.head!.id,
        torsoId: state.torso!.id,
        legsId: state.legs!.id,
        accessoryId: state.accessory?.id,
        customText: state.customText,
        partsMetadata: {
          head: state.head,
          torso: state.torso,
          legs: state.legs,
          accessory: state.accessory
        }
      }
    };

    this.cartItems.update(items => [...items, newItem]);
  }

  /**
   * Adds a ready-made product to the cart
   */
  addProduct(product: { _id: string, name: string, price: number, imageUrl: string }) {
    this.cartItems.update(items => {
      const existing = items.find(i => i.productId === product._id);
      if (existing) {
        return items.map(i => i.productId === product._id 
          ? { ...i, quantity: i.quantity + 1 } 
          : i
        );
      }
      return [...items, {
        id: crypto.randomUUID(),
        type: 'ready-made',
        name: product.name,
        price: product.price,
        quantity: 1,
        imageUrl: product.imageUrl,
        productId: product._id
      }];
    });
  }

  /**
   * Remove item from cart
   */
  removeItem(itemId: string) {
    this.cartItems.update(items => items.filter(i => i.id !== itemId));
  }

  /**
   * Update quantity
   */
  updateQuantity(itemId: string, delta: number) {
    this.cartItems.update(items => items.map(item => {
      if (item.id === itemId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  }

  /**
   * Clear cart
   */
  clear() {
    this.cartItems.set([]);
  }

  private loadFromStorage(): CartItem[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }
}
迫