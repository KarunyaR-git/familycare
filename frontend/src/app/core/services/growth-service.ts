import { Injectable } from '@angular/core';
import { GrowthRequest, GrowthResponse } from '../models/growth.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GrowthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createGrowth(body: GrowthRequest) {
    return this.http.post<GrowthResponse>(`${this.apiUrl}/growths`, body);
  }

  updateGrowth(id: string, body: GrowthRequest) {
    return this.http.patch<GrowthResponse>(`${this.apiUrl}/growths/${id}`, body);
  }

  deleteGrowth(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/growths/${id}`);
  }
}
