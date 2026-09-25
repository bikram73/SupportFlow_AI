import React from 'react';
import { NavTab } from '../types';

interface HomeViewProps {
  onSelectTab: (tab: NavTab) => void;
  onTrySample: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onSelectTab, onTrySample }) => {
  return (
    <div id="home-view" className="w-full">
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 px-margin-desktop max-w-container-max-width mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full mb-6">
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                <span className="text-body-small font-body-small">SupportFlow AI Engine</span>
              </div>
              <h1 className="font-hero-display text-hero-display-mobile lg:text-hero-display text-on-surface mb-6 leading-tight">
                AI-Powered Support Ticket <span className="text-primary">Triage &amp; Smart Routing</span>
              </h1>
              <p className="text-on-surface-variant text-lg mb-10 max-w-xl">
                Instantly classify, prioritize, and route complex enterprise support tickets using intelligent automation. Transform chaotic inboxes into structured workflows with high-confidence automated decision making.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => onSelectTab('analyze')}
                  className="bg-primary text-on-primary px-8 py-4 rounded-xl font-button-label text-button-label shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  Analyze Ticket <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <button 
                  onClick={onTrySample}
                  className="bg-surface-container-high text-on-surface px-8 py-4 rounded-xl font-button-label text-button-label hover:bg-surface-container-highest transition-all cursor-pointer"
                >
                  Try Sample Tickets
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 to-tertiary/10 blur-3xl rounded-full"></div>
              <div className="relative bg-white p-8 rounded-[32px] shadow-2xl border border-outline-variant">
                <img 
                  className="w-full h-auto rounded-2xl" 
                  alt="A highly detailed 3D digital illustration of a sleek modern AI assistant interface."
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjE--xg0deeypSJEX6dkFi9R70iPnoohPF0xSnBm3F91-VS6IIiFPvVvOB2x3k2StF0qGctRFN3q5BE95JjJ0h11xm8KVP0TaNc-7qTmKW_2aVu9UC4dpJfBMKyZoIqRHU7-Sct0ozHRGTXVE4_hQK9KtSVXCT7RE4r9ltizv64rDwZJAy6o1CCCn-xhfwD1XWkoHEtQR_GVeMkvQUn8kOJCJqRor01XcW4KfFDPSdPi6pyS0OoX3O"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="bg-surface-bright py-24 px-margin-desktop">
          <div className="max-w-container-max-width mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-section-title text-section-title text-on-surface mb-4">Intelligent Triage Capabilities</h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto">Enterprise-grade features designed to handle high-volume support ecosystems with precision and scale.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature Card 1 */}
              <div 
                onClick={() => onSelectTab('analyze')}
                className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <span className="material-symbols-outlined">category</span>
                </div>
                <h3 className="font-card-title text-card-title mb-3">Classification</h3>
                <p className="text-on-surface-variant">Multi-layered intent detection and category assignment based on historical data patterns and semantic context.</p>
              </div>

              {/* Feature Card 2 */}
              <div 
                onClick={() => onSelectTab('analyze')}
                className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <span className="material-symbols-outlined">priority_high</span>
                </div>
                <h3 className="font-card-title text-card-title mb-3">Urgency Detection</h3>
                <p className="text-on-surface-variant">Real-time sentiment analysis that detects critical issues and SLA-sensitive requests before they escalate.</p>
              </div>

              {/* Feature Card 3 */}
              <div 
                onClick={() => onSelectTab('analyze')}
                className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant hover:shadow-md transition-all group ai-gradient-border cursor-pointer"
              >
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <span className="material-symbols-outlined">verified</span>
                </div>
                <h3 className="font-card-title text-card-title mb-3">Confidence Scores</h3>
                <p className="text-on-surface-variant">Every classification includes a confidence percentage, allowing for automated routing or human intervention thresholds.</p>
              </div>

              {/* Feature Card 4 */}
              <div 
                onClick={() => onSelectTab('dashboard')}
                className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <span className="material-symbols-outlined">alt_route</span>
                </div>
                <h3 className="font-card-title text-card-title mb-3">Smart Routing</h3>
                <p className="text-on-surface-variant">Dynamically assign tickets to the most qualified agent or department based on skill sets and current workload.</p>
              </div>

              {/* Feature Card 5 */}
              <div 
                onClick={() => onSelectTab('batch')}
                className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <span className="material-symbols-outlined">stack</span>
                </div>
                <h3 className="font-card-title text-card-title mb-3">Batch Processing</h3>
                <p className="text-on-surface-variant">Process thousands of historical or backlogged tickets simultaneously to clean up and re-organize your CRM.</p>
              </div>

              {/* Feature Card 6 */}
              <div 
                onClick={() => onSelectTab('about')}
                className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <span className="material-symbols-outlined">person_search</span>
                </div>
                <h3 className="font-card-title text-card-title mb-3">Human Review</h3>
                <p className="text-on-surface-variant">Seamless hand-off for low-confidence classifications with full AI-generated summaries and reasoning logs.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 px-margin-desktop max-w-container-max-width mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="lg:w-1/3 sticky top-32">
              <h2 className="font-section-title text-section-title text-on-surface mb-6">How SupportFlow AI Operates</h2>
              <p className="text-on-surface-variant mb-8">From data ingestion to resolution, we've optimized every step of the ticket lifecycle with cutting-edge Large Language Models.</p>
              <button 
                onClick={() => onSelectTab('about')}
                className="text-primary font-button-label text-button-label flex items-center gap-2 hover:gap-3 transition-all cursor-pointer"
              >
                Explore the Architecture <span className="material-symbols-outlined">arrow_right_alt</span>
              </button>
            </div>
            <div className="lg:w-2/3 space-y-12">
              <div className="flex gap-6 group">
                <div className="flex-shrink-0 w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center font-bold text-primary group-hover:bg-primary group-hover:text-on-primary transition-all">1</div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Paste or API Ingest</h4>
                  <p className="text-on-surface-variant">Connect your existing CRM (Zendesk, Salesforce, HubSpot) or manually paste raw ticket content for instant analysis.</p>
                </div>
              </div>
              <div className="flex gap-6 group">
                <div className="flex-shrink-0 w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center font-bold text-primary group-hover:bg-primary group-hover:text-on-primary transition-all">2</div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Deep Semantic Analysis</h4>
                  <p className="text-on-surface-variant">Advanced AI parses the language, tone, and technical details to understand the core problem beyond simple keywords.</p>
                </div>
              </div>
              <div className="flex gap-6 group">
                <div className="flex-shrink-0 w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center font-bold text-primary group-hover:bg-primary group-hover:text-on-primary transition-all">3</div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Dynamic Classification</h4>
                  <p className="text-on-surface-variant">The system assigns tags, priority levels, and labels based on your custom enterprise taxonomy rules.</p>
                </div>
              </div>
              <div className="flex gap-6 group">
                <div className="flex-shrink-0 w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center font-bold text-primary group-hover:bg-primary group-hover:text-on-primary transition-all">4</div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Automated Routing</h4>
                  <p className="text-on-surface-variant">The ticket is automatically pushed to the correct workspace or assigned to the specialist with the matching skill tag.</p>
                </div>
              </div>
              <div className="flex gap-6 group">
                <div className="flex-shrink-0 w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center font-bold text-primary group-hover:bg-primary group-hover:text-on-primary transition-all">5</div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Agent Final Review</h4>
                  <p className="text-on-surface-variant">Agents receive the ticket with a pre-drafted summary and suggested next steps, reducing response time by up to 70%.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 bg-primary text-on-primary relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          </div>
          <div className="px-margin-desktop max-w-container-max-width mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="font-section-title text-section-title mb-4">Engineered for Enterprise Impact</h2>
              <p className="text-on-primary/80 max-w-2xl mx-auto">Measurable improvements in operational efficiency and customer satisfaction from day one.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="glass-card p-6 rounded-2xl border border-white/20 text-on-surface">
                <div className="text-primary text-3xl font-extrabold mb-2">-85%</div>
                <div className="font-bold mb-2">Manual Triage</div>
                <p className="text-on-surface-variant text-sm">Eliminate the need for dedicated triage teams to manually read every incoming message.</p>
              </div>
              <div className="glass-card p-6 rounded-2xl border border-white/20 text-on-surface">
                <div className="text-primary text-3xl font-extrabold mb-2">4.2x</div>
                <div className="font-bold mb-2">Faster Response</div>
                <p className="text-on-surface-variant text-sm">Tickets reach the right specialist instantly, drastically reducing mean time to resolution.</p>
              </div>
              <div className="glass-card p-6 rounded-2xl border border-white/20 text-on-surface">
                <div className="text-primary text-3xl font-extrabold mb-2">99%</div>
                <div className="font-bold mb-2">Routing Accuracy</div>
                <p className="text-on-surface-variant text-sm">LLM-powered understanding ensures fewer "wrong department" ticket transfers.</p>
              </div>
              <div className="glass-card p-6 rounded-2xl border border-white/20 text-on-surface">
                <div className="text-primary text-3xl font-extrabold mb-2">SOC2</div>
                <div className="font-bold mb-2">Enterprise Ready</div>
                <p className="text-on-surface-variant text-sm">Built with privacy first: Data anonymization, role-based access, and full audit logs.</p>
              </div>
            </div>
            <div className="mt-20 p-8 rounded-3xl bg-surface-container-lowest text-on-surface flex flex-col md:flex-row items-center justify-between gap-8 border border-white/20 shadow-2xl">
              <div>
                <h3 className="text-2xl font-bold mb-2">AI Explanations &amp; Transparency</h3>
                <p className="text-on-surface-variant">Every AI decision includes a clear AI Decision Rationale so your team understands the 'Why' behind every route.</p>
              </div>
              <button 
                onClick={() => onSelectTab('about')}
                className="whitespace-nowrap bg-tertiary text-on-tertiary px-10 py-4 rounded-xl font-bold hover:bg-tertiary-container transition-all cursor-pointer"
              >
                Schedule Demo
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-on-surface text-surface py-20 px-margin-desktop">
        <div className="max-w-container-max-width mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <span className="inline-flex items-center gap-2.5 font-card-title text-card-title text-primary mb-6">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary via-blue-600 to-sky-400 flex items-center justify-center text-white shadow-sm ring-1 ring-white/10">
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </span>
                <span className="font-bold tracking-tight text-white">SupportFlow AI</span>
              </span>
              <p className="text-surface-variant text-sm leading-relaxed">
                The next generation of enterprise support triage. Leveraging intelligent AI to bring automation to your customer service workflow.
              </p>
            </div>
            <div>
              <h5 className="font-bold mb-6 text-white">Resources</h5>
              <ul className="space-y-4 text-surface-variant text-sm">
                <li><a onClick={() => onSelectTab('about')} className="hover:text-white transition-colors cursor-pointer" href="#about">Documentation</a></li>
                <li><a onClick={() => onSelectTab('about')} className="hover:text-white transition-colors flex items-center gap-2 cursor-pointer" href="#github">GitHub <span className="material-symbols-outlined text-[16px]">open_in_new</span></a></li>
                <li><a onClick={() => onSelectTab('about')} className="hover:text-white transition-colors cursor-pointer" href="#api">API Reference</a></li>
                <li><a onClick={() => onSelectTab('about')} className="hover:text-white transition-colors cursor-pointer" href="#forum">Community Forum</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-6 text-white">Company</h5>
              <ul className="space-y-4 text-surface-variant text-sm">
                <li><a onClick={() => onSelectTab('about')} className="hover:text-white transition-colors cursor-pointer" href="#about">About Us</a></li>
                <li><a onClick={() => onSelectTab('about')} className="hover:text-white transition-colors cursor-pointer" href="#security">Security &amp; Privacy</a></li>
                <li><a onClick={() => onSelectTab('about')} className="hover:text-white transition-colors cursor-pointer" href="#terms">Terms of Service</a></li>
                <li><a onClick={() => onSelectTab('about')} className="hover:text-white transition-colors cursor-pointer" href="#contact">Contact Support</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-surface-variant text-sm">
            <p>© 2026 SupportFlow AI. All rights reserved.</p>
            <div className="flex gap-6">
              <a className="hover:text-white" href="#brand"><span className="material-symbols-outlined">brand_family</span></a>
              <a className="hover:text-white" href="#email"><span className="material-symbols-outlined">alternate_email</span></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
