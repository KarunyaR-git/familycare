import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { HomeDashboard, HomeDashboardBabyDetails } from '../models/home-dasboard-response';
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
}
