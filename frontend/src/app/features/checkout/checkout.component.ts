import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { PromoService } from '../../core/services/promo.service';
import { signal } from '@angular/core';

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
  private promoService = inject(PromoService);
  private router = inject(Router);

  checkoutForm: FormGroup = this.fb.group({
    customerName: ['', [Validators.required, Validators.minLength(3)]],
    customerEmail: ['', [Validators.required, Validators.email]],
    shippingAddress: ['', [Validators.required, Validators.minLength(10)]],
    promoCode: [''],
    paymentMethod: ['cod', Validators.required]
  });

  cartItems = this.cartService.items;
  totalAmount = this.cartService.totalAmount;
  
  appliedPromo = signal<any>(null);
  discountAmount = signal(0);
  finalTotal = signal(0);

  isSubmitting = false;

  constructor() {
    this.updateTotals();
  }

  updateTotals() {
    const baseTotal = this.totalAmount();
    let discount = 0;
    
    if (this.appliedPromo()) {
      const promo = this.appliedPromo();
      if (promo.discountType === 'percentage') {
        discount = baseTotal * (promo.discountValue / 100);
      } else {
        discount = promo.discountValue;
      }
    }
    
    this.discountAmount.set(discount);
    this.finalTotal.set(Math.max(0, baseTotal - discount));
  }

  async applyPromo() {
    const code = this.checkoutForm.get('promoCode')?.value;
    if (!code) return;

    try {
      const promo = await this.promoService.validateCode(code);
      this.appliedPromo.set(promo);
      this.updateTotals();
      alert('Promo code applied!');
    } catch (err) {
      alert('Invalid promo code');
      this.appliedPromo.set(null);
      this.updateTotals();
    }
  }

  async onSubmit() {
    if (this.checkoutForm.invalid || this.cartItems().length === 0) {
      return;
    }

    this.isSubmitting = true;

    try {
      const orderData = {
        ...this.checkoutForm.value,
        items: this.cartItems(),
        promoCode: this.appliedPromo()?.code
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