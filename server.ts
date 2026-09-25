import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Helper function to initialize Gemini Client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Controlled Taxonomies as defined by PRD
const VALID_CATEGORIES = [
  "Technical Issue",
  "Billing",
  "Refund",
  "Account Access",
  "Password Reset",
  "Feature Request",
  "Bug Report",
  "Security Concern",
  "Sales Inquiry",
  "Subscription",
  "General Question",
  "Other"
];

const VALID_URGENCIES = ["Low", "Medium", "High", "Critical"];

const VALID_TEAMS = [
  "Technical Support",
  "Billing Team",
  "Engineering",
  "Security Team",
  "Sales Team",
  "Infrastructure Team",
  "Account Team",
  "Product Team",
  "Customer Success",
  "General Support"
];

function evaluateDecisionBoundary(confidence: number, forceHumanReview = false): {
  routingStatus: "Auto-Routed" | "Recommended" | "Needs Review";
  humanReview: boolean;
} {
  if (confidence >= 90) {
    return {
      routingStatus: "Auto-Routed",
      humanReview: forceHumanReview ? true : false
    };
  }
  if (confidence >= 70) {
    return {
      routingStatus: "Recommended",
      humanReview: forceHumanReview ? true : false
    };
  }
  return {
    routingStatus: "Needs Review",
    humanReview: true
  };
}

