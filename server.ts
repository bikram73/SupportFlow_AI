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

// Fallback rule-based triage classifier for robustness
function ruleBasedTriage(subject: string, body: string) {
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

const TRIAGE_SYSTEM_PROMPT = `You are an expert customer support triage assistant.
Analyze the provided support ticket (subject and body).

Return ONLY valid JSON with these exact fields:
- category: Must be one of ['Technical Issue', 'Billing', 'Refund', 'Account Access', 'Password Reset', 'Bug Report', 'Feature Request', 'Security Concern', 'Sales Inquiry', 'Subscription', 'Performance Issue', 'General Question', 'Other']
- urgency: Must be one of ['Low', 'Medium', 'High', 'Critical']
- confidence: An integer from 0 to 100.
- assignedTeam: Must be one of ['Technical Support', 'Billing Team', 'Engineering', 'Security Team', 'Sales Team', 'Customer Success', 'Infrastructure Team', 'Account Team', 'Product Team', 'General Support']
- humanReview: boolean (Set to true if confidence < 70, or if the ticket is vague, contains multiple unrelated issues, or lacks sufficient context).
- reason: A concise 1-3 sentence explanation detailing why this categorization, urgency, and routing was decided.

Strict Classification Rules:
- Critical: System Down, Production Outage, Payment Gateway Failure, Security Breach, Data Loss.
- High: Crashes, Major Bugs, Access blocked for multiple users, API Rate Limits blocking production.
- Medium: Single user login issue, invoice questions, minor bug, slow performance.
- Low: Feature requests, general questions, documentation, feedback, pricing questions.

Routing Mapping Rules:
- Password / Login / SAML / Reset -> Account Team
- Refund / Billing / Charged twice -> Billing Team
- Crash / PDF upload crash / Bug -> Engineering
- Website Down / Server Outage -> Infrastructure Team
- Feature Request / Dark Mode -> Product Team
- Security / Unauthorized Access -> Security Team
- Sales / Pricing -> Sales Team
- Account / CSM -> Customer Success
- General -> General Support
`;

// API Endpoints

// 1. POST /api/analyze-ticket
app.post("/api/analyze-ticket", async (req, res) => {
  const { subject = "", body = "" } = req.body || {};

  if (!subject.trim() && !body.trim()) {
    return res.status(400).json({ error: "Subject or body is required." });
  }

  const ai = getGeminiClient();

  if (!ai) {
    const fallback = ruleBasedTriage(subject, body);
    return res.json({ subject, body, ...fallback });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Support Ticket:\nSubject: ${subject}\nBody: ${body}`,
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
            reason: { type: Type.STRING }
          },
          required: ["category", "urgency", "confidence", "assignedTeam", "humanReview", "reason"]
        }
      }
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);

    let confidence = typeof data.confidence === "number" ? data.confidence : 85;
    confidence = Math.min(100, Math.max(0, confidence));

    let humanReview = Boolean(data.humanReview);
    if (confidence < 70) {
      humanReview = true;
    }

    res.json({
      subject,
      body,
      category: data.category || "General Question",
      urgency: data.urgency || "Low",
      confidence,
      assignedTeam: data.assignedTeam || "General Support",
      humanReview,
      reason: data.reason || "Analyzed by SupportFlow AI."
    });
  } catch (err) {
    console.error("Gemini API error, using fallback:", err);
    const fallback = ruleBasedTriage(subject, body);
    res.json({ subject, body, ...fallback });
  }
});

// 2. POST /api/analyze-batch
app.post("/api/analyze-batch", async (req, res) => {
  const { tickets = [] } = req.body || {};

  if (!Array.isArray(tickets) || tickets.length === 0) {
    return res.status(400).json({ error: "An array of tickets is required." });
  }

  const ai = getGeminiClient();

  const results = await Promise.all(
    tickets.map(async (t: any, index: number) => {
      const subject = t.subject || `Ticket #${index + 1}`;
      const body = t.body || t.description || "";
      const id = t.id || `TK-${Math.floor(1000 + Math.random() * 9000)}`;

      if (!ai) {
        const fallback = ruleBasedTriage(subject, body);
        return { id, subject, body, ...fallback };
      }

      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: `Analyze Support Ticket:\nSubject: ${subject}\nBody: ${body}`,
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
                reason: { type: Type.STRING }
              },
              required: ["category", "urgency", "confidence", "assignedTeam", "humanReview", "reason"]
            }
          }
        });

        const text = response.text || "{}";
        const data = JSON.parse(text);

        let confidence = typeof data.confidence === "number" ? data.confidence : 85;
        confidence = Math.min(100, Math.max(0, confidence));

        let humanReview = Boolean(data.humanReview);
        if (confidence < 70) {
          humanReview = true;
        }

        return {
          id,
          subject,
          body,
          category: data.category || "General Question",
          urgency: data.urgency || "Low",
          confidence,
          assignedTeam: data.assignedTeam || "General Support",
          humanReview,
          reason: data.reason || "Batch analyzed via SupportFlow AI."
        };
      } catch (e) {
        const fallback = ruleBasedTriage(subject, body);
        return { id, subject, body, ...fallback };
      }
    })
  );

  res.json({ tickets: results });
});

