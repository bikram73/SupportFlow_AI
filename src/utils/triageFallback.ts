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
    id: "ANL-1713",
    subject: "Cannot login",
    body: "I have tried resetting my password but I still cannot access my account."
  },
  {
    id: "ANL-1714",
    subject: "Refund request",
    body: "I was charged twice this month."
  },
  {
    id: "ANL-1715",
    subject: "Application crashes",
    body: "The application crashes every time I upload a PDF."
  },
  {
    id: "ANL-1716",
    subject: "Website Down",
    body: "None of our customers can access the portal."
  },
  {
    id: "ANL-1717",
    subject: "Feature Request",
    body: "Please add Dark Mode."
  },
  {
    id: "ANL-1718",
    subject: "Slow database query execution",
    body: "Our PostgreSQL queries in production us-east-1 are taking over 15 seconds."
  },
  {
    id: "ANL-1719",
    subject: "Security Alert: Unauthorized login attempts",
    body: "We detected 50 failed admin login attempts from unrecognized IP address 192.168.1.1."
  },
  {
    id: "ANL-1720",
    subject: "Help please",
    body: "It is broken and not working at all help."
  },
  {
    id: "ANL-1721",
    subject: "Invoice discrepancy and cannot login on phone",
    body: "My latest invoice shows wrong total amount and also my mobile app crashes on login screen."
  },
  {
    id: "ANL-1722",
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
      reason: "The ticket describes a critical platform availability outage, so it is categorized as Technical Issue and routed to the Infrastructure Team."
    };
  }
  if (text.includes("twice") || text.includes("refund") || text.includes("charged") || text.includes("invoice") || text.includes("vat")) {
    return {
      category: "Refund",
      urgency: "Medium",
      confidence: 95,
      assignedTeam: "Billing Team",
      humanReview: false,
      reason: "The customer reports a billing discrepancy and requests a refund, so the ticket is categorized as Refund and routed to the Billing Team."
    };
  }
  if (text.includes("crash") || text.includes("bug") || text.includes("upload") || text.includes("error 500")) {
    return {
      category: "Bug Report",
      urgency: "High",
      confidence: 93,
      assignedTeam: "Engineering",
      humanReview: false,
      reason: "The customer reports an unexpected application crash during file upload, so the ticket is categorized as Bug Report and routed to Engineering."
    };
  }
  if (text.includes("dark mode") || text.includes("feature") || text.includes("request")) {
    return {
      category: "Feature Request",
      urgency: "Low",
      confidence: 96,
      assignedTeam: "Product Team",
      humanReview: false,
      reason: "The user is proposing a new UI capability (Dark Mode), so the ticket is categorized as Feature Request and routed to the Product Team."
    };
  }
  if (text.includes("login") || text.includes("password") || text.includes("sso") || text.includes("saml")) {
    return {
      category: "Account Access",
      urgency: "Medium",
      confidence: 95,
      assignedTeam: "Account Team",
      humanReview: false,
      reason: "The ticket describes an authentication or password-access problem, so it is categorized as Account Access and routed to the Account Team."
    };
  }
  if (text.length < 30 || text.includes("help") || text.includes("broken")) {
    return {
      category: "General Question",
      urgency: "Low",
      confidence: 58,
      assignedTeam: "General Support",
      humanReview: true,
      reason: "The ticket lacks specific technical context or error messages, so it is categorized as General Question and flagged for human review."
    };
  }

  return {
    category: "General Question",
    urgency: "Low",
    confidence: 85,
    assignedTeam: "General Support",
    humanReview: false,
    reason: "The ticket is a general customer inquiry, so it is categorized as General Question and routed to General Support."
  };
}
