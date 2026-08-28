import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { BabyRequest, BabyResponse } from '../models/baby.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BabyService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getBaby(babyId: string) {
    return this.http.get<BabyResponse>(`${this.apiUrl}/babies/${babyId}`);
  }

  createBaby(body: BabyRequest) {
    return this.http.post<BabyResponse>(`${this.apiUrl}/babies`, body);
  }

  updateBaby(id: string, body: BabyRequest) {
    return this.http.patch<BabyResponse>(`${this.apiUrl}/babies/${id}`, body);
  }

  deleteBaby(babyId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/babies/${babyId}`);
  }
  
}
