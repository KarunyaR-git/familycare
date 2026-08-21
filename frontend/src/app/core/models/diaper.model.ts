export interface DiaperRequest {
  changedAt: string;
  type: 'wet' | 'dirty' | 'both';
  notes?: string;
  babyId: string;
}

export interface DiaperResponse {
  _id: string;
  changedAt: string;
  type: 'wet' | 'dirty' | 'both';
  notes?: string;
  babyId: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}