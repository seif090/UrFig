import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  private fb = inject(FormBuilder);
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  checkoutForm: FormGroup = this.fb.group({
    customerName: ['', [Validators.required, Validators.minLength(3)]],
    customerEmail: ['', [Validators.required, Validators.email]],
    shippingAddress: ['', [Validators.required, Validators.minLength(10)]]
  });

  cartItems = this.cartService.items;
  totalAmount = this.cartService.totalAmount;

  isSubmitting = false;

  async onSubmit() {
    if (this.checkoutForm.invalid || this.cartItems().length === 0) {
      return;
    }

    this.isSubmitting = true;

    try {
      const orderData = {
        ...this.checkoutForm.value,
        items: this.cartItems()
      };

      const response = await this.orderService.placeOrder(orderData);
      
      this.cartService.clear();
      
      // Navigate to success page with the order ID
      this.router.navigate(['/order-success', response.orderId]);
    } catch (error) {
      console.error('Checkout failed', error);
      alert('Failed to place order. Please try again.');
    } finally {
      this.isSubmitting = false;
    }
  }
}
迫