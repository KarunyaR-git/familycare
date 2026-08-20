import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { CreateOrUpdateReminderResponse, ReminderRequest, ReminderResponse, UpdateReminderRequest } from '../models/reminder-response.model';
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

  createReminder(body:ReminderRequest): Observable<CreateOrUpdateReminderResponse> {
    return this.http.post<CreateOrUpdateReminderResponse>(`${this.apiUrl}/reminders`, body);
  }

  updateReminder(id: string, body:UpdateReminderRequest): Observable<CreateOrUpdateReminderResponse> {
    return this.http.put<CreateOrUpdateReminderResponse>(`${this.apiUrl}/reminders/${id}`, body);
  }

  deleteReminder(id: string) {
    return this.http.delete(`${this.apiUrl}/reminders/${id}`);
  }
}
