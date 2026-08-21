import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { BabyRequest, BabyResponse } from '../models/baby.model';

@Injectable({
  providedIn: 'root',
})
export class BabyService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createBaby(body: BabyRequest) {
    return this.http.post<BabyResponse>(`${this.apiUrl}/babies`, body);
  }

  updateBaby(id: string, body: BabyRequest) {
    return this.http.patch<BabyResponse>(`${this.apiUrl}/babies/${id}`, body);
  }
  
}