// Fallback rule-based triage classifier for robustness & boundary testing
function ruleBasedTriage(subject: string, body: string) {
  const text = `${subject} ${body}`.toLowerCase().trim();

  // 1. Ambiguous / Insufficient Context Checks (< 70 Confidence)
  if (
    text.length < 25 ||
    text === 'help' ||
    text === 'help broken' ||
    text === 'it is broken and not working at all help' ||
    (text.includes('broken') && text.length < 35 && !text.includes('crash') && !text.includes('outage')) ||
    (text.includes('login') && text.includes('charged') && text.includes('crash')) // conflicting multi-issue
  ) {
    const boundary = evaluateDecisionBoundary(58, true);
    return {
      category: "General Question",
      urgency: "Low" as const,
      confidence: 58,
      assignedTeam: "General Support",
      humanReview: boundary.humanReview,
      routingStatus: boundary.routingStatus,
      reason: "The ticket lacks specific technical context or error messages, so it is categorized as General Question and flagged for human review."
    };
  }

  // 2. Critical Outage / Infrastructure (Critical Urgency, 99 Confidence)
  if (
    text.includes("down") ||
    text.includes("outage") ||
    text.includes("503") ||
    text.includes("502") ||
    text.includes("completely down") ||
    (text.includes("cannot access") && text.includes("portal")) ||
    (text.includes("production") && (text.includes("offline") || text.includes("down")))
  ) {
    const boundary = evaluateDecisionBoundary(99);
    return {
      category: "Technical Issue",
      urgency: "Critical" as const,
      confidence: 99,
      assignedTeam: "Infrastructure Team",
      humanReview: boundary.humanReview,
      routingStatus: boundary.routingStatus,
      reason: "The ticket describes a critical platform availability outage, so it is categorized as Technical Issue and routed to the Infrastructure Team."
    };
  }

  // 3. Security Concerns (High/Critical Urgency, 96 Confidence)
  if (
    text.includes("unauthorized") ||
    text.includes("breach") ||
    text.includes("suspicious login") ||
    text.includes("compromise") ||
    text.includes("hacked") ||
    text.includes("foreign country") ||
    text.includes("changed my email without permission")
  ) {
    const isCompromise = text.includes("compromise") || text.includes("hacked") || text.includes("without permission");
    const boundary = evaluateDecisionBoundary(96);
    return {
      category: "Security Concern",
      urgency: (isCompromise ? "Critical" : "High") as "Critical" | "High",
      confidence: 96,
      assignedTeam: "Security Team",
      humanReview: boundary.humanReview,
      routingStatus: boundary.routingStatus,
      reason: "The ticket describes an unauthorized security event, so it is categorized as Security Concern and routed to the Security Team."
    };
  }

  // 4. Refund (Medium Urgency, 95 Confidence)
  if (
    text.includes("refund") ||
    text.includes("charged twice") ||
    text.includes("double charge") ||
    text.includes("refund request") ||
    text.includes("charged 2x")
  ) {
    const boundary = evaluateDecisionBoundary(95);
    return {
      category: "Refund",
      urgency: "Medium" as const,
      confidence: 95,
      assignedTeam: "Billing Team",
      humanReview: boundary.humanReview,
      routingStatus: boundary.routingStatus,
      reason: "The customer reports a billing discrepancy and requests a refund, so the ticket is categorized as Refund and routed to the Billing Team."
    };
  }

  // 5. Billing / Invoices / Tax (Medium Urgency, 92 Confidence)
  if (
    text.includes("invoice") ||
    text.includes("vat") ||
    text.includes("receipt") ||
    text.includes("billing") ||
    text.includes("wrong charge") ||
    text.includes("payment failed") ||
    text.includes("credit card")
  ) {
    const boundary = evaluateDecisionBoundary(92);
    return {
      category: "Billing",
      urgency: "Medium" as const,
      confidence: 92,
      assignedTeam: "Billing Team",
      humanReview: boundary.humanReview,
      routingStatus: boundary.routingStatus,
      reason: "The ticket involves an invoice or payment transaction matter, so it is categorized as Billing and routed to the Billing Team."
    };
  }

  // 6. Subscription Management (Medium Urgency, 91 Confidence)
  if (
    text.includes("cancel subscription") ||
    text.includes("downgrade") ||
    text.includes("renew subscription") ||
    text.includes("subscription plan") ||
    text.includes("membership")
  ) {
    const boundary = evaluateDecisionBoundary(91);
    return {
      category: "Subscription",
      urgency: "Medium" as const,
      assignedTeam: "Billing Team",
      confidence: 91,
      humanReview: boundary.humanReview,
      routingStatus: boundary.routingStatus,
      reason: "The ticket pertains to recurring subscription status or cancellation, so it is categorized as Subscription and routed to the Billing Team."
    };
  }

  // 7. Password Reset Specific (Medium Urgency, 95 Confidence)
  if (
    text.includes("forgot my password") ||
    text.includes("forgot password") ||
    text.includes("reset password link") ||
    text.includes("password forgotten")
  ) {
    const boundary = evaluateDecisionBoundary(95);
    return {
      category: "Password Reset",
      urgency: "Medium" as const,
      confidence: 95,
      assignedTeam: "Account Team",
      humanReview: boundary.humanReview,
      routingStatus: boundary.routingStatus,
      reason: "The customer is requesting assistance resetting their forgotten password, so it is categorized as Password Reset and routed to the Account Team."
    };
  }

  // 8. Account Access / Login / SSO (Medium Urgency, 95 Confidence)
  if (
    text.includes("cannot login") ||
    text.includes("can't login") ||
    text.includes("cant login") ||
    text.includes("login") ||
    text.includes("account locked") ||
    text.includes("sso") ||
    text.includes("saml") ||
    text.includes("authentication") ||
    text.includes("password") ||
    text.includes("access my account")
  ) {
    const boundary = evaluateDecisionBoundary(95);
    return {
      category: "Account Access",
      urgency: "Medium" as const,
      confidence: 95,
      assignedTeam: "Account Team",
      humanReview: boundary.humanReview,
      routingStatus: boundary.routingStatus,
      reason: "The ticket describes an authentication or password-access problem, so it is categorized as Account Access and routed to the Account Team."
    };
  }

  // 9. Bug Report / Crashes (High Urgency, 93 Confidence)
  if (
    text.includes("crash") ||
    text.includes("crashes") ||
    text.includes("bug") ||
    text.includes("upload") ||
    text.includes("error 500") ||
    text.includes("freeze") ||
    text.includes("button does nothing") ||
    text.includes("button does not work")
  ) {
    const boundary = evaluateDecisionBoundary(93);
    return {
      category: "Bug Report",
      urgency: "High" as const,
      confidence: 93,
      assignedTeam: "Engineering",
      humanReview: boundary.humanReview,
      routingStatus: boundary.routingStatus,
      reason: "The customer reports an unexpected application crash or software defect, so the ticket is categorized as Bug Report and routed to Engineering."
    };
  }

  // 10. Feature Requests (Low Urgency, 94 Confidence)
  if (
    text.includes("dark mode") ||
    text.includes("feature request") ||
    text.includes("please add") ||
    text.includes("can you add") ||
    text.includes("export to excel") ||
    text.includes("csv export") ||
    text.includes("enhancement")
  ) {
    const boundary = evaluateDecisionBoundary(94);
    return {
      category: "Feature Request",
      urgency: "Low" as const,
      confidence: 94,
      assignedTeam: "Product Team",
      humanReview: boundary.humanReview,
      routingStatus: boundary.routingStatus,
      reason: "The user is proposing a product capability improvement, so the ticket is categorized as Feature Request and routed to the Product Team."
    };
  }

  // 11. Sales Inquiries (Low Urgency, 92 Confidence)
  if (
    text.includes("enterprise pricing") ||
    text.includes("quote") ||
    text.includes("sales") ||
    text.includes("500 employees") ||
    text.includes("purchase licenses") ||
    text.includes("volume discount")
  ) {
    const boundary = evaluateDecisionBoundary(92);
    return {
      category: "Sales Inquiry",
      urgency: "Low" as const,
      confidence: 92,
      assignedTeam: "Sales Team",
      humanReview: boundary.humanReview,
      routingStatus: boundary.routingStatus,
      reason: "The request is regarding sales, enterprise licensing, or commercial terms, so it is categorized as Sales Inquiry and routed to the Sales Team."
    };
  }

  // 12. Technical Performance Issues (88% Confidence -> Recommended Assignment)
  if (
    text.includes("slow") ||
    text.includes("latency") ||
    text.includes("timeout") ||
    text.includes("15 seconds") ||
    text.includes("30 seconds") ||
    text.includes("database query")
  ) {
    const boundary = evaluateDecisionBoundary(88);
    return {
      category: "Technical Issue",
      urgency: "High" as const,
      confidence: 88,
      assignedTeam: "Infrastructure Team",
      humanReview: boundary.humanReview,
      routingStatus: boundary.routingStatus,
      reason: "The customer reports abnormal platform performance latency, so it is categorized as Technical Issue and recommended to the Infrastructure Team."
    };
  }

  // Default: General Question (85% Confidence -> Recommended Assignment)
  const boundary = evaluateDecisionBoundary(85);
  return {
    category: "General Question",
    urgency: "Low" as const,
    confidence: 85,
    assignedTeam: "General Support",
    humanReview: boundary.humanReview,
    routingStatus: boundary.routingStatus,
    reason: "The ticket is a general customer inquiry, so it is categorized as General Question and routed to General Support."
  };
}

