import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { VaccinationRequest, VaccinationResponse } from '../models/vaccination.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VaccinationService {
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) {}

  createVaccination(body: VaccinationRequest) {
    return this.http.post<VaccinationResponse>(`${this.apiUrl}/vaccinations`, body);
  }

  updateVaccination(id: string, body: VaccinationRequest) {
    return this.http.patch<VaccinationResponse>(`${this.apiUrl}/vaccinations/${id}`, body);
  }

  deleteVaccination(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/vaccinations/${id}`);
  }
}
