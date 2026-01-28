export type DealStage = 
  | "leads_discovered" 
  | "qualified_leads" 
  | "contact_initiated" 
  | "needs_identified" 
  | "negotiation" 
  | "deal_finalized";

export interface Deal {
  id: number;
  companyName: string;
  amount: number; // Amount in dollars
  date: string; // ISO date string
  stage: DealStage;
  tag?: string; // Company tag/pill text
  assignedUser?: {
    id: number;
    name: string;
    avatar?: string;
    avatarUrl?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface DealsResponse {
  success: boolean;
  data: {
    deals: Deal[];
  };
}
