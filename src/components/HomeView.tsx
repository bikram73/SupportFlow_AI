import React, { useState } from 'react';
import { NavTab } from '../types';
import { ruleBasedTriage, evaluateDecisionBoundary } from '../utils/triageFallback';

interface HomeViewProps {
  onSelectTab: (tab: NavTab) => void;
  onTrySample: () => void;
}

interface InteractiveDemoPreset {
  title: string;
  badge: string;
  subject: string;
  body: string;
}

const DEMO_PRESETS: InteractiveDemoPreset[] = [
  {
    title: 'PostgreSQL Outage',
    badge: 'Critical Issue',
    subject: 'Production Outage: PostgreSQL Cluster Timeout in us-east-1',
    body: 'Our primary database cluster has been timing out on over 65% of queries for the last 15 minutes. All customer-facing endpoints are throwing 500 errors.'
  },
  {
    title: 'Duplicate Amex Charge',
    badge: 'Billing Discrepancy',
    subject: 'Charged twice for Annual Business Plan',
    body: 'I reviewed our corporate card statement and noticed two identical charges of $1200 on September 24th for our annual plan renewal. Please issue a refund.'
  },
  {
    title: 'Okta SAML 2FA',
    badge: 'Account Access',
    subject: 'Okta SAML Single Sign-On Certificate Expired',
    body: 'Our entire engineering organization cannot sign in through SAML SSO this morning. The Okta auth screen displays Certificate signature mismatch (Error 401).'
  }
];

const TAXONOMY_CATEGORIES = [
  { name: 'Technical Issue', desc: 'Outages, server failures, latency, database timeouts', color: 'bg-blue-100 text-blue-800' },
  { name: 'Billing', desc: 'Invoices, VAT exemption, payment failure, tax receipts', color: 'bg-emerald-100 text-emerald-800' },
  { name: 'Refund', desc: 'Duplicate charges, subscription cancel balance, credit request', color: 'bg-teal-100 text-teal-800' },
  { name: 'Account Access', desc: 'SAML SSO, 2FA lockout, login issues, permissions', color: 'bg-indigo-100 text-indigo-800' },
  { name: 'Password Reset', desc: 'Forgotten credentials, reset token expired, unlock account', color: 'bg-violet-100 text-violet-800' },
  { name: 'Bug Report', desc: 'UI crashes, PDF upload memory leak, 500 exceptions', color: 'bg-amber-100 text-amber-800' },
  { name: 'Feature Request', desc: 'Dark mode theme, export formats, localization request', color: 'bg-purple-100 text-purple-800' },
  { name: 'Security Concern', desc: 'Suspicious IP login, IDOR vulnerability, unauthorized email change', color: 'bg-rose-100 text-rose-800' },
  { name: 'Sales Inquiry', desc: 'Enterprise tiered pricing, 750 seat custom quotes', color: 'bg-cyan-100 text-cyan-800' },
  { name: 'Subscription', desc: 'Plan downgrades, renewal cancellation, seat limits', color: 'bg-sky-100 text-sky-800' },
  { name: 'General Question', desc: 'Documentation, contractor invites, product guidance', color: 'bg-slate-100 text-slate-800' },
  { name: 'Other', desc: 'Unclassified inquiries requiring human interpretation', color: 'bg-gray-100 text-gray-800' }
];

const TARGET_QUEUES = [
  { name: 'Infrastructure Team', sla: '< 15 mins', icon: 'dns', desc: 'Platform outages, cluster timeouts, and cloud availability' },
  { name: 'Security Team', sla: '< 15 mins', icon: 'security', desc: 'Breach reports, unauthorized IPs, and vulnerability advisories' },
  { name: 'Engineering', sla: '< 1 hr', icon: 'bug_report', desc: 'Software exceptions, memory leaks, and browser crashes' },
  { name: 'Billing Team', sla: '< 1 hr', icon: 'receipt_long', desc: 'Duplicate charges, invoice reissues, and refund approvals' },
  { name: 'Account Team', sla: '< 1 hr', icon: 'manage_accounts', desc: 'SAML Okta SSO, 2FA recoveries, and email updates' },
  { name: 'Sales Team', sla: '< 2 hrs', icon: 'handshake', desc: 'Enterprise procurement, custom quotes, and seat expansion' },
  { name: 'Product Team', sla: '< 2 hrs', icon: 'lightbulb', desc: 'Feature requests, UX enhancements, and API expansions' },
  { name: 'Customer Success', sla: '< 2 hrs', icon: 'sentiment_satisfied', desc: 'Contract renewals, workspace onboarding, and account health' },
  { name: 'Technical Support', sla: '< 2 hrs', icon: 'support_agent', desc: 'Developer API webhooks and integration queries' },
  { name: 'General Support', sla: '< 2 hrs', icon: 'help', desc: 'Platform FAQs, invite permissions, and general assistance' }
];

