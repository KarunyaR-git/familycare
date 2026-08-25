import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { DiaperRequest, DiaperResponse } from '../models/diaper.model';
import { StringLiteralLike } from 'typescript';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DiaperService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createDiaper(body: DiaperRequest) {
    return this.http.post<DiaperResponse>(`${this.apiUrl}/diapers`, body);
  }

  updateDiaper(id: string, body: DiaperRequest) {
    return this.http.patch<DiaperResponse>(`${this.apiUrl}/diapers/${id}`, body);
  }

  deleteDiaper(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/diapers/${id}`);
  }
  
}