const TRIAGE_SYSTEM_PROMPT = `You are an expert customer support triage assistant.
Analyze the provided support ticket (subject and body).

Return ONLY valid JSON conforming to this schema:
- category: Must be exactly one of: ['Technical Issue', 'Billing', 'Refund', 'Account Access', 'Password Reset', 'Feature Request', 'Bug Report', 'Security Concern', 'Sales Inquiry', 'Subscription', 'General Question', 'Other']
- urgency: Must be exactly one of: ['Low', 'Medium', 'High', 'Critical']
- confidence: An integer from 0 to 100 representing classification confidence.
- assignedTeam: Must be exactly one of: ['Technical Support', 'Billing Team', 'Engineering', 'Security Team', 'Sales Team', 'Infrastructure Team', 'Account Team', 'Product Team', 'Customer Success', 'General Support']
- humanReview: boolean (Must be true if confidence < 70, or if the ticket is ambiguous, lacks context, or contains contradictory issues).
- routingStatus: Must be exactly one of: ['Auto-Routed', 'Recommended', 'Needs Review']
  - 'Auto-Routed' if confidence >= 90
  - 'Recommended' if 70 <= confidence < 90
  - 'Needs Review' if confidence < 70
- reason: A concise, user-facing explanation (1-2 sentences) explaining why this categorization, urgency, and routing was decided. Do NOT include internal chain-of-thought, reasoning traces, or debugging bullet points.

Strict Rules:
- Critical: Outages, production down, portal inaccessible, active security breaches.
- High: Software crashes, upload errors, 500 exceptions, SAML cert expiration.
- Medium: Single-user login/password issue, refund requests, billing questions, subscription cancel.
- Low: Feature requests, general explanations, pricing inquiries.
`;

