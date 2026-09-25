# 🎫 SupportFlow AI — Automated Support Ticket Triage & Smart Routing System

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Netlify](https://img.shields.io/badge/Deployed_on-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://supportflow-ai.netlify.app/)
[![GitHub](https://img.shields.io/badge/GitHub-bikram73%2FSupportFlow__AI-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/bikram73/SupportFlow_AI)

**An enterprise-grade customer support triage and decision orchestration platform.**  
Automatically analyzes incoming customer inquiries, extracts semantic intent, assigns urgency levels, computes confidence scores, and routes tickets to appropriate departmental queues with automated human-in-the-loop safeguards.

<br />

🔗 **Live Application URL:** [https://supportflow-ai.netlify.app/](https://supportflow-ai.netlify.app/)  
📂 **Source Code Repository:** [https://github.com/bikram73/SupportFlow_AI](https://github.com/bikram73/SupportFlow_AI)

</div>

---

# 📑 Table of Contents

<div align="center">

| **<div align="center">📖 Description</div>** | **<div align="center">🚀 Section</div>** |
|--------------------------------------------------------------|------------------------------------------------|
| <div align="center">**View the project features and capabilities.** 👉</div> | <div align="center"><a href="#features"><img src="https://img.shields.io/badge/✨%20Features-4F46E5?style=for-the-badge" /></a></div> |
| <div align="center">**View the technologies, frameworks, and programming languages used.** 👉</div> | <div align="center"><a href="#tech-stack"><img src="https://img.shields.io/badge/🛠️%20Tech%20Stack-0891B2?style=for-the-badge" /></a></div> |
| <div align="center">**Explore the project's folder and file organization.** 👉</div> | <div align="center"><a href="#file-structure"><img src="https://img.shields.io/badge/📂%20File%20Structure-10B981?style=for-the-badge" /></a></div> |
| <div align="center">**Follow the installation steps and local development setup.** 👉</div> | <div align="center"><a href="#installation"><img src="https://img.shields.io/badge/🚀%20Installation-F97316?style=for-the-badge" /></a></div> |
| <div align="center">**View the available REST API endpoints and usage examples.** 👉</div> | <div align="center"><a href="#api"><img src="https://img.shields.io/badge/🌐%20API%20Documentation-0EA5E9?style=for-the-badge" /></a></div> |
| <div align="center">**Understand the current limitations and known failure cases of the AI extractor.** 👉</div> | <div align="center"><a href="#limitations"><img src="https://img.shields.io/badge/⚠️%20Known%20Limitations-EF4444?style=for-the-badge" /></a></div> |

</div>

---

<h2 id="features">✨ Features</h2>

### 🎯 1. Real-Time Single Ticket Triage
* **Semantic Category Extraction**: Classifies tickets into standard taxonomy types including `Technical Issue`, `Billing`, `Refund`, `Account Access`, `Password Reset`, `Bug Report`, `Feature Request`, `Security Concern`, `Sales Inquiry`, `Subscription`, `Performance Issue`, and `General Question`.
* **Urgency & Severity Detection**: Evaluates severity on a 4-tier matrix: `Critical`, `High`, `Medium`, and `Low`.
* **Target Team Routing**: Maps tickets directly to specialized teams such as `Infrastructure Team`, `Engineering`, `Billing Team`, `Account Team`, `Security Team`, `Sales Team`, `Customer Success`, or `General Support`.
* **Step-by-Step AI Reasoning**: Generates an audit-ready 1–3 sentence rationale detailing why a specific department and priority was assigned.

### 🛡️ 2. Automated Confidence Scoring & Human-in-the-Loop Flags
* **Granular Confidence Rating (0–100%)**: Quantifies the certainty of classification.
* **Smart Review Trigger**: Automatically flags tickets for manual human supervisor inspection whenever confidence drops below **70%**, if customer input is ambiguous, or if multiple disparate issues are described.
* **Manual Override Controls**: Allows support leads to re-assign teams, modify urgency levels, or adjust categories directly in the UI.

### ⚡ 3. High-Throughput Batch Processing
* **Multi-Ticket Dataset Ingestion**: Process batches of support tickets simultaneously with real-time progress indicators.
* **Synthetic Ticket Generator**: Generate custom batches of realistic enterprise support scenarios (e.g., 5, 10, or 25 tickets) on demand.
* **Search, Filter & Pagination**: Filter by category, urgency tier, review status, or target team, coupled with fast full-text searching and pagination controls.
* **Data Export**: Export processed ticket batches and classification decisions to CSV or JSON.

### 📊 4. Interactive Operations Dashboard
* **Real-Time KPI Metrics**: Live indicators tracking Total Processed, Auto-Routing Rate (~94%), Average Confidence (~91%), and SLA compliance.
* **Category Breakdown Distribution**: Visual breakdown of incoming ticket volume across core departments.
* **Queue Health & Agent Allocation**: View current backlog distribution, active agents, and average resolution time per team.

### 🔄 5. High-Availability Dual-Layer Architecture
* **Serverless Backend Execution**: Express API integrated with Vite middleware for dev and Netlify Serverless Functions for cloud deployment.
* **Zero-Downtime Rule-Based Fallback**: Built-in deterministic pattern matcher ensures classification, urgency assignment, and routing continue working without interruption even if network connectivity or external API keys are unavailable.

---

<h2 id="tech-stack">🛠️ Tech Stack</h2>

### 💻 Programming Languages
| Icon | Language | Primary Purpose |
|:---:|:---|:---|
| <img src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/typescript/typescript.png" width="24" height="24" /> | **TypeScript (v5.8)** | Strict end-to-end type safety across both frontend and backend modules |
| <img src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/javascript/javascript.png" width="24" height="24" /> | **JavaScript (ESNext)** | Modern runtime standards, asynchronous promise workflows, and JSON schema operations |
| <img src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/html/html.png" width="24" height="24" /> | **HTML5** | Semantic web document structure, accessibility tags, and responsive viewport elements |
| <img src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/css/css.png" width="24" height="24" /> | **CSS3** | Modern responsive layouts, custom utility layers, and fluid typography tokens |

### ⚛️ Frontend Framework & UI Libraries
* **React 19**: Modern functional components, React Hooks (`useState`, `useEffect`, `useMemo`), and concurrent rendering.
* **Tailwind CSS v4**: Utility-first CSS engine with custom design tokens for surface, container, and priority accent colors.
* **Lucide React / Material Symbols**: Modern icon sets for status badges, priority levels, and navigation states.
* **Vite 6**: Fast bundling, instant HMR in dev, and tree-shaken static production builds.

### 🖥️ Backend & Serverless Runtime
* **Node.js (v20+)**: High-performance asynchronous JavaScript server runtime.
* **Express.js (v4.21)**: REST routing, JSON payload parsing, and middleware integration.
* **Serverless-HTTP**: AWS Lambda and Netlify Function wrapper transforming Express apps into serverless handlers.
* **@google/genai**: Official TypeScript SDK for structured JSON generation and system prompts.
* **Dotenv**: Environment variable configuration management.

### 🚀 DevOps & Deployment
* **Netlify**: Serverless hosting configured with `netlify.toml` and functions redirect rules.
* **Vite Build**: Optimized single-page application build outputting to `/dist`.

---

<h2 id="file-structure">📂 File Structure</h2>

```
supportflow-ai/
├── 📄 .env.example              # Sample environment variable declarations
├── 📄 .gitignore                # Git ignored patterns and node_modules
├── 📄 index.html                # Application HTML5 root entry point
├── 📄 metadata.json             # AI Studio applet configuration & capabilities
├── 📄 package.json              # Dependencies, scripts, and package metadata
├── 📄 tsconfig.json             # TypeScript compiler rules and path configurations
├── 📄 vite.config.ts            # Vite tooling configuration and plugins
├── 📄 server.ts                 # Full-stack Express server with Vite middleware integration
├── 📄 netlify.toml              # Netlify build instructions and serverless function rewrites
├── 📄 NETLIFY_DEPLOYMENT.md     # Step-by-step production deployment guide for Netlify
│
├── 📁 netlify/
│   └── 📁 functions/
│       └── 📄 api.ts            # Serverless HTTP handler for API endpoints on Netlify
│
├── 📁 public/
│   └── 📄 _redirects            # SPA client-side rewrite rules for Netlify
│
└── 📁 src/
    ├── 📄 App.tsx               # Main application container, tab state, and global shell
    ├── 📄 main.tsx              # React DOM initialization and client bootstrap
    ├── 📄 index.css             # Tailwind CSS tokens, theme variables, and global styles
    ├── 📄 types.ts              # TypeScript interfaces for tickets, triage results, & metrics
    │
    ├── 📁 components/
    │   ├── 📄 Navbar.tsx                # Header navigation bar with tab switching & status
    │   ├── 📄 HomeView.tsx              # Landing page with workflow diagrams & feature highlights
    │   ├── 📄 DashboardView.tsx         # Analytics dashboard, SLAs, charts & queue metrics
    │   ├── 📄 AnalyzeTicketView.tsx     # Single ticket input, sample picker, and triage results
    │   ├── 📄 BatchProcessingView.tsx   # Batch processing table, search, filters & export
    │   └── 📄 AboutView.tsx             # System architecture, routing rules & operational specs
    │
    └── 📁 utils/
        └── 📄 triageFallback.ts         # Deterministic rule-based fallback & sample ticket data
```

---

<h2 id="installation">🚀 Installation & Setup</h2>

### 📋 Prerequisites
Ensure you have the following installed on your machine:
* **Node.js**: `v20.0.0` or higher
* **npm**: `v9.0.0` or higher (or `pnpm` / `bun`)

### 🛠️ 1. Clone the Repository
```bash
git clone https://github.com/bikram73/SupportFlow_AI.git
cd SupportFlow_AI
```

### 📦 2. Install Dependencies
```bash
npm install
```

### ⚙️ 3. Configure Environment Variables
Copy `.env.example` to create your local `.env` file:
```bash
cp .env.example .env
```
Open `.env` and add your API key:
```env
PORT=3000
GEMINI_API_KEY=your_actual_api_key_here
```
*(Note: If no API key is provided, SupportFlow AI will seamlessly use the built-in deterministic rule classification engine without breaking).*

### 💻 4. Run Development Server
Start the full-stack dev server (Express backend + Vite frontend):
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:3000
```

### 🏗️ 5. Build for Production
To create a production-optimized build of the client:
```bash
npm run build
```

---

<h2 id="api">🌐 API Documentation</h2>

All endpoints accept and return `application/json`.

### 1. Single Ticket Analysis
* **Endpoint**: `POST /api/analyze-ticket`
* **Description**: Classifies an individual ticket and returns routing decision, urgency, confidence, and reasoning.

#### Request Body
```json
{
  "subject": "Application crashes on PDF invoice upload",
  "body": "Whenever users upload an invoice PDF over 2MB, error 500 is thrown and the browser tab freezes."
}
```

#### Response Example
```json
{
  "subject": "Application crashes on PDF invoice upload",
  "body": "Whenever users upload an invoice PDF over 2MB, error 500 is thrown and the browser tab freezes.",
  "category": "Bug Report",
  "urgency": "High",
  "confidence": 94,
  "assignedTeam": "Engineering",
  "humanReview": false,
  "reason": "Application crash during file upload workflow indicating software defect."
}
```

---

### 2. Batch Ticket Processing
* **Endpoint**: `POST /api/analyze-batch`
* **Description**: Analyzes an array of support tickets concurrently.

#### Request Body
```json
{
  "tickets": [
    { "id": "TK-101", "subject": "Cannot login", "body": "Password reset email never arrives." },
    { "id": "TK-102", "subject": "Charged twice", "body": "I was billed double for July subscription." }
  ]
}
```

#### Response Example
```json
{
  "tickets": [
    {
      "id": "TK-101",
      "subject": "Cannot login",
      "body": "Password reset email never arrives.",
      "category": "Account Access",
      "urgency": "Medium",
      "confidence": 95,
      "assignedTeam": "Account Team",
      "humanReview": false,
      "reason": "Customer is blocked by authentication and password reset delivery issue."
    },
    {
      "id": "TK-102",
      "subject": "Charged twice",
      "body": "I was billed double for July subscription.",
      "category": "Billing",
      "urgency": "Medium",
      "confidence": 98,
      "assignedTeam": "Billing Team",
      "humanReview": false,
      "reason": "Duplicate charge inquiry requiring invoice review and refund processing."
    }
  ]
}
```

---

### 3. Retrieve Sample Tickets
* **Endpoint**: `GET /api/sample-tickets`
* **Description**: Returns curated pre-configured benchmark customer tickets for quick testing.

---

### 4. Generate Synthetic Tickets
* **Endpoint**: `POST /api/generate-samples`
* **Description**: Synthesizes realistic mock support tickets spanning multiple categories and urgency tiers.
* **Payload**: `{"count": 10}`

---

<h2 id="limitations">⚠️ Known Limitations & Failure Modes</h2>

| Limitation Scenario | Behavior & Impact | Recommended Mitigation / Safeguard |
|:---|:---|:---|
| **Multi-Intent Tickets** | If a ticket combines multiple distinct issues (e.g., *"My invoice is wrong AND my mobile app crashes"*), single-category classification can prioritize only one intent. | System flags `humanReview: true` when multiple intents are detected so human supervisors can split the ticket. |
| **Extremely Short / Vague Submissions** | Tickets with minimal context (e.g., *"Help please"*, *"It is broken"*) lack semantic depth for high confidence. | Confidence score drops below `70%`, triggering the **Needs Review** state for agent clarification. |
| **Unseen Jargon & Proprietary IDs** | Specialized internal error codes (e.g., *"Kernel fault 0xDEADBEEF in pod delta-4"*) may not match generic knowledge models. | System utilizes urgency heuristics (e.g. "fault", "outage") to route to Infrastructure / Engineering while maintaining review flags. |
| **API Rate Limiting / Offline Mode** | During network interruptions or cloud provider quota limits, external AI models may fail. | The built-in client and server deterministic fallback immediately intercepts calls to guarantee 100% operational uptime. |
| **Token Length Limits** | Very large stack traces (>15,000 words) may get truncated before analysis. | Pre-processing strips redundant stack repetitions to retain the essential error description. |

---

<div align="center">

**Built with ❤️ for enterprise customer support & DevOps teams.**  
*Automate triage • Cut response times • Empower your support engineers*

</div>
