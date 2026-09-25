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
        <section className="relative overflow-hidden pt-8 pb-14 sm:pt-14 sm:pb-20 lg:pt-20 lg:pb-28 px-4 sm:px-6 lg:px-8 max-w-container-max-width mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div className="z-10 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full mb-4 sm:mb-6 text-xs sm:text-sm font-medium">
                <span className="material-symbols-outlined text-[16px] sm:text-[18px]">auto_awesome</span>
                <span>SupportFlow AI Engine</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface mb-4 sm:mb-6 leading-tight tracking-tight">
                AI-Powered Support Ticket <span className="text-primary">Triage &amp; Smart Routing</span>
              </h1>
              <p className="text-on-surface-variant text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 max-w-xl leading-relaxed">
                Instantly classify, prioritize, and route complex enterprise support tickets using intelligent automation. Transform chaotic inboxes into structured workflows with high-confidence decision making.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button 
                  onClick={() => onSelectTab('analyze')}
                  className="w-full sm:w-auto bg-primary text-on-primary px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[48px] active:scale-[0.99]"
                >
                  <span>Analyze Ticket</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
                <button 
                  onClick={onTrySample}
                  className="w-full sm:w-auto bg-surface-container-high text-on-surface px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-sm hover:bg-surface-container-highest transition-all cursor-pointer min-h-[48px] flex items-center justify-center"
                >
                  Try Sample Tickets
                </button>
              </div>
            </div>
            <div className="relative mt-4 lg:mt-0">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 to-tertiary/10 blur-2xl rounded-full"></div>
              <div className="relative bg-white p-4 sm:p-6 lg:p-8 rounded-3xl shadow-xl border border-outline-variant">
                <img 
                  className="w-full h-auto rounded-2xl object-cover max-h-[320px] sm:max-h-[400px]" 
                  alt="A modern AI assistant interface illustration."
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjE--xg0deeypSJEX6dkFi9R70iPnoohPF0xSnBm3F91-VS6IIiFPvVvOB2x3k2StF0qGctRFN3q5BE95JjJ0h11xm8KVP0TaNc-7qTmKW_2aVu9UC4dpJfBMKyZoIqRHU7-Sct0ozHRGTXVE4_hQK9KtSVXCT7RE4r9ltizv64rDwZJAy6o1CCCn-xhfwD1XWkoHEtQR_GVeMkvQUn8kOJCJqRor01XcW4KfFDPSdPi6pyS0OoX3O"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="bg-surface-bright py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-container-max-width mx-auto">
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mb-2 sm:mb-3">Intelligent Triage Capabilities</h2>
              <p className="text-on-surface-variant text-xs sm:text-sm max-w-2xl mx-auto">Enterprise-grade features designed to handle high-volume support ecosystems with precision and scale.</p>
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
                <h3 className="font-bold text-base sm:text-lg mb-2">Intent Classification</h3>
                <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed">Multi-layered intent detection and category assignment across 12 standard support taxonomies.</p>
              </div>

              {/* Feature Card 2 */}
              <div 
                onClick={() => onSelectTab('analyze')}
                className="bg-surface-container-lowest p-5 sm:p-7 rounded-3xl shadow-xs border border-outline-variant hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <span className="material-symbols-outlined text-[22px] sm:text-[24px]">priority_high</span>
                </div>
                <h3 className="font-bold text-base sm:text-lg mb-2">Urgency Detection</h3>
                <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed">Real-time sentiment and urgency analysis that detects critical production outages before SLAs escalate.</p>
              </div>

              {/* Feature Card 3 */}
              <div 
                onClick={() => onSelectTab('analyze')}
                className="bg-surface-container-lowest p-5 sm:p-7 rounded-3xl shadow-xs border border-outline-variant hover:shadow-md transition-all group ai-gradient-border cursor-pointer"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <span className="material-symbols-outlined text-[22px] sm:text-[24px]">verified</span>
                </div>
                <h3 className="font-bold text-base sm:text-lg mb-2">Confidence Boundaries</h3>
                <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed">Every classification computes a confidence percentage, executing Rule A (≥90%), Rule B (70-89%), or Rule C (&lt;70%).</p>
              </div>

              {/* Feature Card 4 */}
              <div 
                onClick={() => onSelectTab('dashboard')}
                className="bg-surface-container-lowest p-5 sm:p-7 rounded-3xl shadow-xs border border-outline-variant hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <span className="material-symbols-outlined text-[22px] sm:text-[24px]">alt_route</span>
                </div>
                <h3 className="font-bold text-base sm:text-lg mb-2">Smart Department Routing</h3>
                <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed">Dynamically routes tickets directly to Infrastructure, Engineering, Billing, Account, or Security teams.</p>
              </div>

              {/* Feature Card 5 */}
              <div 
                onClick={() => onSelectTab('batch')}
                className="bg-surface-container-lowest p-5 sm:p-7 rounded-3xl shadow-xs border border-outline-variant hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <span className="material-symbols-outlined text-[22px] sm:text-[24px]">dataset</span>
                </div>
                <h3 className="font-bold text-base sm:text-lg mb-2">Batch Processing</h3>
                <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed">Process datasets of tickets simultaneously with search, multi-filter queries, and CSV/JSON export.</p>
              </div>

              {/* Feature Card 6 */}
              <div 
                onClick={() => onSelectTab('qa')}
                className="bg-surface-container-lowest p-5 sm:p-7 rounded-3xl shadow-xs border border-outline-variant hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <span className="material-symbols-outlined text-[22px] sm:text-[24px]">checklist</span>
                </div>
                <h3 className="font-bold text-base sm:text-lg mb-2">QA &amp; Verification Suite</h3>
                <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed">Execute 50 golden test fixtures, verify decision boundaries, and audit security injection resistance in 1-click.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-container-max-width mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 lg:gap-16 items-start">
            <div className="lg:w-1/3 lg:sticky lg:top-24">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface mb-3 sm:mb-4 tracking-tight">How SupportFlow AI Operates</h2>
              <p className="text-on-surface-variant text-xs sm:text-sm mb-6 leading-relaxed">From ticket ingestion to team dispatch, we've optimized every step of the support workflow with real-time classification intelligence.</p>
              <button 
                onClick={() => onSelectTab('about')}
                className="text-primary font-bold text-xs sm:text-sm flex items-center gap-1.5 hover:gap-2 transition-all cursor-pointer"
              >
                Explore Decision Architecture <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
            <div className="lg:w-2/3 space-y-6 sm:space-y-8 w-full">
              <div className="flex gap-4 sm:gap-5 group bg-surface-container-lowest p-4 sm:p-6 rounded-2xl border border-outline-variant">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold mb-1">Paste or API Ingest</h4>
                  <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed">Connect via REST endpoint or manually enter customer messages for real-time inference.</p>
                </div>
              </div>
              <div className="flex gap-4 sm:gap-5 group bg-surface-container-lowest p-4 sm:p-6 rounded-2xl border border-outline-variant">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold mb-1">Deep Semantic Analysis</h4>
                  <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed">Parses language, tone, and technical keywords to extract core intent and determine urgency tier.</p>
                </div>
              </div>
              <div className="flex gap-4 sm:gap-5 group bg-surface-container-lowest p-4 sm:p-6 rounded-2xl border border-outline-variant">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold mb-1">Boundary Decision &amp; Routing</h4>
                  <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed">Computes confidence, auto-routes tickets meeting threshold (≥90%), and flags ambiguous items for supervisor review.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Banner */}
        <section className="py-12 sm:py-16 bg-primary text-on-primary relative overflow-hidden px-4 sm:px-6 lg:px-8">
          <div className="max-w-container-max-width mx-auto relative z-10">
            <div className="text-center mb-10 sm:mb-14">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 sm:mb-3">Engineered for Enterprise Impact</h2>
              <p className="text-on-primary/80 text-xs sm:text-sm max-w-xl mx-auto">Measurable improvements in support throughput and triage accuracy from day one.</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <div className="glass-card p-4 sm:p-6 rounded-2xl border border-white/20 text-on-surface">
                <div className="text-primary text-2xl sm:text-3xl font-extrabold mb-1">Real-Time</div>
                <div className="font-bold text-xs sm:text-sm mb-1">Instant Triage</div>
                <p className="text-on-surface-variant text-[11px] sm:text-xs">Automated intent and urgency classification in seconds.</p>
              </div>
              <div className="glass-card p-4 sm:p-6 rounded-2xl border border-white/20 text-on-surface">
                <div className="text-primary text-2xl sm:text-3xl font-extrabold mb-1">12</div>
                <div className="font-bold text-xs sm:text-sm mb-1">Standard Categories</div>
                <p className="text-on-surface-variant text-[11px] sm:text-xs">Taxonomy-controlled routing across enterprise domains.</p>
              </div>
              <div className="glass-card p-4 sm:p-6 rounded-2xl border border-white/20 text-on-surface">
                <div className="text-primary text-2xl sm:text-3xl font-extrabold mb-1">10</div>
                <div className="font-bold text-xs sm:text-sm mb-1">Target Queues</div>
                <p className="text-on-surface-variant text-[11px] sm:text-xs">Strict team mapping prevents misrouted support tickets.</p>
              </div>
              <div className="glass-card p-4 sm:p-6 rounded-2xl border border-white/20 text-on-surface">
                <div className="text-primary text-2xl sm:text-3xl font-extrabold mb-1">Stateless</div>
                <div className="font-bold text-xs sm:text-sm mb-1">Zero Database</div>
                <p className="text-on-surface-variant text-[11px] sm:text-xs">Lightweight execution with in-memory &amp; LocalStorage caching.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
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
                Enterprise support triage and decision orchestration engine.
              </p>
            </div>
            <div>
              <h5 className="font-bold mb-3 sm:mb-4 text-white text-xs sm:text-sm">Navigation</h5>
              <ul className="space-y-2.5 text-surface-variant text-xs sm:text-sm">
                <li><a onClick={() => onSelectTab('analyze')} className="hover:text-white transition-colors cursor-pointer">Analyze Ticket</a></li>
                <li><a onClick={() => onSelectTab('batch')} className="hover:text-white transition-colors cursor-pointer">Batch Processing</a></li>
                <li><a onClick={() => onSelectTab('dashboard')} className="hover:text-white transition-colors cursor-pointer">Operations Dashboard</a></li>
                <li><a onClick={() => onSelectTab('qa')} className="hover:text-white transition-colors cursor-pointer">QA Validation Suite</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-3 sm:mb-4 text-white text-xs sm:text-sm">Resources &amp; Repo</h5>
              <ul className="space-y-2.5 text-surface-variant text-xs sm:text-sm">
                <li><a href="https://github.com/bikram73/SupportFlow_AI" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer">GitHub Repository <span className="material-symbols-outlined text-[14px]">open_in_new</span></a></li>
                <li><a href="https://supportflow-ai.netlify.app/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer">Live Netlify App <span className="material-symbols-outlined text-[14px]">open_in_new</span></a></li>
                <li><a onClick={() => onSelectTab('about')} className="hover:text-white transition-colors cursor-pointer">Decision Architecture</a></li>
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
