import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="main-header">
      <div class="header-content">
        <div class="logo-area" routerLink="/">
          <span class="logo-brick">🧱</span>
          <span class="logo-text">UrFig</span>
        </div>
        
        <nav class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Builder</a>
          <a routerLink="/shop" routerLinkActive="active">Catalog</a>
          
          @if (authService.currentUser()) {
            <a routerLink="/history" routerLinkActive="active">My Orders</a>
            @if (authService.currentUser()?.role === 'admin') {
              <a routerLink="/admin" routerLinkActive="active">Admin</a>
            }
            <button class="logout-btn" (click)="authService.logout()">Logout ({{ authService.currentUser()?.name }})</button>
          } @else {
            <a routerLink="/login" routerLinkActive="active">Login</a>
          }
        </nav>
      </div>
    </header>

    <main class="content-wrapper">
      <router-outlet></router-outlet>
    </main>

    <footer class="main-footer">
      <p>&copy; 2026 UrFig - The Ultimate Lego Keychain Builder</p>
    </footer>
  `,
  styles: [`
    .main-header {
      background: #ffcf00;
      padding: 1rem 2rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo-area {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }
    .logo-brick { font-size: 2rem; }
    .logo-text { font-weight: 900; font-size: 1.5rem; letter-spacing: -1px; }
    .nav-links { display: flex; gap: 1.5rem; align-items: center; }
    .nav-links a { 
      text-decoration: none; color: #333; font-weight: 600; 
      padding: 0.5rem 1rem; border-radius: 4px; transition: 0.2s;
    }
    .nav-links a.active { background: rgba(0,0,0,0.1); }
    .logout-btn {
      background: transparent; border: 1px solid #333; cursor: pointer;
      padding: 0.4rem 0.8rem; border-radius: 4px; font-weight: bold;
    }
    .content-wrapper { min-height: 80vh; }
    .main-footer { text-align: center; padding: 2rem; background: #333; color: white; margin-top: 3rem; }
  `]
})
export class AppComponent {
  authService = inject(AuthService);
}
迫