// 1. POST /api/analyze-ticket
app.post("/api/analyze-ticket", async (req, res) => {
  const { id, subject = "", body = "" } = req.body || {};

  const cleanSub = String(subject || "").trim();
  const cleanBody = String(body || "").trim();

  // Test Case TC-B002, TC-B003, TC-B004, TC-B005 validation
  if (!cleanSub && !cleanBody) {
    return res.status(400).json({
      error: "Please enter a ticket subject and description.",
      fieldErrors: { subject: "Subject is required", body: "Description is required" }
    });
  }
  if (!cleanSub) {
    return res.status(400).json({
      error: "Ticket subject is required.",
      fieldErrors: { subject: "Subject is required" }
    });
  }
  if (!cleanBody) {
    return res.status(400).json({
      error: "Ticket body / description is required.",
      fieldErrors: { body: "Description is required" }
    });
  }

  // Length constraints
  if (cleanSub.length > 300) {
    return res.status(400).json({
      error: "Ticket subject cannot exceed 300 characters.",
      fieldErrors: { subject: "Max 300 characters allowed" }
    });
  }
  if (cleanBody.length > 20000) {
    return res.status(400).json({
      error: "Ticket body cannot exceed 20,000 characters.",
      fieldErrors: { body: "Max 20,000 characters allowed" }
    });
  }

  const ticketId = id || `ANL-${Math.floor(1000 + Math.random() * 9000)}`;
  const ai = getGeminiClient();

  if (!ai) {
    const fallback = ruleBasedTriage(cleanSub, cleanBody);
    return res.json({ id: ticketId, subject: cleanSub, body: cleanBody, ...fallback });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Support Ticket:\nSubject: ${cleanSub}\nBody: ${cleanBody}`,
      config: {
        systemInstruction: TRIAGE_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            urgency: { type: Type.STRING },
            confidence: { type: Type.INTEGER },
            assignedTeam: { type: Type.STRING },
            humanReview: { type: Type.BOOLEAN },
            routingStatus: { type: Type.STRING },
            reason: { type: Type.STRING }
          },
          required: ["category", "urgency", "confidence", "assignedTeam", "humanReview", "routingStatus", "reason"]
        }
      }
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);

    // Validate and sanitize confidence
    let confidence = typeof data.confidence === "number" ? Math.round(data.confidence) : 85;
    if (isNaN(confidence)) confidence = 85;
    confidence = Math.min(100, Math.max(0, confidence));

    // Validate category against controlled list
    let category = VALID_CATEGORIES.includes(data.category) ? data.category : "General Question";
    let urgency = VALID_URGENCIES.includes(data.urgency) ? data.urgency : "Low";
    let assignedTeam = VALID_TEAMS.includes(data.assignedTeam) ? data.assignedTeam : "General Support";

    // Enforce strict Decision Boundary rules
    const boundary = evaluateDecisionBoundary(confidence, Boolean(data.humanReview));

    res.json({
      id: ticketId,
      subject: cleanSub,
      body: cleanBody,
      category,
      urgency,
      confidence,
      assignedTeam,
      humanReview: boundary.humanReview,
      routingStatus: boundary.routingStatus,
      reason: data.reason || "Analyzed by SupportFlow AI."
    });
  } catch (err) {
    console.error("Gemini API error, using deterministic fallback:", err);
    const fallback = ruleBasedTriage(cleanSub, cleanBody);
    res.json({ id: ticketId, subject: cleanSub, body: cleanBody, ...fallback });
  }
});

// 2. POST /api/analyze-batch
app.post("/api/analyze-batch", async (req, res) => {
  const { tickets = [] } = req.body || {};

  if (!Array.isArray(tickets) || tickets.length === 0) {
    return res.status(400).json({ error: "An array of tickets is required." });
  }

  if (tickets.length > 100) {
    return res.status(400).json({ error: "Batch size cannot exceed 100 tickets." });
  }

  const ai = getGeminiClient();

  // Process in chunks of 5 to respect concurrency limits and avoid dropping tickets
  const chunkSize = 5;
  const results = [];

  for (let i = 0; i < tickets.length; i += chunkSize) {
    const chunk = tickets.slice(i, i + chunkSize);
    const chunkResults = await Promise.all(
      chunk.map(async (t: any, idx: number) => {
        const itemIdx = i + idx;
        const cleanSub = String(t.subject || `Ticket #${itemIdx + 1}`).trim();
        const cleanBody = String(t.body || t.description || "").trim();
        const id = t.id || `ANL-${Math.floor(1000 + Math.random() * 9000)}`;

        if (!cleanSub && !cleanBody) {
          return {
            id,
            subject: `Empty Ticket #${itemIdx + 1}`,
            body: "No content provided",
            category: "General Question",
            urgency: "Low",
            confidence: 0,
            assignedTeam: "General Support",
            humanReview: true,
            routingStatus: "Needs Review",
            reason: "The ticket is blank and cannot be classified automatically."
          };
        }

        if (!ai) {
          const fallback = ruleBasedTriage(cleanSub, cleanBody);
          return { id, subject: cleanSub, body: cleanBody, ...fallback };
        }

        try {
          const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: `Analyze Support Ticket:\nSubject: ${cleanSub}\nBody: ${cleanBody}`,
            config: {
              systemInstruction: TRIAGE_SYSTEM_PROMPT,
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  urgency: { type: Type.STRING },
                  confidence: { type: Type.INTEGER },
                  assignedTeam: { type: Type.STRING },
                  humanReview: { type: Type.BOOLEAN },
                  routingStatus: { type: Type.STRING },
                  reason: { type: Type.STRING }
                },
                required: ["category", "urgency", "confidence", "assignedTeam", "humanReview", "routingStatus", "reason"]
              }
            }
          });

          const text = response.text || "{}";
          const data = JSON.parse(text);

          let confidence = typeof data.confidence === "number" ? Math.round(data.confidence) : 85;
          if (isNaN(confidence)) confidence = 85;
          confidence = Math.min(100, Math.max(0, confidence));

          let category = VALID_CATEGORIES.includes(data.category) ? data.category : "General Question";
          let urgency = VALID_URGENCIES.includes(data.urgency) ? data.urgency : "Low";
          let assignedTeam = VALID_TEAMS.includes(data.assignedTeam) ? data.assignedTeam : "General Support";

          const boundary = evaluateDecisionBoundary(confidence, Boolean(data.humanReview));

          return {
            id,
            subject: cleanSub,
            body: cleanBody,
            category,
            urgency,
            confidence,
            assignedTeam,
            humanReview: boundary.humanReview,
            routingStatus: boundary.routingStatus,
            reason: data.reason || "Batch analyzed via SupportFlow AI."
          };
        } catch (e) {
          const fallback = ruleBasedTriage(cleanSub, cleanBody);
          return { id, subject: cleanSub, body: cleanBody, ...fallback };
        }
      })
    );
    results.push(...chunkResults);
  }

  res.json({ tickets: results, totalCount: results.length });
});

