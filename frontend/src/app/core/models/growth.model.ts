export interface GrowthRequest {
  measuredAt: string;
  weight: number;
  height: number;
  notes?: string;
  babyId: string;
}

export interface GrowthResponse {
  _id: string;
  measuredAt: string;
  weight: number;
  height: number;
  notes?: string;
  babyId: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}