import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="history-container">
      @if (!authService.currentUser()) {
        <div class="alert">Please log in to view your profile.</div>
      } @else {
        <div class="tabs">
          <button [class.active]="activeTab() === 'orders'" (click)="activeTab.set('orders')">Order History</button>
          <button [class.active]="activeTab() === 'designs'" (click)="activeTab.set('designs')">Saved Designs</button>
        </div>

        @if (activeTab() === 'orders') {
          <h2>My Order History</h2>
          @if (loading()) {
            <p>Loading your orders...</p>
          } @else {
            <div class="orders-list">
              @for (order of orders(); track order._id) {
                <div class="order-card">
                  <div class="order-head">
                    <span class="order-id">#{{ order._id.slice(-6).toUpperCase() }}</span>
                    <span class="status-badge" [class]="order.status">{{ order.status }}</span>
                    <span class="date">{{ order.createdAt | date }}</span>
                  </div>
                  
                  <div class="order-items">
                    @for (item of order.items; track $index) {
                      <div class="item-summary">
                        @if (item.customKeychain) {
                          <span>Custom Lego Keychain (x{{ item.quantity }})</span>
                        } @else {
                          <span>{{ item.product?.name }} (x{{ item.quantity }})</span>
                        }
                        <strong>\${{ item.subtotal }}</strong>
                      </div>
                    }
                  </div>

                  <div class="order-total">
                    <span>Total:</span>
                    <strong>\${{ order.totalAmount }}</strong>
                  </div>
                </div>
              } @empty {
                <p>You haven't placed any orders yet.</p>
              }
            </div>
          }
        } @else {
          <h2>My Saved Designs</h2>
          <div class="designs-grid">
            @for (design of savedDesigns(); track design._id) {
              <div class="design-card">
                <div class="design-preview">
                  <img [src]="design.legs?.imageUrl" class="l-layer">
                  <img [src]="design.torso?.imageUrl" class="l-layer">
                  <img [src]="design.head?.imageUrl" class="l-layer">
                </div>
                <div class="design-info">
                  <strong>{{ design.name }}</strong>
                  <button class="load-btn">Load in Builder</button>
                </div>
              </div>
            } @empty {
              <p>No saved designs yet.</p>
            }
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .history-container { max-width: 800px; margin: 2rem auto; padding: 1rem; }
    .tabs { display: flex; gap: 1rem; margin-bottom: 2rem; border-bottom: 2px solid #eee; }
    .tabs button { padding: 1rem; border: none; background: none; cursor: pointer; font-weight: bold; }
    .tabs button.active { color: #ffcf00; border-bottom: 3px solid #ffcf00; }
    .order-card { 
      background: white; border-radius: 8px; margin-bottom: 1.5rem; 
      box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;
    }
    .order-head { 
      background: #f8f9fa; padding: 1rem; display: flex; 
      justify-content: space-between; align-items: center;
      border-bottom: 1px solid #eee;
    }
    .order-id { font-weight: bold; color: #ffcf00; }
    .status-badge { 
      padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.8rem; 
      text-transform: uppercase; font-weight: bold;
    }
    .status-badge.pending { background: #fff3cd; color: #856404; }
    .status-badge.shipped { background: #d1ecf1; color: #0c5460; }
    .status-badge.delivered { background: #d4edda; color: #155724; }
    .order-items { padding: 1rem; }
    .item-summary { 
      display: flex; justify-content: space-between; 
      padding: 0.5rem 0; border-bottom: 1px dashed #eee;
    }
    .order-total { padding: 1rem; background: #fffdf0; display: flex; justify-content: flex-end; gap: 1rem; align-items: center; }
    
    .designs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.5rem; }
    .design-card { background: white; padding: 1rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center; }
    .design-preview { height: 150px; position: relative; background: #f0f0f0; border-radius: 8px; margin-bottom: 1rem; }
    .l-layer { position: absolute; width: 60%; left: 20%; bottom: 10%; }
    .design-info { display: flex; flex-direction: column; gap: 0.5rem; }
    .load-btn { background: #ffcf00; border: none; padding: 0.5rem; border-radius: 4px; font-weight: bold; cursor: pointer; }
  `]
})
export class OrderHistoryComponent implements OnInit {
  orderService = inject(OrderService);
  authService = inject(AuthService);
  userService = inject(UserService);
  
  activeTab = signal<'orders' | 'designs'>('orders');
  orders = signal<any[]>([]);
  savedDesigns = signal<any[]>([]);
  loading = signal(false);

  async ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      await Promise.all([
        this.loadOrders(user.email),
        this.loadDesigns()
      ]);
    }
  }

  async loadOrders(email: string) {
    this.loading.set(true);
    try {
      const data = await this.orderService.getMyOrders(email);
      this.orders.set(data);
    } catch (err) { console.error(err); }
    finally { this.loading.set(false); }
  }

  async loadDesigns() {
    try {
      const data = await this.userService.getSavedDesigns();
      this.savedDesigns.set(data);
    } catch (err) { console.error(err); }
  }
}
迫