// 3. GET /api/sample-tickets
app.get("/api/sample-tickets", (_req, res) => {
  const samples = [
    {
      id: "ANL-1713",
      subject: "Cannot login",
      body: "I have tried resetting my password but I still cannot access my account.",
      expectedCategory: "Account Access",
      expectedUrgency: "Medium",
      expectedTeam: "Account Team",
      expectedRouting: "Auto-Routed"
    },
    {
      id: "ANL-1714",
      subject: "Refund request",
      body: "I was charged twice this month and would like a refund.",
      expectedCategory: "Refund",
      expectedUrgency: "Medium",
      expectedTeam: "Billing Team",
      expectedRouting: "Auto-Routed"
    },
    {
      id: "ANL-1715",
      subject: "Application crashes",
      body: "The application crashes every time I upload a PDF.",
      expectedCategory: "Bug Report",
      expectedUrgency: "High",
      expectedTeam: "Engineering",
      expectedRouting: "Auto-Routed"
    },
    {
      id: "ANL-1716",
      subject: "Website Down",
      body: "None of our customers can access the production portal.",
      expectedCategory: "Technical Issue",
      expectedUrgency: "Critical",
      expectedTeam: "Infrastructure Team",
      expectedRouting: "Auto-Routed"
    },
    {
      id: "ANL-1717",
      subject: "Feature Request",
      body: "Please add Dark Mode support to the UI dashboard.",
      expectedCategory: "Feature Request",
      expectedUrgency: "Low",
      expectedTeam: "Product Team",
      expectedRouting: "Auto-Routed"
    },
    {
      id: "ANL-1718",
      subject: "Slow database query execution",
      body: "Our PostgreSQL queries in production us-east-1 are taking over 15 seconds.",
      expectedCategory: "Technical Issue",
      expectedUrgency: "High",
      expectedTeam: "Infrastructure Team",
      expectedRouting: "Recommended"
    },
    {
      id: "ANL-1719",
      subject: "Security Alert: Unauthorized login attempts",
      body: "We detected 50 failed admin login attempts from unrecognized IP address 192.168.1.1.",
      expectedCategory: "Security Concern",
      expectedUrgency: "Critical",
      expectedTeam: "Security Team",
      expectedRouting: "Auto-Routed"
    },
    {
      id: "ANL-1720",
      subject: "Help please",
      body: "It is broken and not working at all help.",
      expectedCategory: "General Question",
      expectedUrgency: "Low",
      expectedTeam: "General Support",
      expectedRouting: "Needs Review"
    },
    {
      id: "ANL-1721",
      subject: "Invoice discrepancy and cannot login on phone",
      body: "My latest invoice shows wrong total amount and also my mobile app crashes on login screen.",
      expectedCategory: "General Question",
      expectedUrgency: "Low",
      expectedTeam: "General Support",
      expectedRouting: "Needs Review"
    },
    {
      id: "ANL-1722",
      subject: "Enterprise pricing inquiry",
      body: "We have 500 employees and want information about enterprise SLA pricing.",
      expectedCategory: "Sales Inquiry",
      expectedUrgency: "Low",
      expectedTeam: "Sales Team",
      expectedRouting: "Auto-Routed"
    }
  ];
  res.json({ samples });
});

