import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { FeedingRequest, FeedingResponse } from '../models/feeding.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FeedingService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createFeeding(body: FeedingRequest) {
    return this.http.post<FeedingResponse>(`${this.apiUrl}/feedings`, body);
  }

  updateFeeding(id: string, body: FeedingRequest) {
    return this.http.patch<FeedingResponse>(`${this.apiUrl}/feedings/${id}`, body);
  }

  deleteFeeding(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/feedings/${id}`);
  }
}
