export interface SleepRequest {
  sleptAt?: string;
  sleepNotes?: string;
  wokeUpAt?: string;
  wokeUpNotes?: string;
  babyId: string;
}

export interface SleepResponse {
  _id: string;
  sleptAt?: string;
  sleepNotes?: string;
  wokeUpAt?: string;
  wokeUpNotes?: string;
  babyId: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}