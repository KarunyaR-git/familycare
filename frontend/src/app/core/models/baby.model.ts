export interface BabyRequest {
  name: string;
  gender: 'boy' | 'girl';
  dob: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
}

export interface BabyResponse {
  _id: string;
  name: string;
  gender: 'boy' | 'girl';
  dob: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
  userId: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}