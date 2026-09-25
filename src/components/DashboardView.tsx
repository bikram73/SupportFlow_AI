import React, { useState, useMemo } from 'react';
import { NavTab } from '../types';
import { useTickets } from '../context/TicketContext';

interface DashboardViewProps {
  onSelectTab: (tab: NavTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onSelectTab }) => {
  const { tickets, stats, resetToSampleData, clearTickets } = useTickets();
  const [timeRange, setTimeRange] = useState<'all' | 'today' | 'recent'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchSearch =
        searchQuery === '' ||
        t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.assignedTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [tickets, searchQuery]);

  return (
    <div id="dashboard-view" className="w-full">
      <div className="max-w-container-max-width mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8">
        {/* Top Bar Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-surface-container-lowest p-4 sm:p-6 rounded-3xl border border-outline-variant shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight">
                Live Support Ticket Analytics
              </h1>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Live User Activity
              </span>
            </div>
            <p className="text-xs text-on-surface-variant">
              Metrics and queue distributions updated dynamically from your analyzed &amp; uploaded tickets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="relative flex-1 sm:flex-none">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search live events..."
                className="pl-8 pr-3 py-1.5 sm:py-2 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary w-full sm:w-48"
              />
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-outline text-[16px]">
                search
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={resetToSampleData}
                title="Reset to benchmark dataset"
                className="px-3 py-2 bg-surface-container-low hover:bg-surface-container-high border border-outline-variant text-on-surface rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                <span className="hidden sm:inline">Reset</span>
              </button>

              <button
                type="button"
                onClick={clearTickets}
                title="Clear all analyzed tickets"
                className="px-3 py-2 bg-surface-container-low hover:bg-error/10 hover:text-error hover:border-error/30 border border-outline-variant text-outline rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
                <span className="hidden sm:inline">Clear</span>
              </button>
            </div>
          </div>
        </div>

        {/* Metric KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Tickets Processed */}
          <div className="bg-surface-container-lowest p-3.5 sm:p-5 rounded-2xl border border-outline-variant shadow-xs">
            <span className="text-[11px] sm:text-xs font-bold text-outline block mb-1">Tickets Analyzed</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-on-surface">
              {stats.totalCount}
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-block mt-1.5">
              {stats.totalCount > 0 ? `${stats.totalCount} In System` : 'No tickets yet'}
            </span>
          </div>

          {/* Average Confidence */}
          <div className="bg-surface-container-lowest p-3.5 sm:p-5 rounded-2xl border border-outline-variant shadow-xs">
            <span className="text-[11px] sm:text-xs font-bold text-outline block mb-1">Avg AI Confidence</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-primary">
              {stats.totalCount > 0 ? `${stats.avgConfidence}%` : '0%'}
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-1.5">
              {stats.avgConfidence >= 90 ? 'High Precision' : stats.avgConfidence >= 70 ? 'Moderate' : 'Needs Review'}
            </span>
          </div>

          {/* Critical Priority */}
          <div className="bg-surface-container-lowest p-3.5 sm:p-5 rounded-2xl border border-outline-variant shadow-xs">
            <span className="text-[11px] sm:text-xs font-bold text-outline block mb-1">Critical Priority</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-error">
              {stats.criticalCount}
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-error bg-error-container/30 px-2 py-0.5 rounded-full inline-block mt-1.5">
              {stats.criticalCount > 0 ? 'Immediate SLA' : 'Zero Outages'}
            </span>
          </div>

          {/* Needs Human Review */}
          <div className="bg-surface-container-lowest p-3.5 sm:p-5 rounded-2xl border border-outline-variant shadow-xs">
            <span className="text-[11px] sm:text-xs font-bold text-outline block mb-1">Human Review</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-700">
              {stats.needsReviewCount}
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full inline-block mt-1.5">
              &lt;70% or Flagged
            </span>
          </div>

          {/* Auto-Route Rate */}
          <div className="col-span-2 sm:col-span-1 bg-surface-container-lowest p-3.5 sm:p-5 rounded-2xl border border-outline-variant shadow-xs ai-gradient-border">
            <span className="text-[11px] sm:text-xs font-bold text-outline block mb-1">Auto-Route Rate</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-primary flex items-center justify-between">
              {stats.totalCount > 0 ? `${stats.autoRouteRate}%` : '0%'}
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-block mt-1.5">
              {stats.autoRoutedCount} Auto-Routed
            </span>
          </div>
        </div>

        {/* Visual Bento Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Ticket Categories Breakdown */}
          <div className="bg-surface-container-lowest p-4 sm:p-6 rounded-3xl border border-outline-variant shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-on-surface">Category Distribution</h3>
                  <span className="text-[11px] text-outline">Real-time breakdown of user tickets</span>
                </div>
                <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {stats.categoryStats.length} Categories
                </span>
              </div>

              {stats.categoryStats.length === 0 ? (
                <div className="text-center py-8 text-outline text-xs">
                  No ticket categories processed yet.
                </div>
              ) : (
                <div className="space-y-3.5 sm:space-y-4">
                  {stats.categoryStats.slice(0, 5).map((cat) => (
                    <div key={cat.name}>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-on-surface">{cat.name}</span>
                        <span className="text-outline">
                          {cat.count} ({cat.percent}%)
                        </span>
                      </div>
                      <div className="w-full bg-surface-container-high rounded-full h-2 sm:h-2.5 overflow-hidden">
                        <div
                          className={`${cat.color} h-full rounded-full transition-all duration-500`}
                          style={{ width: `${Math.max(4, cat.percent)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 sm:pt-4 mt-4 border-t border-outline-variant text-[11px] sm:text-xs text-outline flex justify-between">
              <span>Total Active Categories</span>
              <span className="font-bold text-on-surface">{stats.categoryStats.length} distinct</span>
            </div>
          </div>

          {/* Department Routing Destination Breakdown */}
          <div className="bg-surface-container-lowest p-4 sm:p-6 rounded-3xl border border-outline-variant shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-on-surface">Target Team Queue Health</h3>
                  <span className="text-[11px] text-outline">Departmental load &amp; auto-assignment</span>
                </div>
                <span className="text-[11px] text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full">
                  Auto Dispatch
                </span>
              </div>

              {stats.teamStats.length === 0 ? (
                <div className="text-center py-8 text-outline text-xs">
                  No team dispatches recorded yet.
                </div>
              ) : (
                <div className="space-y-2.5 sm:space-y-3">
                  {stats.teamStats.slice(0, 5).map((team) => (
                    <div
                      key={team.name}
                      className="p-2.5 sm:p-3 bg-surface-container-low rounded-xl flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            team.status === 'Elevated'
                              ? 'bg-amber-500'
                              : team.status === 'Active'
                              ? 'bg-primary'
                              : 'bg-emerald-500'
                          }`}
                        ></span>
                        <div>
                          <span className="text-xs font-bold text-on-surface block">{team.name}</span>
                          <span className="text-[10px] text-outline">Demo SLA Target: {team.sla}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-primary block">
                          {team.count} tickets
                        </span>
                        <span className="text-[10px] text-outline">{team.percent}% volume</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 sm:pt-4 mt-4 border-t border-outline-variant text-[11px] sm:text-xs text-outline flex justify-between">
              <span>Session Telemetry</span>
              <span className="font-bold text-emerald-600">
                {stats.totalCount > 0 ? `Calculated from ${stats.totalCount} tickets` : 'Standby (0 tickets)'}
              </span>
            </div>
          </div>
        </div>

        {/* Live Recent Triage Events Stream */}
        <div className="bg-surface-container-lowest p-4 sm:p-6 rounded-3xl border border-outline-variant shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-on-surface">Live Triage Event Stream</h3>
              <p className="text-[11px] text-outline">
                Real-time decisions generated by SupportFlow AI from user uploads &amp; triage runs
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSelectTab('batch')}
                className="text-xs font-bold text-outline hover:text-on-surface transition-colors cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">dataset</span> Batch Upload
              </button>
              <button
                type="button"
                onClick={() => onSelectTab('analyze')}
                className="px-3 py-1.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:opacity-95 transition-all cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">add</span> Analyze Ticket
              </button>
            </div>
          </div>

          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full text-left border-collapse min-w-[560px]">
              <thead>
                <tr className="border-b border-outline-variant text-[11px] text-outline font-bold uppercase tracking-wider">
                  <th className="py-2.5 sm:py-3 px-2 sm:px-3">Analysis ID</th>
                  <th className="py-2.5 sm:py-3 px-2 sm:px-3">Subject</th>
                  <th className="py-2.5 sm:py-3 px-2 sm:px-3">Category</th>
                  <th className="py-2.5 sm:py-3 px-2 sm:px-3">Urgency</th>
                  <th className="py-2.5 sm:py-3 px-2 sm:px-3">Target Team</th>
                  <th className="py-2.5 sm:py-3 px-2 sm:px-3 text-right">Confidence</th>
                  <th className="py-2.5 sm:py-3 px-2 sm:px-3 text-right">Routing Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/60 text-xs sm:text-sm">
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-outline text-xs">
                      No analyzed tickets match your query. Try analyzing a ticket or uploading a batch.
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((t) => (
                    <tr key={t.id} className="hover:bg-surface-container-low/60 transition-colors">
                      <td className="py-3 px-2 sm:px-3 font-mono font-bold text-primary text-xs">
                        {t.id}
                      </td>
                      <td
                        className="py-3 px-2 sm:px-3 text-on-surface font-medium max-w-[180px] sm:max-w-xs truncate"
                        title={t.subject}
                      >
                        {t.subject}
                      </td>
                      <td className="py-3 px-2 sm:px-3 text-on-surface-variant text-xs">{t.category}</td>
                      <td className="py-3 px-2 sm:px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold ${
                            t.urgency === 'Critical'
                              ? 'bg-error-container text-on-error-container'
                              : t.urgency === 'High'
                              ? 'bg-amber-100 text-amber-900'
                              : t.urgency === 'Medium'
                              ? 'bg-blue-100 text-blue-900'
                              : 'bg-surface-container-high text-on-surface-variant'
                          }`}
                        >
                          {t.urgency}
                        </span>
                      </td>
                      <td className="py-3 px-2 sm:px-3 text-on-surface font-medium text-xs">
                        {t.assignedTeam}
                      </td>
                      <td className="py-3 px-2 sm:px-3 text-right font-bold text-primary text-xs">
                        {t.confidence}%
                      </td>
                      <td className="py-3 px-2 sm:px-3 text-right">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            t.humanReview || t.confidence < 70
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[12px]">
                            {t.humanReview || t.confidence < 70 ? 'warning' : 'check_circle'}
                          </span>
                          {t.routingStatus || (t.confidence >= 90 ? 'Auto-Routed' : 'Needs Review')}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Floating Action Button (above mobile bottom bar) */}
      <button
        type="button"
        onClick={() => onSelectTab('analyze')}
        title="Analyze Single Ticket"
        className="fixed bottom-20 right-4 lg:bottom-8 lg:right-8 w-13 h-13 sm:w-14 sm:h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-40 cursor-pointer"
      >
        <span className="material-symbols-outlined text-[26px] sm:text-[28px]">add</span>
      </button>
    </div>
  );
};
