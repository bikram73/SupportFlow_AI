import React from 'react';
import { NavTab } from '../types';

interface AboutViewProps {
  onSelectTab: (tab: NavTab) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onSelectTab }) => {
  return (
    <div id="about-view" className="w-full">
      <main className="max-w-container-max-width mx-auto px-margin-desktop py-12">
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full mb-4 text-xs font-bold">
            <span className="material-symbols-outlined text-[16px]">info</span> SupportFlow AI Architecture
          </div>
          <h1 className="font-section-title text-section-title text-on-surface mb-4">
            Intelligent Triage for Enterprise Support
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            SupportFlow AI bridges customer requests and resolution engineering by combining semantic context extraction with deterministic rule engines.
          </p>
          <div className="flex justify-center gap-2 mt-6 flex-wrap">
            <span className="px-3 py-1 bg-surface-container-high rounded-full text-xs font-bold text-on-surface">
              High Velocity (~0.8s)
            </span>
            <span className="px-3 py-1 bg-surface-container-high rounded-full text-xs font-bold text-on-surface">
              Enterprise Grade SLA
            </span>
            <span className="px-3 py-1 bg-primary-container/20 text-primary rounded-full text-xs font-bold">
              AI-Powered Engine
            </span>
          </div>
        </div>

        {/* Problem Statement Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant shadow-sm">
            <div className="w-12 h-12 bg-error/10 text-error rounded-2xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined">hourglass_disabled</span>
            </div>
            <h3 className="font-card-title text-card-title text-on-surface mb-3">Manual Congestion</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Human agents spend up to 25% of their working hours manually triaging, reading, and assigning tickets to the right queues.
            </p>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant shadow-sm">
            <div className="w-12 h-12 bg-tertiary/10 text-tertiary rounded-2xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined">sync_problem</span>
            </div>
            <h3 className="font-card-title text-card-title text-on-surface mb-3">Cross-Team Friction</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Misrouted tickets get bounced across departments, increasing mean time to resolution and triggering SLA violations.
            </p>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant shadow-sm ai-gradient-border">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined">auto_awesome</span>
            </div>
            <h3 className="font-card-title text-card-title text-on-surface mb-3">Decision Orchestration</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              SupportFlow AI acts as a high-speed routing layer, evaluating semantic intent and outputting strict JSON for seamless CRM dispatch.
            </p>
          </div>
        </div>

        {/* Decision Architecture Table */}
        <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant shadow-sm mb-16">
          <h3 className="font-card-title text-card-title text-on-surface mb-6">Decision Architecture Matrix</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant text-xs text-outline font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Confidence Level</th>
                  <th className="py-3 px-4">AI Protocol</th>
                  <th className="py-3 px-4">Execution Path</th>
                  <th className="py-3 px-4 text-right">Human Touchpoint</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/60 text-sm">
                <tr>
                  <td className="py-4 px-4 font-bold text-primary">90% - 100%</td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold">
                      AUTO-TRIAGE
                    </span>
                  </td>
                  <td className="py-4 px-4 text-on-surface">Direct route to target team queue with automated SLA tag.</td>
                  <td className="py-4 px-4 text-right text-outline">None (0%)</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold text-tertiary">70% - 89%</td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-full text-xs font-bold">
                      RECOMMENDED
                    </span>
                  </td>
                  <td className="py-4 px-4 text-on-surface">Pushed to department inbox with pre-filled category tag.</td>
                  <td className="py-4 px-4 text-right text-outline">1-Click Agent Approval</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold text-error">&lt; 70%</td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 bg-error-container text-on-error-container rounded-full text-xs font-bold">
                      HUMAN ESCALATION
                    </span>
                  </td>
                  <td className="py-4 px-4 text-on-surface">Flagged for tier-3 specialist manual review queue.</td>
                  <td className="py-4 px-4 text-right text-error font-bold">Full Manual Triage</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* How AI Triage Works Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="font-section-title text-section-title text-on-surface">How the AI Engine Works Under the Hood</h2>
            <div className="space-y-4">
              <div className="p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm flex gap-4">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <h4 className="font-bold text-on-surface mb-1">Semantic Tokenization</h4>
                  <p className="text-xs text-on-surface-variant">
                    Incoming tickets are converted into high-dimensional vector embeddings, identifying tone, technical urgency, and user intent.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm flex gap-4">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <h4 className="font-bold text-on-surface mb-1">Multi-Agent Triage</h4>
                  <p className="text-xs text-on-surface-variant">
                    The triage engine evaluates category probabilities against your custom enterprise taxonomy rules in real-time.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm flex gap-4">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <h4 className="font-bold text-on-surface mb-1">Closing the Loop</h4>
                  <p className="text-xs text-on-surface-variant">
                    Outputs structured JSON containing assigned team, urgency badge, confidence score, and chain-of-thought rationale.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="bg-white p-6 rounded-[32px] shadow-xl border border-outline-variant">
              <img
                className="w-full h-auto rounded-2xl"
                alt="A clean, isometric 3D graphic showing interconnected data flow channels."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEdzSqiYXWqRNe91VR58hpSCrEEjLK578_hvuHBQQihxJlmpuOFRDnTtUny9v99GSFKnmIX0_54qGekDR-_YknGwbjcsswKJLRTPv-PARzDozS83yH3DkbEfYwnnWe9NAw14v4NPHoKIhrBLgkUPjEGvGrSUbW_XD6Q8Ko7e3rZoQth7-8lU74YCe6qXKkCGCr5p0oBVvhB7BsBv03Gaca2bH7w1J9yckp189nMBn0wd3Fn6QoQQr_"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant shadow-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary-container text-on-secondary-container rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined">speed</span>
              </div>
              <div>
                <span className="text-xs font-bold text-on-surface block">0.8s Avg Processing Time</span>
                <span className="text-[10px] text-outline">Optimized Inference Stream</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack Banner */}
        <div className="bg-primary text-on-primary p-10 rounded-3xl text-center space-y-6">
          <h2 className="font-section-title text-section-title">Ready to Test SupportFlow AI?</h2>
          <p className="text-on-primary/80 max-w-xl mx-auto">
            Try analyzing sample tickets or explore batch processing capabilities in our interactive playground environment.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              type="button"
              onClick={() => onSelectTab('analyze')}
              className="bg-white text-primary px-8 py-3.5 rounded-xl font-bold hover:bg-surface-container-lowest transition-all cursor-pointer"
            >
              Start Live Ticket Analysis
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('batch')}
              className="bg-primary-container text-on-primary px-8 py-3.5 rounded-xl font-bold hover:opacity-90 transition-all cursor-pointer border border-white/20"
            >
              Upload Batch Dataset
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-on-surface text-surface py-16 px-margin-desktop mt-20">
        <div className="max-w-container-max-width mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-surface-variant">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white text-base">SupportFlow AI</span>
            <span>•</span>
            <span>Enterprise Triage Dashboard</span>
          </div>
          <p>© 2026 SupportFlow AI. Enterprise Support Automation.</p>
        </div>
      </footer>
    </div>
  );
};
