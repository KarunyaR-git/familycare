import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ReminderResponse } from '../models/reminder-response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReminderService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient){}

  getAllReminders(status:string, page:number, sortBy:string, order: string): Observable<ReminderResponse> {
    return this.http.get<ReminderResponse>(`${this.apiUrl}/reminders?status=${status}&page=${page}&limit=2&sortBy=${sortBy}&order=${order}`);
  }
}
