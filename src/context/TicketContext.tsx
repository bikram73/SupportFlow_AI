import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { AnalyzedTicket, UrgencyLevel, RoutingStatus } from '../types';
import { DEFAULT_SAMPLE_TICKETS, ruleBasedTriage } from '../utils/triageFallback';

const STORAGE_KEY = 'supportflow_analyzed_tickets_v1';

// Initial seed tickets generated realistically
const INITIAL_SEEDED_TICKETS: AnalyzedTicket[] = DEFAULT_SAMPLE_TICKETS.map((sample, idx) => {
  const triage = ruleBasedTriage(sample.subject, sample.body);
  const minutesAgo = (idx + 1) * 4;
  return {
    id: sample.id,
    subject: sample.subject,
    body: sample.body,
    category: triage.category,
    urgency: triage.urgency,
    confidence: triage.confidence,
    assignedTeam: triage.assignedTeam,
    humanReview: triage.humanReview,
    routingStatus: triage.routingStatus,
    reason: triage.reason,
    timestamp: `${minutesAgo} mins ago`
  };
});

interface CategoryStat {
  name: string;
  count: number;
  percent: number;
  color: string;
}

interface TeamStat {
  name: string;
  count: number;
  percent: number;
  sla: string;
  status: 'Healthy' | 'Active' | 'Elevated';
}

interface TicketContextType {
  tickets: AnalyzedTicket[];
  addTicket: (ticket: AnalyzedTicket) => void;
  addBatchTickets: (newTickets: AnalyzedTicket[]) => void;
  clearTickets: () => void;
  resetToSampleData: () => void;
  // Computed Live Metrics
  stats: {
    totalCount: number;
    avgConfidence: number;
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
    needsReviewCount: number;
    autoRoutedCount: number;
    recommendedCount: number;
    autoRouteRate: number;
    categoryStats: CategoryStat[];
    teamStats: TeamStat[];
    recentActivity: AnalyzedTicket[];
  };
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

const CATEGORY_COLORS: Record<string, string> = {
  'Technical Issue': 'bg-blue-600',
  'Billing': 'bg-emerald-600',
  'Refund': 'bg-teal-600',
  'Account Access': 'bg-indigo-600',
  'Password Reset': 'bg-violet-600',
  'Bug Report': 'bg-amber-600',
  'Feature Request': 'bg-purple-600',
  'Security Concern': 'bg-rose-600',
  'Sales Inquiry': 'bg-cyan-600',
  'Subscription': 'bg-sky-600',
  'General Question': 'bg-slate-600',
  'Other': 'bg-gray-500'
};

export const TicketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<AnalyzedTicket[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored tickets from localStorage', e);
    }
    return INITIAL_SEEDED_TICKETS;
  });

  // Sync to localStorage whenever tickets change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    } catch (e) {
      console.warn('Failed to save tickets to localStorage', e);
    }
  }, [tickets]);

  const addTicket = (ticket: AnalyzedTicket) => {
    setTickets((prev) => {
      // Avoid duplicate by ID, put latest first
      const filtered = prev.filter((t) => t.id !== ticket.id);
      const withTimestamp: AnalyzedTicket = {
        ...ticket,
        timestamp: ticket.timestamp || 'Just now'
      };
      return [withTimestamp, ...filtered];
    });
  };

  const addBatchTickets = (newTickets: AnalyzedTicket[]) => {
    setTickets((prev) => {
      const newIds = new Set(newTickets.map((t) => t.id));
      const filtered = prev.filter((t) => !newIds.has(t.id));
      const stamped = newTickets.map((t) => ({
        ...t,
        timestamp: t.timestamp || 'Just now'
      }));
      return [...stamped, ...filtered];
    });
  };

  const clearTickets = () => {
    setTickets([]);
  };

  const resetToSampleData = () => {
    setTickets(INITIAL_SEEDED_TICKETS);
  };

  // Compute live real-time statistics based strictly on actual tickets
  const stats = useMemo(() => {
    const totalCount = tickets.length;
    if (totalCount === 0) {
      return {
        totalCount: 0,
        avgConfidence: 0,
        criticalCount: 0,
        highCount: 0,
        mediumCount: 0,
        lowCount: 0,
        needsReviewCount: 0,
        autoRoutedCount: 0,
        recommendedCount: 0,
        autoRouteRate: 0,
        categoryStats: [],
        teamStats: [],
        recentActivity: []
      };
    }

    let sumConfidence = 0;
    let criticalCount = 0;
    let highCount = 0;
    let mediumCount = 0;
    let lowCount = 0;
    let needsReviewCount = 0;
    let autoRoutedCount = 0;
    let recommendedCount = 0;

    const catCountMap: Record<string, number> = {};
    const teamCountMap: Record<string, number> = {};

    tickets.forEach((t) => {
      const conf = typeof t.confidence === 'number' ? t.confidence : 90;
      sumConfidence += conf;

      if (t.urgency === 'Critical') criticalCount++;
      else if (t.urgency === 'High') highCount++;
      else if (t.urgency === 'Medium') mediumCount++;
      else lowCount++;

      if (t.humanReview || conf < 70) {
        needsReviewCount++;
      } else if (conf >= 90) {
        autoRoutedCount++;
      } else {
        recommendedCount++;
      }

      const cat = t.category || 'General Question';
      catCountMap[cat] = (catCountMap[cat] || 0) + 1;

      const team = t.assignedTeam || 'General Support';
      teamCountMap[team] = (teamCountMap[team] || 0) + 1;
    });

    const avgConfidence = Math.round((sumConfidence / totalCount) * 10) / 10;
    const autoRouteRate = Math.round((autoRoutedCount / totalCount) * 1000) / 10;

    // Category Stats
    const categoryStats: CategoryStat[] = Object.entries(catCountMap)
      .map(([name, count]) => ({
        name,
        count,
        percent: Math.round((count / totalCount) * 100),
        color: CATEGORY_COLORS[name] || 'bg-primary'
      }))
      .sort((a, b) => b.count - a.count);

    // Team Stats
    const teamStats: TeamStat[] = Object.entries(teamCountMap)
      .map(([name, count]) => {
        const percent = Math.round((count / totalCount) * 100);
        let sla = '< 2 hrs';
        let status: 'Healthy' | 'Active' | 'Elevated' = 'Healthy';
        if (name.includes('Infrastructure') || name.includes('Security')) {
          sla = '< 15 mins';
          status = 'Active';
        } else if (name.includes('Engineering') || name.includes('Billing')) {
          sla = '< 1 hr';
          status = percent > 30 ? 'Elevated' : 'Healthy';
        }
        return {
          name,
          count,
          percent,
          sla,
          status
        };
      })
      .sort((a, b) => b.count - a.count);

    return {
      totalCount,
      avgConfidence,
      criticalCount,
      highCount,
      mediumCount,
      lowCount,
      needsReviewCount,
      autoRoutedCount,
      recommendedCount,
      autoRouteRate,
      categoryStats,
      teamStats,
      recentActivity: tickets.slice(0, 10)
    };
  }, [tickets]);

  return (
    <TicketContext.Provider
      value={{
        tickets,
        addTicket,
        addBatchTickets,
        clearTickets,
        resetToSampleData,
        stats
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = (): TicketContextType => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};
