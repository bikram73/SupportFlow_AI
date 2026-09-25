export interface TriageResult {
  category: string;
  urgency: 'Critical' | 'High' | 'Medium' | 'Low';
  confidence: number;
  assignedTeam: string;
  humanReview: boolean;
  reason: string;
}

export const DEFAULT_SAMPLE_TICKETS = [
  {
    id: "TK-1001",
    subject: "Cannot login",
    body: "I have tried resetting my password but I still cannot access my account."
  },
  {
    id: "TK-1002",
    subject: "Refund request",
    body: "I was charged twice this month."
  },
  {
    id: "TK-1003",
    subject: "Application crashes",
    body: "The application crashes every time I upload a PDF."
  },
  {
    id: "TK-1004",
    subject: "Website Down",
    body: "None of our customers can access the portal."
  },
  {
    id: "TK-1005",
    subject: "Feature Request",
    body: "Please add Dark Mode."
  },
  {
    id: "TK-1006",
    subject: "Slow database query execution",
    body: "Our PostgreSQL queries in production us-east-1 are taking over 15 seconds."
  },
  {
    id: "TK-1007",
    subject: "Security Alert: Unauthorized login attempts",
    body: "We detected 50 failed admin login attempts from unrecognized IP address 192.168.1.1."
  },
  {
    id: "TK-1008",
    subject: "Help please",
    body: "It is broken and not working at all help."
  },
  {
    id: "TK-1009",
    subject: "Invoice discrepancy and cannot login on phone",
    body: "My latest invoice shows wrong total amount and also my mobile app crashes on login screen."
  },
  {
    id: "TK-1010",
    subject: "API Rate limit exceeded on Enterprise Tier",
    body: "Our system is returning HTTP 429 Too Many Requests despite paying for tier 3 limits."
  }
];

export function ruleBasedTriage(subject: string, body: string): TriageResult {
  const text = `${subject} ${body}`.toLowerCase();

  if (text.includes("down") || text.includes("outage") || (text.includes("portal") && text.includes("access")) || text.includes("completely down")) {
    return {
      category: "Technical Issue",
      urgency: "Critical",
      confidence: 99,
      assignedTeam: "Infrastructure Team",
      humanReview: false,
      reason: "Critical infrastructure outage reported impacting platform accessibility."
    };
  }
  if (text.includes("twice") || text.includes("refund") || text.includes("charged") || text.includes("invoice") || text.includes("vat")) {
    return {
      category: "Billing",
      urgency: "Medium",
      confidence: 98,
      assignedTeam: "Billing Team",
      humanReview: false,
      reason: "Billing discrepancy or refund request detected."
    };
  }
  if (text.includes("crash") || text.includes("bug") || text.includes("upload") || text.includes("error 500")) {
    return {
      category: "Bug Report",
      urgency: "High",
      confidence: 93,
      assignedTeam: "Engineering",
      humanReview: false,
      reason: "Application crash or software error in active workflow."
    };
  }
  if (text.includes("dark mode") || text.includes("feature") || text.includes("request")) {
    return {
      category: "Feature Request",
      urgency: "Low",
      confidence: 96,
      assignedTeam: "Product Team",
      humanReview: false,
      reason: "User requesting new feature or enhancement."
    };
  }
  if (text.includes("login") || text.includes("password") || text.includes("sso") || text.includes("saml")) {
    return {
      category: "Account Access",
      urgency: "Medium",
      confidence: 95,
      assignedTeam: "Account Team",
      humanReview: false,
      reason: "User authentication or password reset issue."
    };
  }
  if (text.length < 30 || text.includes("help") || text.includes("broken")) {
    return {
      category: "General Question",
      urgency: "Low",
      confidence: 58,
      assignedTeam: "General Support",
      humanReview: true,
      reason: "Description is vague or lacks sufficient technical details. Human review recommended."
    };
  }

  return {
    category: "General Question",
    urgency: "Low",
    confidence: 85,
    assignedTeam: "General Support",
    humanReview: false,
    reason: "General customer inquiry processed using fallback classification rules."
  };
}
