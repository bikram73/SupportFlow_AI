export type NavTab = 'home' | 'analyze' | 'batch' | 'dashboard' | 'about' | 'qa';

export type UrgencyLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export type RoutingStatus = 'Auto-Routed' | 'Recommended' | 'Needs Review';

export type SupportedCategory = 
  | 'Technical Issue'
  | 'Billing'
  | 'Refund'
  | 'Account Access'
  | 'Password Reset'
  | 'Feature Request'
  | 'Bug Report'
  | 'Security Concern'
  | 'Sales Inquiry'
  | 'Subscription'
  | 'General Question'
  | 'Other';

export type SupportedTeam =
  | 'Technical Support'
  | 'Billing Team'
  | 'Engineering'
  | 'Security Team'
  | 'Sales Team'
  | 'Infrastructure Team'
  | 'Account Team'
  | 'Product Team'
  | 'Customer Success'
  | 'General Support';

export interface AnalyzedTicket {
  id: string;
  subject: string;
  body: string;
  category: SupportedCategory | string;
  urgency: UrgencyLevel;
  confidence: number;
  assignedTeam: SupportedTeam | string;
  humanReview: boolean;
  routingStatus: RoutingStatus;
  reason: string;
  timestamp?: string;
}

export interface BatchTicket {
  id: string;
  subject: string;
  body?: string;
  category: SupportedCategory | string;
  urgency: UrgencyLevel;
  confidence: number;
  assignedTeam: SupportedTeam | string;
  humanReview: boolean;
  routingStatus: RoutingStatus;
  reason: string;
  status?: string; // alias for backwards compatibility
}

export interface SampleTicketItem {
  id: string;
  subject: string;
  body: string;
  expectedCategory?: string;
  expectedUrgency?: string;
  expectedTeam?: string;
  expectedRouting?: RoutingStatus;
}

export interface RecentEvent {
  id: string;
  subject: string;
  category: string;
  urgency: UrgencyLevel;
  team: string;
  confidence: number;
  humanReview: boolean;
  routingStatus: RoutingStatus;
  status?: string;
  timestamp: string;
}

export interface QATestCase {
  id: string;
  group: string;
  name: string;
  subject: string;
  body: string;
  expectedCategory?: string;
  expectedUrgency?: string;
  expectedTeam?: string;
  expectedRoutingStatus?: RoutingStatus;
  expectedHumanReview?: boolean;
  minConfidence?: number;
  maxConfidence?: number;
  testType: 'functional' | 'boundary' | 'security' | 'ambiguous' | 'malformed' | 'unicode';
}

export interface QATestResult {
  testCase: QATestCase;
  actualResult?: AnalyzedTicket;
  passed: boolean;
  notes: string;
  latencyMs: number;
}
