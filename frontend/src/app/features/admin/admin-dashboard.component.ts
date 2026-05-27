import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { FormsModule } from '@angular/forms';
import { PartUploadComponent } from './part-upload.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, PartUploadComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  private orderService = inject(OrderService);

  orders = signal<any[]>([]);
  loading = signal(true);

  async ngOnInit() {
    await this.loadOrders();
  }

  async loadOrders() {
    try {
      const data = await this.orderService.getAllOrders();
      this.orders.set(data);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      this.loading.set(false);
    }
  }

  async onStatusChange(orderId: string, event: Event) {
    const newStatus = (event.target as HTMLSelectElement).value;
    try {
      await this.orderService.updateStatus(orderId, newStatus);
      // Refresh local state or just show toast
      alert('Status updated to ' + newStatus);
    } catch (err) {
      alert('Failed to update status');
    }
  }

  /**
   * Helper to identify if an order contains custom items that need assembly
   */
  hasCustomItems(order: any): boolean {
    return order.items.some((item: any) => !!item.customKeychain);
  }
}
迫