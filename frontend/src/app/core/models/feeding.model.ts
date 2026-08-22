export interface FeedingRequest {
  type: "breastfeeding" | "formula" | "solid" | "water" | "other";
  feedingAt: string;
  foodName?: string;
  quantity?: number;
  unit?: "ml" | "oz" | "gram" | "spoon" | "piece" | "serving" | "other";
  duration?: number;
  breastfeedingSide?: "left" | "right" | "both";
  notes?: string;
  babyId: string;
}

export interface FeedingResponse {
  _id: string;
  type: "breastfeeding" | "formula" | "solid" | "water" | "other";
  feedingAt: string;
  foodName?: string;
  quantity?: number;
  unit?: "ml" | "oz" | "gram" | "spoon" | "piece" | "serving" | "other";
  duration?: number;
  breastfeedingSide?: "left" | "right" | "both";
  notes?: string;
  babyId: string;      
  userId: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}