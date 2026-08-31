import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { SleepRequest, SleepResponse } from '../models/sleep.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SleepService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createSleep(body: SleepRequest) {
    return this.http.post<SleepResponse>(`${this.apiUrl}/sleeps`, body);
  }

  updateSleep(id: string, body: SleepRequest) {
    return this.http.patch<SleepResponse>(`${this.apiUrl}/sleeps/${id}`, body);
  }

  deleteSleep(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/sleeps/${id}`);
  }
}

