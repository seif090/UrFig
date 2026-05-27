import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:5000/api/user';

  async saveDesign(design: any) {
    return firstValueFrom(this.http.post<any>(`${this.API_URL}/saved-designs`, design));
  }

  async getSavedDesigns() {
    return firstValueFrom(this.http.get<any[]>(`${this.API_URL}/saved-designs`));
  }
}
迫