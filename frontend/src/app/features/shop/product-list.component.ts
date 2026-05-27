import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopService } from '../../core/services/shop.service';
import { CartService } from '../../core/services/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  private shopService = inject(ShopService);
  private cartService = inject(CartService);

  products = signal<any[]>([]);
  categories = signal<string[]>([]);
  
  searchQuery = signal('');
  selectedCategory = signal('All');
  loading = signal(true);

  async ngOnInit() {
    await Promise.all([
      this.loadCategories(),
      this.loadProducts()
    ]);
  }

  async loadCategories() {
    const cats = await this.shopService.getCategories();
    this.categories.set(['All', ...cats]);
  }

  async loadProducts() {
    this.loading.set(true);
    const data = await this.shopService.getProducts(this.searchQuery(), this.selectedCategory());
    this.products.set(data);
    this.loading.set(false);
  }

  onFilterChange() {
    this.loadProducts();
  }

  addToCart(product: any) {
    this.cartService.addProduct(product);
    alert(`${product.name} added to cart!`);
  }
}
迫