const FAQS = [
  {
    q: 'How does SupportFlow AI decide when to Auto-Route vs trigger Human Review?',
    a: 'Every ticket is assigned a calibrated confidence score (0–100%). If confidence is ≥90% (Rule A), it is immediately Auto-Routed to the departmental queue. Scores between 70–89% (Rule B) are marked as Recommended for 1-click agent validation. Tickets under 70% or with vague/conflicting content (Rule C) strictly trigger a Human Review flag.'
  },
  {
    q: 'What happens if the Gemini AI model is unreachable?',
    a: 'SupportFlow AI includes a deterministic, rule-based fallback classification engine. If the API is offline or latency thresholds are exceeded, the fallback immediately processes the ticket using semantic pattern heuristics so operations continue without disruption.'
  },
  {
    q: 'Are tickets stored on a permanent server database?',
    a: 'No. SupportFlow AI follows a stateless, zero-login architecture. Your analyzed tickets and batch datasets are stored client-side in your browser’s LocalStorage, keeping the application lightweight, fast, and completely private.'
  },
  {
    q: 'Can I upload enterprise CSV files with multiple columns and commas in messages?',
    a: 'Yes! The batch ingestion system includes a full RFC 4180 CSV parser that properly handles quoted multi-line messages, embedded commas, and double quotes without corrupting fields.'
  }
];

