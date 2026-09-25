import React from 'react';
import { NavTab } from '../types';

interface AboutViewProps {
  onSelectTab: (tab: NavTab) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onSelectTab }) => {
  return (
    <div id="about-view" className="w-full">
      <main className="max-w-container-max-width mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full mb-3 sm:mb-4 text-xs font-bold">
            <span className="material-symbols-outlined text-[16px]">info</span> SupportFlow AI Architecture
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-on-surface mb-3 sm:mb-4 tracking-tight">
            Intelligent Triage for Enterprise Support
          </h1>
          <p className="text-on-surface-variant text-xs sm:text-sm lg:text-base leading-relaxed max-w-2xl mx-auto">
            SupportFlow AI bridges customer requests and resolution engineering by combining semantic context extraction with deterministic rule engines.
          </p>
          <div className="flex justify-center gap-2 mt-4 sm:mt-6 flex-wrap">
            <span className="px-2.5 sm:px-3 py-1 bg-surface-container-high rounded-full text-[11px] sm:text-xs font-bold text-on-surface">
              High Velocity (~0.8s)
            </span>
            <span className="px-2.5 sm:px-3 py-1 bg-surface-container-high rounded-full text-[11px] sm:text-xs font-bold text-on-surface">
              Enterprise Grade SLA
            </span>
            <span className="px-2.5 sm:px-3 py-1 bg-primary/10 text-primary rounded-full text-[11px] sm:text-xs font-bold">
              AI-Powered Engine
            </span>
          </div>
        </div>

        {/* Problem Statement Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-10 sm:mb-16">
          <div className="bg-surface-container-lowest p-5 sm:p-7 rounded-3xl border border-outline-variant shadow-xs">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-error/10 text-error rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
              <span className="material-symbols-outlined text-[22px] sm:text-[24px]">hourglass_disabled</span>
            </div>
            <h3 className="font-bold text-base sm:text-lg text-on-surface mb-2">Manual Congestion</h3>
            <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed">
              Human agents spend up to 25% of their working hours manually triaging, reading, and assigning tickets to the right queues.
            </p>
          </div>

          <div className="bg-surface-container-lowest p-5 sm:p-7 rounded-3xl border border-outline-variant shadow-xs">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-tertiary/10 text-tertiary rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
              <span className="material-symbols-outlined text-[22px] sm:text-[24px]">sync_problem</span>
            </div>
            <h3 className="font-bold text-base sm:text-lg text-on-surface mb-2">Cross-Team Friction</h3>
            <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed">
              Misrouted tickets get bounced across departments, increasing mean time to resolution and triggering SLA violations.
            </p>
          </div>

          <div className="bg-surface-container-lowest p-5 sm:p-7 rounded-3xl border border-outline-variant shadow-xs ai-gradient-border">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
              <span className="material-symbols-outlined text-[22px] sm:text-[24px]">auto_awesome</span>
            </div>
            <h3 className="font-bold text-base sm:text-lg text-on-surface mb-2">Decision Orchestration</h3>
            <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed">
              SupportFlow AI acts as a high-speed routing layer, evaluating semantic intent and outputting strict JSON for seamless CRM dispatch.
            </p>
          </div>
        </div>

        {/* Decision Architecture Table */}
        <div className="bg-surface-container-lowest p-4 sm:p-6 lg:p-8 rounded-3xl border border-outline-variant shadow-xs mb-10 sm:mb-16">
          <h3 className="font-bold text-base sm:text-lg text-on-surface mb-4 sm:mb-6">Decision Architecture Matrix</h3>
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-outline-variant text-[11px] text-outline font-bold uppercase tracking-wider">
                  <th className="py-3 px-3 sm:px-4">Confidence Level</th>
                  <th className="py-3 px-3 sm:px-4">AI Protocol</th>
                  <th className="py-3 px-3 sm:px-4">Execution Path</th>
                  <th className="py-3 px-3 sm:px-4 text-right">Human Touchpoint</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/60 text-xs sm:text-sm">
                <tr>
                  <td className="py-3.5 px-3 sm:px-4 font-bold text-primary">90% - 100%</td>
                  <td className="py-3.5 px-3 sm:px-4">
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-bold">
                      AUTO-TRIAGE
                    </span>
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 text-on-surface">Direct route to target team queue with automated SLA tag.</td>
                  <td className="py-3.5 px-3 sm:px-4 text-right text-outline">None (0%)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-3 sm:px-4 font-bold text-blue-600">70% - 89%</td>
                  <td className="py-3.5 px-3 sm:px-4">
                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-[11px] font-bold">
                      RECOMMENDED
                    </span>
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 text-on-surface">Pushed to department inbox with pre-filled category tag.</td>
                  <td className="py-3.5 px-3 sm:px-4 text-right text-outline">1-Click Approval</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-3 sm:px-4 font-bold text-error">&lt; 70%</td>
                  <td className="py-3.5 px-3 sm:px-4">
                    <span className="px-2.5 py-0.5 bg-error-container text-on-error-container rounded-full text-[11px] font-bold">
                      HUMAN ESCALATION
                    </span>
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 text-on-surface">Flagged for tier-3 specialist manual review queue.</td>
                  <td className="py-3.5 px-3 sm:px-4 text-right text-error font-bold">Full Manual Triage</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* How AI Triage Works Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center mb-10 sm:mb-16">
          <div className="lg:col-span-6 space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">How the AI Engine Works Under the Hood</h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-xs flex gap-3.5">
                <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-sm">
                  1
                </span>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-on-surface mb-0.5">Semantic Intent Parsing</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Incoming tickets are evaluated for customer intent, tone, technical context, and urgency markers.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-xs flex gap-3.5">
                <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-sm">
                  2
                </span>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-on-surface mb-0.5">Taxonomy &amp; Boundary Evaluation</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Evaluates probabilities against 12 standard categories, 4 urgency levels, and 10 routing departments.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-xs flex gap-3.5">
                <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-sm">
                  3
                </span>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-on-surface mb-0.5">Closing the Loop</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Outputs structured JSON containing assigned team, urgency badge, confidence score, and concise decision rationale.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-xl border border-outline-variant">
              <img
                className="w-full h-auto rounded-2xl"
                alt="A 3D graphic showing interconnected data flow channels."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEdzSqiYXWqRNe91VR58hpSCrEEjLK578_hvuHBQQihxJlmpuOFRDnTtUny9v99GSFKnmIX0_54qGekDR-_YknGwbjcsswKJLRTPv-PARzDozS83yH3DkbEfYwnnWe9NAw14v4NPHoKIhrBLgkUPjEGvGrSUbW_XD6Q8Ko7e3rZoQth7-8lU74YCe6qXKkCGCr5p0oBVvhB7BsBv03Gaca2bH7w1J9yckp189nMBn0wd3Fn6QoQQr_"
              />
            </div>
          </div>
        </div>

        {/* Tech Stack Banner */}
        <div className="bg-primary text-on-primary p-6 sm:p-10 rounded-3xl text-center space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Ready to Test SupportFlow AI?</h2>
          <p className="text-on-primary/80 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Try analyzing sample tickets or explore batch processing capabilities in our interactive playground environment.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => onSelectTab('analyze')}
              className="w-full sm:w-auto bg-white text-primary px-6 sm:px-8 py-3.5 rounded-xl font-bold text-xs sm:text-sm hover:bg-surface-container-lowest transition-all cursor-pointer shadow-sm"
            >
              Start Live Ticket Analysis
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('batch')}
              className="w-full sm:w-auto bg-primary-container text-on-primary px-6 sm:px-8 py-3.5 rounded-xl font-bold text-xs sm:text-sm hover:opacity-90 transition-all cursor-pointer border border-white/20"
            >
              Upload Batch Dataset
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-on-surface text-surface py-10 sm:py-16 px-4 sm:px-6 lg:px-8 mt-12 sm:mt-20">
        <div className="max-w-container-max-width mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-surface-variant text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-white">SupportFlow AI</span>
            <span>•</span>
            <span>Enterprise Triage Dashboard</span>
          </div>
          <p>© 2026 SupportFlow AI. Enterprise Support Automation.</p>
        </div>
      </footer>
    </div>
  );
};
