import React, { useState } from 'react';
import { NavTab, RecentEvent } from '../types';

interface DashboardViewProps {
  onSelectTab: (tab: NavTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onSelectTab }) => {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');
  const [searchQuery, setSearchQuery] = useState('');

  const [recentEvents] = useState<RecentEvent[]>([
    {
      id: 'EV-9021',
      subject: 'Critical DB Connection Timeout in US-East-1',
      category: 'Technical Issue',
      urgency: 'Critical',
      team: 'Infrastructure Team',
      confidence: 99,
      humanReview: false,
      status: 'Auto Routed',
      timestamp: '2 mins ago'
    },
    {
      id: 'EV-9020',
      subject: 'Refund request - Charged twice on July 1st',
      category: 'Billing',
      urgency: 'Medium',
      team: 'Billing Team',
      confidence: 98,
      humanReview: false,
      status: 'Auto Routed',
      timestamp: '5 mins ago'
    },
    {
      id: 'EV-9019',
      subject: 'Application crashes every time PDF is uploaded',
      category: 'Bug Report',
      urgency: 'High',
      team: 'Engineering',
      confidence: 93,
      humanReview: false,
      status: 'Auto Routed',
      timestamp: '10 mins ago'
    },
    {
      id: 'EV-9018',
      subject: 'Okta SAML Single Sign-On Certificate Expired',
      category: 'Account Access',
      urgency: 'High',
      team: 'Account Team',
      confidence: 68,
      humanReview: true,
      status: 'Needs Review',
      timestamp: '15 mins ago'
    },
    {
      id: 'EV-9017',
      subject: 'Please add Dark Mode support',
      category: 'Feature Request',
      urgency: 'Low',
      team: 'Product Team',
      confidence: 96,
      humanReview: false,
      status: 'Auto Routed',
      timestamp: '22 mins ago'
    },
    {
      id: 'EV-9016',
      subject: 'It is broken help please',
      category: 'General Question',
      urgency: 'Low',
      team: 'General Support',
      confidence: 58,
      humanReview: true,
      status: 'Needs Review',
      timestamp: '30 mins ago'
    }
  ]);

  const filteredEvents = recentEvents.filter(
    (e) =>
      e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.team.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="dashboard-view" className="w-full">
      <div className="max-w-container-max-width mx-auto px-margin-desktop py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3 bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm h-fit space-y-6">
            {/* User Profile Info */}
            <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-2xl">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold">
                SF
              </div>
              <div>
                <h4 className="font-bold text-on-surface text-sm">Support Operations</h4>
                <span className="text-xs text-outline">AI Decision Engine</span>
              </div>
            </div>

            {/* Quick Nav Links */}
            <nav className="space-y-1">
              <button
                type="button"
                onClick={() => onSelectTab('home')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">home</span>
                Home Overview
              </button>

              <button
                type="button"
                onClick={() => onSelectTab('analyze')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">analytics</span>
                Single Ticket Analysis
              </button>

              <button
                type="button"
                onClick={() => onSelectTab('batch')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">dataset</span>
                Batch Processing
              </button>

              <button
                type="button"
                onClick={() => onSelectTab('dashboard')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-primary-container text-on-primary-container cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">dashboard</span>
                Triage Dashboard
              </button>

              <button
                type="button"
                onClick={() => onSelectTab('about')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">info</span>
                Decision Boundary Specs
              </button>
            </nav>

            {/* AI Insights Banner */}
            <div className="p-4 bg-gradient-to-br from-primary/10 to-tertiary/10 rounded-2xl border border-primary/20">
              <span className="material-symbols-outlined text-primary mb-2">auto_awesome</span>
              <h5 className="font-bold text-on-surface text-sm mb-1">Confidence Thresholds</h5>
              <p className="text-xs text-on-surface-variant mb-3">
                &ge;90% Auto-routed, 70-89% Recommended, &lt;70% Human Review Flag.
              </p>
              <button
                type="button"
                onClick={() => onSelectTab('about')}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                View Rules Matrix <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </aside>

          {/* Main Dashboard Workspace */}
          <main className="lg:col-span-9 space-y-8">
            {/* Top Bar Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm">
              <div>
                <h1 className="font-section-title text-section-title text-on-surface">Support Ticket Analytics</h1>
                <p className="text-xs text-on-surface-variant">Real-time triage metrics, confidence ratings, and department queue allocations.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search events..."
                    className="pl-9 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary w-40 sm:w-48"
                  />
                  <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-outline text-[18px]">
                    search
                  </span>
                </div>

                <div className="flex bg-surface-container-low p-1 rounded-xl border border-outline-variant">
                  <button
                    type="button"
                    onClick={() => setTimeRange('today')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      timeRange === 'today' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeRange('week')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      timeRange === 'week' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Week
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeRange('month')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      timeRange === 'month' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Month
                  </button>
                </div>
              </div>
            </div>

            {/* Metric KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm">
                <span className="text-xs font-bold text-outline block mb-1">Tickets Processed</span>
                <div className="text-2xl font-extrabold text-on-surface">1,284</div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-2">
                  +18% throughput
                </span>
              </div>

              <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm">
                <span className="text-xs font-bold text-outline block mb-1">Avg Confidence</span>
                <div className="text-2xl font-extrabold text-primary">94.8%</div>
                <span className="text-xs font-bold text-primary bg-primary-container/20 px-2 py-0.5 rounded-full inline-block mt-2">
                  High Precision
                </span>
              </div>

              <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm">
                <span className="text-xs font-bold text-outline block mb-1">Critical Priority</span>
                <div className="text-2xl font-extrabold text-error">42</div>
                <span className="text-xs font-bold text-error bg-error-container/30 px-2 py-0.5 rounded-full inline-block mt-2">
                  Immediate SLA
                </span>
              </div>

              <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm">
                <span className="text-xs font-bold text-outline block mb-1">Human Review Queue</span>
                <div className="text-2xl font-extrabold text-amber-700">28</div>
                <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full inline-block mt-2">
                  &lt;70% Confidence
                </span>
              </div>

              <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm ai-gradient-border">
                <span className="text-xs font-bold text-outline block mb-1">Auto-Route Rate</span>
                <div className="text-2xl font-extrabold text-primary flex items-center justify-between">
                  92.4%
                  <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                </div>
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-block mt-2">
                  SupportFlow AI
                </span>
              </div>
            </div>

            {/* Visual Bento Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ticket Categories Breakdown */}
              <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-card-title text-card-title text-on-surface">Category Distribution</h3>
                  <span className="text-xs text-outline font-bold">Inbound Ratio</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>Technical Issue / Bug Report</span>
                      <span>420 (33%)</span>
                    </div>
                    <div className="w-full bg-surface-container-high rounded-full h-2.5 overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: '33%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>Billing / Refund</span>
                      <span>320 (25%)</span>
                    </div>
                    <div className="w-full bg-surface-container-high rounded-full h-2.5 overflow-hidden">
                      <div className="bg-secondary h-full rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>Account Access / Password Reset</span>
                      <span>280 (22%)</span>
                    </div>
                    <div className="w-full bg-surface-container-high rounded-full h-2.5 overflow-hidden">
                      <div className="bg-tertiary h-full rounded-full" style={{ width: '22%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>Feature Request</span>
                      <span>140 (11%)</span>
                    </div>
                    <div className="w-full bg-surface-container-high rounded-full h-2.5 overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: '11%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>General / Other</span>
                      <span>124 (9%)</span>
                    </div>
                    <div className="w-full bg-surface-container-high rounded-full h-2.5 overflow-hidden">
                      <div className="bg-slate-400 h-full rounded-full" style={{ width: '9%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Department Routing Destination Breakdown */}
              <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-card-title text-card-title text-on-surface">Target Team Assignments</h3>
                    <span className="text-xs text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full">
                      Automated Dispatch
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-primary"></span>
                        <span className="text-xs font-bold text-on-surface">Infrastructure &amp; Engineering</span>
                      </div>
                      <span className="text-xs font-extrabold text-primary">38%</span>
                    </div>

                    <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
                        <span className="text-xs font-bold text-on-surface">Billing Team</span>
                      </div>
                      <span className="text-xs font-extrabold text-emerald-700">25%</span>
                    </div>

                    <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                        <span className="text-xs font-bold text-on-surface">Account Team</span>
                      </div>
                      <span className="text-xs font-extrabold text-blue-700">20%</span>
                    </div>

                    <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-amber-600"></span>
                        <span className="text-xs font-bold text-on-surface">Product Team</span>
                      </div>
                      <span className="text-xs font-extrabold text-amber-800">11%</span>
                    </div>

                    <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-slate-400"></span>
                        <span className="text-xs font-bold text-on-surface">General Support</span>
                      </div>
                      <span className="text-xs font-extrabold text-slate-600">6%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-outline-variant text-xs text-outline flex justify-between">
                  <span>Routing Accuracy SLA</span>
                  <span className="font-bold text-emerald-600">99.1% Compliance</span>
                </div>
              </div>
            </div>

            {/* Recent Triage Events Stream */}
            <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-card-title text-card-title text-on-surface">Live Triage Event Stream</h3>
                  <p className="text-xs text-outline">Real-time decisions generated by SupportFlow AI</p>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectTab('analyze')}
                  className="text-xs font-bold text-primary hover:underline cursor-pointer flex items-center gap-1"
                >
                  Analyze New Ticket <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-outline-variant text-[11px] text-outline font-bold uppercase tracking-wider">
                      <th className="py-3 px-3">Event ID</th>
                      <th className="py-3 px-3">Subject</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Urgency</th>
                      <th className="py-3 px-3">Assigned Team</th>
                      <th className="py-3 px-3 text-right">Confidence</th>
                      <th className="py-3 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/60 text-xs sm:text-sm">
                    {filteredEvents.map((e) => (
                      <tr key={e.id} className="hover:bg-surface-container-low/60 transition-colors">
                        <td className="py-3.5 px-3 font-bold text-primary">{e.id}</td>
                        <td className="py-3.5 px-3 text-on-surface font-medium max-w-xs truncate" title={e.subject}>
                          {e.subject}
                        </td>
                        <td className="py-3.5 px-3 text-on-surface-variant">{e.category}</td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                              e.urgency === 'Critical'
                                ? 'bg-error-container text-on-error-container'
                                : e.urgency === 'High'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-surface-container-high text-on-surface-variant'
                            }`}
                          >
                            {e.urgency}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-on-surface font-medium">{e.team}</td>
                        <td className="py-3.5 px-3 text-right font-bold text-primary">{e.confidence}%</td>
                        <td className="py-3.5 px-3 text-right">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              e.humanReview
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {e.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        type="button"
        onClick={() => onSelectTab('analyze')}
        title="Analyze Single Ticket"
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-40 cursor-pointer"
      >
        <span className="material-symbols-outlined text-[28px]">add</span>
      </button>
    </div>
  );
};
