import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly API_URL = 'http://localhost:5000/api/auth';

  // Signals for state
  private currentUserSignal = signal<User | null>(this.loadUserFromStorage());
  private tokenSignal = signal<string | null>(localStorage.getItem('urfig_token'));

  readonly currentUser = computed(() => this.currentUserSignal());
  readonly isAuthenticated = computed(() => !!this.tokenSignal());
  readonly isAdmin = computed(() => this.currentUserSignal()?.role === 'admin');

  async register(credentials: any) {
    const res = await firstValueFrom(this.http.post<AuthResponse>(`${this.API_URL}/register`, credentials));
    this.handleAuthSuccess(res);
    return res;
  }

  async login(credentials: any) {
    const res = await firstValueFrom(this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials));
    this.handleAuthSuccess(res);
    return res;
  }

  logout() {
    localStorage.removeItem('urfig_token');
    localStorage.removeItem('urfig_user');
    this.tokenSignal.set(null);
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  private handleAuthSuccess(res: AuthResponse) {
    localStorage.setItem('urfig_token', res.token);
    localStorage.setItem('urfig_user', JSON.stringify(res.user));
    this.tokenSignal.set(res.token);
    this.currentUserSignal.set(res.user);
  }

  private loadUserFromStorage(): User | null {
    const user = localStorage.getItem('urfig_user');
    return user ? JSON.parse(user) : null;
  }
}
迫