// 3. GET /api/sample-tickets
app.get("/api/sample-tickets", (_req, res) => {
  const samples = [
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
  res.json({ samples });
});

// 4. POST /api/generate-samples
app.post("/api/generate-samples", async (req, res) => {
  const count = Math.min(50, Math.max(1, parseInt(req.body?.count || "10", 10)));
  const ai = getGeminiClient();

  if (!ai) {
    const templates = [
      { subject: "Database Connection Timeout", body: "PostgreSQL cluster in us-east-1 is timing out on 40% of queries." },
      { subject: "VAT Tax Invoice Missing", body: "Need downloadable PDF tax invoice for Q3 enterprise renewal." },
      { subject: "SSO SAML Integration Failure", body: "Okta SAML single sign-on throws certificate expired error." },
      { subject: "API Rate Limit Exceeded", body: "HTTP 429 error on webhook endpoints during peak traffic." },
      { subject: "Add Export to Excel Feature", body: "Please allow exporting reports directly to XLSX format." },
      { subject: "App crashes when uploading CSV", body: "Uploading CSV files above 5MB causes browser tab to freeze and crash." },
      { subject: "Unauthorized login warning", body: "Suspicious login detected from foreign country on master admin account." },
      { subject: "Billing charged twice in July", body: "My credit card statement shows two identical charges of $299." },
      { subject: "Help needed urgently", body: "It is not working please fix it right now." },
      { subject: "Slow loading dashboard widgets", body: "The analytics charts take 20+ seconds to render on page refresh." }
    ];

    const samples = Array.from({ length: count }).map((_, i) => {
      const t = templates[i % templates.length];
      return {
        id: `TK-GEN-${2000 + i}`,
        subject: `${t.subject} (${i + 1})`,
        body: t.body
      };
    });

    return res.json({ samples });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Generate ${count} realistic customer support tickets for a SaaS platform. Include a mix of critical server outages, billing refund requests, app crashes, account access, dark mode feature requests, security alerts, and vague help requests.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              subject: { type: Type.STRING },
              body: { type: Type.STRING }
            },
            required: ["subject", "body"]
          }
        }
      }
    });

    const parsed = JSON.parse(response.text || "[]");
    const samples = parsed.map((item: any, idx: number) => ({
      id: `TK-GEN-${3000 + idx}`,
      subject: item.subject,
      body: item.body
    }));
    res.json({ samples });
  } catch (err) {
    console.error("Failed to generate samples via Gemini:", err);
    res.status(500).json({ error: "Failed to generate synthetic samples." });
  }
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
