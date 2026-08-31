import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BabyReport, HomeDashboard, HomeDashboardBabyDetails, TodayActivities, TodayBabyActivities } from '../models/home-dasboard-response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getHomeDashboardDetails(): Observable<HomeDashboard>{
    return this.http.get<HomeDashboard>(`${this.apiUrl}/home/dashboard`);
  }

  getHomeDashboardBabyDetails(babyId: string): Observable<HomeDashboardBabyDetails>{
    return this.http.get<HomeDashboardBabyDetails>(`${this.apiUrl}/home/dashboard/${babyId}`);
  }

  getTodayActivities(babyId: string): Observable<TodayBabyActivities>{
    return this.http.get<TodayBabyActivities>(`${this.apiUrl}/home/dashboard/${babyId}/today-activities`);
  }

  getBabyReport(babyId: string, period: string): Observable<BabyReport>{
    return this.http.get<BabyReport>(`${this.apiUrl}/home/dashboard/${babyId}/report?period=${period}`);
  }
}