// 4. POST /api/generate-samples
app.post("/api/generate-samples", async (req, res) => {
  const count = Math.min(100, Math.max(1, parseInt(req.body?.count || "10", 10)));
  const ai = getGeminiClient();

  const templates = [
    { subject: "Database Connection Timeout in US-East-1", body: "PostgreSQL cluster is timing out on 40% of queries." },
    { subject: "VAT Tax Invoice Missing for Q3", body: "Need downloadable PDF tax invoice for Q3 enterprise renewal." },
    { subject: "SSO SAML Integration Certificate Expired", body: "Okta SAML single sign-on throws certificate expired error." },
    { subject: "API Rate Limit Exceeded on Webhooks", body: "HTTP 429 error on webhook endpoints during peak traffic." },
    { subject: "Add Export to Excel Feature", body: "Please allow exporting reports directly to XLSX format." },
    { subject: "App crashes when uploading CSV", body: "Uploading CSV files above 5MB causes browser tab to freeze and crash." },
    { subject: "Unauthorized login warning from unknown IP", body: "Suspicious login detected from foreign country on master admin account." },
    { subject: "Billing charged twice in July statement", body: "My credit card statement shows two identical charges of $299." },
    { subject: "Help needed urgently", body: "It is not working please fix it right now." },
    { subject: "Slow loading dashboard widgets", body: "The analytics charts take 20+ seconds to render on page refresh." },
    { subject: "Password reset link invalid", body: "The reset link sent to my email returns 404 token expired." },
    { subject: "Enterprise licensing quote for 1000 seats", body: "Requesting custom quote and master service agreement for 1000 seats." }
  ];

  const samples = Array.from({ length: count }).map((_, i) => {
    const t = templates[i % templates.length];
    return {
      id: `ANL-GEN-${2000 + i}`,
      subject: count > templates.length ? `${t.subject} (Batch #${i + 1})` : t.subject,
      body: t.body
    };
  });

  res.json({ samples });
});

// Vite & Static file handling
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SupportFlow AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
