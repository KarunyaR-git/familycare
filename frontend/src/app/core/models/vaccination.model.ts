export interface VaccinationRequest {
  vaccineAt: string;
  name: string;
  doseNumber: number;
  notes?: string;
  babyId: string;
}

export interface VaccinationResponse {
  _id: string;
  vaccineAt: string;
  name: string;
  doseNumber: number;
  notes?: string;
  babyId: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}