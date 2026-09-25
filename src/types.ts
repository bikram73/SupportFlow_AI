export type NavTab = 'home' | 'analyze' | 'batch' | 'dashboard' | 'about';

export type UrgencyLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export interface AnalyzedTicket {
  id: string;
  subject: string;
  body: string;
  category: string;
  urgency: UrgencyLevel;
  confidence: number;
  assignedTeam: string;
  humanReview: boolean;
  reason: string;
  timestamp?: string;
}

export interface BatchTicket {
  id: string;
  subject: string;
  body?: string;
  category: string;
  urgency: UrgencyLevel;
  confidence: number;
  assignedTeam: string;
  humanReview: boolean;
  reason: string;
  status: 'Auto Routed' | 'Recommended' | 'Needs Review';
}

export interface SampleTicketItem {
  id: string;
  subject: string;
  body: string;
  expectedCategory?: string;
  expectedUrgency?: string;
  expectedTeam?: string;
}

export interface RecentEvent {
  id: string;
  subject: string;
  category: string;
  urgency: UrgencyLevel;
  team: string;
  confidence: number;
  humanReview: boolean;
  status: 'Auto Routed' | 'Recommended' | 'Needs Review';
  timestamp: string;
}