export const HomeView: React.FC<HomeViewProps> = ({ onSelectTab, onTrySample }) => {
  // Interactive mini triage state on landing page
  const [activeDemoIdx, setActiveDemoIdx] = useState(0);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const activePreset = DEMO_PRESETS[activeDemoIdx];
  const activeTriage = ruleBasedTriage(activePreset.subject, activePreset.body);
  const activeBoundary = evaluateDecisionBoundary(activeTriage.confidence, activeTriage.humanReview);

  return (
    <div id="home-view" className="w-full">
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-8 pb-14 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-container-max-width mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-14 items-center">
            {/* Hero Left Column */}
            <div className="lg:col-span-6 z-10 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full mb-4 sm:mb-6 text-xs sm:text-sm font-medium">
                <span className="material-symbols-outlined text-[16px] sm:text-[18px]">auto_awesome</span>
                <span>Enterprise Support Intelligence</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface mb-4 sm:mb-6 leading-tight tracking-tight">
                Automated Support Ticket <span className="text-primary">Triage &amp; Smart Routing</span>
              </h1>
              <p className="text-on-surface-variant text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 max-w-xl leading-relaxed">
                Instantly classify customer intent across 12 standard categories, detect urgency tiers, compute calibrated confidence scores, and route tickets to target team queues with automated human-in-the-loop safeguards.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => onSelectTab('analyze')}
                  className="w-full sm:w-auto bg-primary text-on-primary px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[48px] active:scale-[0.99]"
                >
                  <span>Analyze Single Ticket</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectTab('batch')}
                  className="w-full sm:w-auto bg-surface-container-high text-on-surface px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-sm hover:bg-surface-container-highest transition-all cursor-pointer min-h-[48px] flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">dataset</span>
                  <span>Batch Ingestion</span>
                </button>
              </div>

              {/* Quick Specs */}
              <div className="mt-8 pt-6 border-t border-outline-variant flex flex-wrap gap-4 text-xs text-outline">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-emerald-600 text-[16px]">check_circle</span>
                  <span>12 Standard Categories</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-emerald-600 text-[16px]">check_circle</span>
                  <span>10 Department Queues</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-emerald-600 text-[16px]">check_circle</span>
                  <span>Rule A/B/C Boundaries</span>
                </div>
              </div>
            </div>

            {/* Hero Right Column: Illustration Image */}
            <div className="lg:col-span-6 relative mt-4 lg:mt-0">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 to-tertiary/10 blur-2xl rounded-full"></div>
              <div className="relative bg-white p-4 sm:p-6 lg:p-8 rounded-3xl shadow-xl border border-outline-variant">
                <img
                  className="w-full h-auto rounded-2xl object-cover max-h-[340px] sm:max-h-[420px]"
                  alt="A modern AI assistant interface illustration."
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjE--xg0deeypSJEX6dkFi9R70iPnoohPF0xSnBm3F91-VS6IIiFPvVvOB2x3k2StF0qGctRFN3q5BE95JjJ0h11xm8KVP0TaNc-7qTmKW_2aVu9UC4dpJfBMKyZoIqRHU7-Sct0ozHRGTXVE4_hQK9KtSVXCT7RE4r9ltizv64rDwZJAy6o1CCCn-xhfwD1XWkoHEtQR_GVeMkvQUn8kOJCJqRor01XcW4KfFDPSdPi6pyS0OoX3O"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Key Architectural Metrics Grid */}
        <section className="bg-surface-bright py-8 sm:py-10 border-y border-outline-variant/60 px-4 sm:px-6 lg:px-8">
          <div className="max-w-container-max-width mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl border border-outline-variant text-center">
                <span className="text-2xl sm:text-3xl font-extrabold text-primary block mb-0.5">Real-Time</span>
                <span className="text-xs font-bold text-on-surface block">Semantic Inference</span>
                <span className="text-[11px] text-outline">Google Gemini 3.6 Flash</span>
              </div>
              <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl border border-outline-variant text-center">
                <span className="text-2xl sm:text-3xl font-extrabold text-primary block mb-0.5">12 / 10</span>
                <span className="text-xs font-bold text-on-surface block">Categories &amp; Queues</span>
                <span className="text-[11px] text-outline">Strict Enterprise Taxonomy</span>
              </div>
              <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl border border-outline-variant text-center">
                <span className="text-2xl sm:text-3xl font-extrabold text-primary block mb-0.5">Rule A/B/C</span>
                <span className="text-xs font-bold text-on-surface block">Decision Boundaries</span>
                <span className="text-[11px] text-outline">≥90% / 70–89% / &lt;70%</span>
              </div>
              <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl border border-outline-variant text-center">
                <span className="text-2xl sm:text-3xl font-extrabold text-primary block mb-0.5">Stateless</span>
                <span className="text-xs font-bold text-on-surface block">Zero Server DB</span>
                <span className="text-[11px] text-outline">Client LocalStorage Cache</span>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Live Triage Playground Section */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-container-max-width mx-auto">
          <div className="bg-surface-container-lowest p-6 sm:p-8 lg:p-10 rounded-3xl shadow-xl border border-outline-variant">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-outline-variant">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                  <h3 className="font-extrabold text-lg sm:text-xl text-on-surface tracking-tight">
                    Interactive Live Triage Playground
                  </h3>
                </div>
                <p className="text-xs text-outline">
                  Select a real-world enterprise scenario to test automated category parsing, confidence boundaries, and queue assignment.
                </p>
              </div>

              {/* Preset Chips */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {DEMO_PRESETS.map((preset, idx) => (
                  <button
                    key={preset.title}
                    type="button"
                    onClick={() => setActiveDemoIdx(idx)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      activeDemoIdx === idx
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    {preset.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Simulated Ticket Content */}
              <div className="lg:col-span-6 space-y-3">
                <div className="bg-surface-container-low p-4 sm:p-5 rounded-2xl border border-outline-variant">
                  <span className="text-[10px] font-bold text-outline uppercase block mb-1">Incoming Ticket Subject</span>
                  <h4 className="font-bold text-sm sm:text-base text-on-surface mb-3">{activePreset.subject}</h4>
                  <span className="text-[10px] font-bold text-outline uppercase block mb-1">Message Body</span>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">{activePreset.body}</p>
                </div>
              </div>

              {/* Triage Decision Card */}
              <div className="lg:col-span-6 bg-surface-bright p-4 sm:p-5 rounded-2xl border border-outline-variant space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="bg-white p-3 rounded-xl border border-outline-variant shadow-2xs">
                    <span className="text-[10px] font-bold text-outline uppercase block">Category</span>
                    <span className="font-bold text-xs text-on-surface truncate block">{activeTriage.category}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-outline-variant shadow-2xs">
                    <span className="text-[10px] font-bold text-outline uppercase block">Urgency</span>
                    <span className={`font-bold text-xs ${activeTriage.urgency === 'Critical' ? 'text-error' : activeTriage.urgency === 'High' ? 'text-amber-800' : 'text-blue-800'}`}>
                      {activeTriage.urgency}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-outline-variant shadow-2xs">
                    <span className="text-[10px] font-bold text-outline uppercase block">Confidence</span>
                    <span className="font-extrabold text-xs text-primary">{activeTriage.confidence}%</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-outline-variant shadow-2xs">
                    <span className="text-[10px] font-bold text-outline uppercase block">Target Queue</span>
                    <span className="font-bold text-xs text-on-surface truncate block">{activeTriage.assignedTeam}</span>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-outline-variant">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="material-symbols-outlined text-[16px] text-primary">psychology</span>
                    <span className="text-[10px] font-bold text-outline uppercase">AI Decision Rationale</span>
                  </div>
                  <p className="text-xs text-on-surface leading-relaxed">{activeTriage.reason}</p>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-1">
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                    activeBoundary.routingStatus === 'Auto-Routed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    Decision Protocol: {activeBoundary.routingStatus}
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectTab('analyze')}
                    className="text-primary font-bold text-xs flex items-center gap-1 hover:gap-1.5 transition-all cursor-pointer"
                  >
                    Open Live Single Analysis <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-container-max-width mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mb-2 sm:mb-3">
              Comprehensive Support Triage Capabilities
            </h2>
            <p className="text-on-surface-variant text-xs sm:text-sm max-w-2xl mx-auto">
              Everything required to orchestrate high-volume support queues with speed, precision, and deterministic safety.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Feature Card 1 */}
            <div
              onClick={() => onSelectTab('analyze')}
              className="bg-surface-container-lowest p-5 sm:p-7 rounded-3xl shadow-xs border border-outline-variant hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined text-[22px] sm:text-[24px]">category</span>
              </div>
              <h3 className="font-bold text-base sm:text-lg mb-2 text-on-surface">Intent &amp; Taxonomy Classification</h3>
              <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed">
                Multi-layered intent detection maps inbound customer messages into 12 standard support taxonomy types with zero cross-department confusion.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div
              onClick={() => onSelectTab('analyze')}
              className="bg-surface-container-lowest p-5 sm:p-7 rounded-3xl shadow-xs border border-outline-variant hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined text-[22px] sm:text-[24px]">priority_high</span>
              </div>
              <h3 className="font-bold text-base sm:text-lg mb-2 text-on-surface">4-Tier Urgency Detection</h3>
              <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed">
                Sentiment analysis isolates Critical platform outages and security alerts within milliseconds, bypassing lower-priority general queues.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div
              onClick={() => onSelectTab('about')}
              className="bg-surface-container-lowest p-5 sm:p-7 rounded-3xl shadow-xs border border-outline-variant hover:shadow-md transition-all group ai-gradient-border cursor-pointer"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined text-[22px] sm:text-[24px]">verified</span>
              </div>
              <h3 className="font-bold text-base sm:text-lg mb-2 text-on-surface">Calibrated Confidence Boundaries</h3>
              <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed">
                Deterministic rules enforce: Rule A (≥90% Auto-Routed), Rule B (70–89% Recommended), and Rule C (&lt;70% Human Escalation).
              </p>
            </div>

            {/* Feature Card 4 */}
            <div
              onClick={() => onSelectTab('dashboard')}
              className="bg-surface-container-lowest p-5 sm:p-7 rounded-3xl shadow-xs border border-outline-variant hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined text-[22px] sm:text-[24px]">alt_route</span>
              </div>
              <h3 className="font-bold text-base sm:text-lg mb-2 text-on-surface">10 Departmental Queues</h3>
              <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed">
                Routes directly to specialized squads: Infrastructure, Engineering, Billing, Account, Security, Sales, Product, and Customer Success.
              </p>
            </div>

            {/* Feature Card 5 */}
            <div
              onClick={() => onSelectTab('batch')}
              className="bg-surface-container-lowest p-5 sm:p-7 rounded-3xl shadow-xs border border-outline-variant hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined text-[22px] sm:text-[24px]">dataset</span>
              </div>
              <h3 className="font-bold text-base sm:text-lg mb-2 text-on-surface">Batch CSV &amp; Text Processing</h3>
              <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed">
                Ingest large ticket batches simultaneously with chunked execution, multi-column search, urgency filters, and CSV/JSON exports.
              </p>
            </div>

            {/* Feature Card 6 */}
            <div
              onClick={() => onSelectTab('qa')}
              className="bg-surface-container-lowest p-5 sm:p-7 rounded-3xl shadow-xs border border-outline-variant hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined text-[22px] sm:text-[24px]">checklist</span>
              </div>
              <h3 className="font-bold text-base sm:text-lg mb-2 text-on-surface">QA &amp; Verification Suite</h3>
              <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed">
                Execute 50 golden benchmark test fixtures, audit decision boundary thresholds, and verify injection defenses in 1 click.
              </p>
            </div>
          </div>
        </section>

        {/* Decision Architecture Matrix Showcase */}
        <section className="bg-surface-bright py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-container-max-width mx-auto">
            <div className="text-center mb-10 sm:mb-14">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full mb-2 text-xs font-bold">
                <span className="material-symbols-outlined text-[16px]">tune</span> Three Core Decision Protocols
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mb-2">
                Deterministic Decision Boundary Architecture
              </h2>
              <p className="text-on-surface-variant text-xs sm:text-sm max-w-xl mx-auto">
                How SupportFlow AI converts probabilistic AI inferences into reliable, enterprise-grade routing actions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {/* Rule A */}
              <div className="bg-surface-container-lowest p-6 rounded-3xl border-2 border-emerald-500/30 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase">
                      Rule A: 90% – 100%
                    </span>
                    <span className="material-symbols-outlined text-emerald-600">bolt</span>
                  </div>
                  <h3 className="font-extrabold text-lg text-on-surface mb-2">Auto-Routed Protocol</h3>
                  <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                    Unambiguous tickets with clear technical context and high classification certainty are dispatched immediately to the assigned departmental queue without human delay.
                  </p>
                </div>
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 font-medium">
                  <strong>Action:</strong> Automated SLA tagging &amp; zero touchpoint dispatch (0% manual effort).
                </div>
              </div>

              {/* Rule B */}
              <div className="bg-surface-container-lowest p-6 rounded-3xl border-2 border-blue-500/30 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-extrabold text-blue-800 bg-blue-100 px-3 py-1 rounded-full uppercase">
                      Rule B: 70% – 89%
                    </span>
                    <span className="material-symbols-outlined text-blue-600">recommend</span>
                  </div>
                  <h3 className="font-extrabold text-lg text-on-surface mb-2">Recommended Protocol</h3>
                  <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                    Tickets with moderate certainty are assigned to the target department with pre-populated categories and priority levels, awaiting single-click agent sign-off.
                  </p>
                </div>
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-[11px] text-blue-900 font-medium">
                  <strong>Action:</strong> Pre-filled triage form with 1-click confirmation by queue dispatcher.
                </div>
              </div>

              {/* Rule C */}
              <div className="bg-surface-container-lowest p-6 rounded-3xl border-2 border-amber-500/30 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-extrabold text-amber-800 bg-amber-100 px-3 py-1 rounded-full uppercase">
                      Rule C: &lt; 70%
                    </span>
                    <span className="material-symbols-outlined text-amber-600">warning</span>
                  </div>
                  <h3 className="font-extrabold text-lg text-on-surface mb-2">Human Escalation Protocol</h3>
                  <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                    Vague submissions, contradictory multi-issue messages, or short inputs (e.g., "Help broken") automatically trigger supervisor review flags to prevent misrouting.
                  </p>
                </div>
                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-[11px] text-amber-900 font-medium">
                  <strong>Action:</strong> Routed to Tier-3 support specialist queue for customer clarification.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 12 Taxonomies & 10 Queues Visual Directory */}
        <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-container-max-width mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12">
            {/* 12 Taxonomies Column */}
            <div className="lg:col-span-6 space-y-4">
              <div className="mb-4">
                <h3 className="font-extrabold text-xl text-on-surface tracking-tight mb-1">
                  12 Standard Support Taxonomies
                </h3>
                <p className="text-xs text-outline">
                  Controlled classification schema ensuring uniform ticket tagging across the enterprise.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {TAXONOMY_CATEGORIES.map((cat) => (
                  <div key={cat.name} className="p-3 bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-2xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-on-surface">{cat.name}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${cat.color}`}>
                        Standard
                      </span>
                    </div>
                    <p className="text-[11px] text-outline line-clamp-2 leading-relaxed">{cat.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 10 Department Queues Column */}
            <div className="lg:col-span-6 space-y-4">
              <div className="mb-4">
                <h3 className="font-extrabold text-xl text-on-surface tracking-tight mb-1">
                  10 Departmental Queue Destinations
                </h3>
                <p className="text-xs text-outline">
                  Direct queue dispatch mapping with demo SLA targets and specialized ownership.
                </p>
              </div>

              <div className="space-y-2">
                {TARGET_QUEUES.slice(0, 5).map((team) => (
                  <div key={team.name} className="p-3 bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-2xs flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">{team.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-on-surface">{team.name}</h4>
                        <p className="text-[11px] text-outline line-clamp-1">{team.desc}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-surface-container-high rounded-full text-[10px] font-bold text-on-surface shrink-0">
                      SLA: {team.sla}
                    </span>
                  </div>
                ))}
                {TARGET_QUEUES.slice(5, 10).map((team) => (
                  <div key={team.name} className="p-3 bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-2xs flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">{team.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-on-surface">{team.name}</h4>
                        <p className="text-[11px] text-outline line-clamp-1">{team.desc}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-surface-container-high rounded-full text-[10px] font-bold text-on-surface shrink-0">
                      SLA: {team.sla}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Comparison: Manual Support vs SupportFlow AI */}
        <section className="bg-surface-bright py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-container-max-width mx-auto">
            <div className="text-center mb-10 sm:mb-14">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mb-2">
                Traditional Manual Triage vs. SupportFlow AI
              </h2>
              <p className="text-on-surface-variant text-xs sm:text-sm max-w-xl mx-auto">
                Comparing manual inbox processing against automated decision orchestration.
              </p>
            </div>

            <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[580px]">
                  <thead>
                    <tr className="border-b border-outline-variant text-[11px] text-outline font-bold uppercase tracking-wider bg-surface-container-low">
                      <th className="py-3.5 px-4">Evaluation Metric</th>
                      <th className="py-3.5 px-4 text-error">Traditional Manual Queue</th>
                      <th className="py-3.5 px-4 text-primary">SupportFlow AI Engine</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/60 text-xs">
                    <tr>
                      <td className="py-3.5 px-4 font-bold text-on-surface">Triage Latency</td>
                      <td className="py-3.5 px-4 text-on-surface-variant">15–45 minutes per ticket</td>
                      <td className="py-3.5 px-4 text-primary font-bold">Real-time (~1.2 seconds)</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-bold text-on-surface">Urgency Prioritization</td>
                      <td className="py-3.5 px-4 text-on-surface-variant">First-In First-Out (FIFO) backlog delay</td>
                      <td className="py-3.5 px-4 text-primary font-bold">Instant Critical outage prioritization</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-bold text-on-surface">Decision Consistency</td>
                      <td className="py-3.5 px-4 text-on-surface-variant">Varies by agent shift and fatigue</td>
                      <td className="py-3.5 px-4 text-primary font-bold">100% deterministic boundary enforcement</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-bold text-on-surface">Multi-ticket Batch Scaling</td>
                      <td className="py-3.5 px-4 text-on-surface-variant">Linear human bottleneck</td>
                      <td className="py-3.5 px-4 text-primary font-bold">Concurrent chunked batch processing</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-bold text-on-surface">Audit Transparency</td>
                      <td className="py-3.5 px-4 text-on-surface-variant">No documented rationale for routing</td>
                      <td className="py-3.5 px-4 text-primary font-bold">Clear AI Decision Rationale generated</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs Accordion */}
        <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-container-max-width mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-on-surface-variant text-xs sm:text-sm max-w-xl mx-auto">
              Everything you need to know about SupportFlow AI architecture and operation.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {FAQS.map((faq, idx) => (
              <div
                key={faq.q}
                className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-xs sm:text-sm text-on-surface flex justify-between items-center cursor-pointer hover:bg-surface-container-low transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="material-symbols-outlined text-outline text-[20px] shrink-0 ml-2">
                    {openFaqIdx === idx ? 'expand_less' : 'expand_more'}
                  </span>
                </button>
                {openFaqIdx === idx && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs text-on-surface-variant leading-relaxed border-t border-outline-variant/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-12 sm:py-16 bg-primary text-on-primary px-4 sm:px-6 lg:px-8">
          <div className="max-w-container-max-width mx-auto text-center space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Ready to Test SupportFlow AI?</h2>
            <p className="text-on-primary/80 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              Experience real-time support triage with single ticket analysis, batch CSV ingestion, and the comprehensive QA verification suite.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => onSelectTab('analyze')}
                className="w-full sm:w-auto bg-white text-primary px-6 sm:px-8 py-3.5 rounded-xl font-bold text-xs sm:text-sm hover:bg-surface-container-lowest transition-all cursor-pointer shadow-sm"
              >
                Start Live Analysis
              </button>
              <button
                type="button"
                onClick={() => onSelectTab('batch')}
                className="w-full sm:w-auto bg-primary-container text-on-primary px-6 sm:px-8 py-3.5 rounded-xl font-bold text-xs sm:text-sm hover:opacity-90 transition-all cursor-pointer border border-white/20"
              >
                Upload Batch CSV Dataset
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Rich Footer */}
      <footer className="bg-on-surface text-surface py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-container-max-width mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-10 sm:mb-12">
            <div className="col-span-1">
              <span className="inline-flex items-center gap-2 font-bold text-base text-primary mb-3 sm:mb-4">
                <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary to-sky-400 flex items-center justify-center text-white">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                  </svg>
                </span>
                <span className="text-white">SupportFlow AI</span>
              </span>
              <p className="text-surface-variant text-xs sm:text-sm leading-relaxed">
                Enterprise customer support triage, decision boundary orchestration, and automated queue routing.
              </p>
            </div>
            <div>
              <h5 className="font-bold mb-3 sm:mb-4 text-white text-xs sm:text-sm">Navigation</h5>
              <ul className="space-y-2.5 text-surface-variant text-xs sm:text-sm">
                <li><a onClick={() => onSelectTab('analyze')} className="hover:text-white transition-colors cursor-pointer">Analyze Ticket</a></li>
                <li><a onClick={() => onSelectTab('batch')} className="hover:text-white transition-colors cursor-pointer">Batch Processing</a></li>
                <li><a onClick={() => onSelectTab('dashboard')} className="hover:text-white transition-colors cursor-pointer">Operations Dashboard</a></li>
                <li><a onClick={() => onSelectTab('qa')} className="hover:text-white transition-colors cursor-pointer">QA Validation Suite</a></li>
                <li><a onClick={() => onSelectTab('about')} className="hover:text-white transition-colors cursor-pointer">Architecture &amp; Rules</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-3 sm:mb-4 text-white text-xs sm:text-sm">Resources &amp; Codebase</h5>
              <ul className="space-y-2.5 text-surface-variant text-xs sm:text-sm">
                <li><a href="https://github.com/bikram73/SupportFlow_AI" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer">GitHub Repository <span className="material-symbols-outlined text-[14px]">open_in_new</span></a></li>
                <li><a href="https://supportflow-ai.netlify.app/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer">Live Netlify Deployment <span className="material-symbols-outlined text-[14px]">open_in_new</span></a></li>
                <li><a onClick={() => onSelectTab('about')} className="hover:text-white transition-colors cursor-pointer">Decision Boundary Matrix</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-surface-variant text-xs">
            <p>© 2026 SupportFlow AI. Enterprise Support Automation.</p>
            <div className="flex gap-4">
              <a href="https://github.com/bikram73/SupportFlow_AI" target="_blank" rel="noopener noreferrer" className="hover:text-white">GitHub</a>
              <span>•</span>
              <a href="https://supportflow-ai.netlify.app/" target="_blank" rel="noopener noreferrer" className="hover:text-white">Netlify</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
