import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomizerService } from '../../core/services/customizer.service';
import { CartService } from '../../core/services/cart.service';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { SelectedLegoPart } from '../../core/models/customizer.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './builder.component.html',
  styleUrl: './builder.component.css'
})
export class BuilderComponent implements OnInit {
  private customizerService = inject(CustomizerService);
  private cartService = inject(CartService);
  private userService = inject(UserService);
  authService = inject(AuthService);

  // Available parts fetched from the backend
  parts = signal<{
    heads: SelectedLegoPart[],
    torsos: SelectedLegoPart[],
    legs: SelectedLegoPart[],
    accessories: SelectedLegoPart[]
  } | null>(null);

  // Active tab in the selection menu
  activeTab = signal<'head' | 'torso' | 'legs' | 'accessory'>('head');

  // Expose signals from the service to the template
  currentConfig = this.customizerService.currentConfiguration;
  totalPrice = this.customizerService.totalPrice;
  isComplete = this.customizerService.isComplete;

  async ngOnInit() {
    try {
      const data = await this.customizerService.getAvailableParts();
      this.parts.set(data);
    } catch (error) {
      console.error('Failed to load parts', error);
    }
  }

  selectTab(tab: 'head' | 'torso' | 'legs' | 'accessory') {
    this.activeTab.set(tab);
  }

  onPartSelect(part: SelectedLegoPart) {
    this.customizerService.selectPart(part);
  }

  onTextChange(event: Event) {
    const text = (event.target as HTMLInputElement).value;
    this.customizerService.setCustomText(text);
  }

  async saveDesign() {
    if (!this.authService.currentUser()) {
      alert('Please log in to save your design!');
      return;
    }

    const name = prompt('Name your design:', 'My Keychain');
    if (!name) return;

    const config = this.currentConfig();
    try {
      await this.userService.saveDesign({
        name,
        headId: config.head?.id,
        torsoId: config.torso?.id,
        legsId: config.legs?.id,
        accessoryId: config.accessory?.id
      });
      alert('Design saved to your profile!');
    } catch (err) {
      alert('Failed to save design');
    }
  }

  addToCart() {
    if (this.isComplete()) {
      this.cartService.addCustomKeychain(this.currentConfig());
      alert('Custom keychain added to cart!');
      this.customizerService.reset();
    }
  }
}
