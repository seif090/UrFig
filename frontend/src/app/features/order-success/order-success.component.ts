import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-success.component.html',
  styleUrl: './order-success.component.css'
})
export class OrderSuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);

  order = signal<any>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  async ngOnInit() {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (!orderId) {
      this.error.set('Order ID not found.');
      this.loading.set(false);
      return;
    }

    try {
      const data = await this.orderService.getOrder(orderId);
      this.order.set(data);
    } catch (err) {
      console.error('Failed to load order:', err);
      this.error.set('Could not load order details.');
    } finally {
      this.loading.set(false);
    }
  }
}
迫