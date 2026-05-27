import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface CheckoutData {
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  items: any[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:5000/api/orders';

  async placeOrder(data: CheckoutData) {
    return firstValueFrom(this.http.post<{ 
      message: string, 
      orderId: string, 
      total: number 
    }>(`${this.API_URL}/checkout`, data));
  }

  async getOrder(id: string) {
    return firstValueFrom(this.http.get<any>(`${this.API_URL}/${id}`));
  }

  async getAllOrders() {
    return firstValueFrom(this.http.get<any[]>(this.API_URL));
  }

  async updateStatus(id: string, status: string) {
    return firstValueFrom(this.http.patch<any>(`${this.API_URL}/${id}/status`, { status }));
  }

  async getMyOrders(email: string) {
    return firstValueFrom(this.http.get<any[]>(`${this.API_URL}/my-orders?email=${email}`));
  }
}
迫