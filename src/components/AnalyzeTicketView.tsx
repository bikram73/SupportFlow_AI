import React, { useState, useEffect } from 'react';
import { AnalyzedTicket, SampleTicketItem } from '../types';
import { DEFAULT_SAMPLE_TICKETS, ruleBasedTriage } from '../utils/triageFallback';

export const AnalyzeTicketView: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzedTicket | null>(null);
  const [showReasoning, setShowReasoning] = useState(true);
  const [needsHumanReview, setNeedsHumanReview] = useState(false);
  const [sampleTickets, setSampleTickets] = useState<SampleTicketItem[]>(DEFAULT_SAMPLE_TICKETS);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Fetch predefined sample tickets
    fetch('/api/sample-tickets')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.samples && data.samples.length > 0) {
          setSampleTickets(data.samples);
        }
      })
      .catch((err) => {
        console.warn('Failed to load sample tickets from API, using default fallback:', err);
        setSampleTickets(DEFAULT_SAMPLE_TICKETS);
      });
  }, []);

  const handleSelectSample = (sample: SampleTicketItem) => {
    setSubject(sample.subject);
    setBody(sample.body);
    setAnalysisResult(null);
    setErrorMessage(null);
  };

  const clearForm = () => {
    setSubject('');
    setBody('');
    setAnalysisResult(null);
    setShowReasoning(true);
    setNeedsHumanReview(false);
    setErrorMessage(null);
  };

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanSub = subject.trim();
    const cleanBody = body.trim();

    if (!cleanSub && !cleanBody) {
      if (sampleTickets.length > 0) {
        handleSelectSample(sampleTickets[0]);
        return;
      } else {
        setSubject("Cannot login");
        setBody("I have tried resetting my password but I still cannot access my account.");
      }
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    const activeSub = cleanSub || 'No Subject Provided';
    const activeBody = cleanBody || 'No Body Provided';

    try {
      const res = await fetch('/api/analyze-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: activeSub,
          body: activeBody
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      const ticket: AnalyzedTicket = {
        id: `TK-${Math.floor(1000 + Math.random() * 9000)}`,
        subject: data.subject || activeSub,
        body: data.body || activeBody,
        category: data.category || 'General Question',
        urgency: data.urgency || 'Low',
        confidence: typeof data.confidence === 'number' ? data.confidence : 85,
        assignedTeam: data.assignedTeam || 'General Support',
        humanReview: Boolean(data.humanReview),
        reason: data.reason || 'Processed by Gemini AI.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setAnalysisResult(ticket);
      setNeedsHumanReview(ticket.humanReview);
    } catch (err: any) {
      console.warn('API route unreachable, executing client-side fallback triage:', err);
      const fallback = ruleBasedTriage(activeSub, activeBody);
      const ticket: AnalyzedTicket = {
        id: `TK-${Math.floor(1000 + Math.random() * 9000)}`,
        subject: activeSub,
        body: activeBody,
        category: fallback.category,
        urgency: fallback.urgency,
        confidence: fallback.confidence,
        assignedTeam: fallback.assignedTeam,
        humanReview: fallback.humanReview,
        reason: fallback.reason,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setAnalysisResult(ticket);
      setNeedsHumanReview(ticket.humanReview);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'Critical':
        return 'bg-error-container text-on-error-container border border-error/30';
      case 'High':
        return 'bg-amber-100 text-amber-900 border border-amber-300';
      case 'Medium':
        return 'bg-blue-100 text-blue-900 border border-blue-200';
      default:
        return 'bg-surface-container-high text-on-surface-variant';
    }
  };

  const getConfidenceColor = (conf: number) => {
    if (conf >= 90) return 'stroke-primary text-primary';
    if (conf >= 70) return 'stroke-amber-600 text-amber-600';
    return 'stroke-error text-error';
  };

  return (
    <div id="analyze-view" className="w-full">
      <div className="max-w-container-max-width mx-auto px-margin-desktop py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-section-title text-section-title text-on-surface mb-1">
              Single Ticket Triage &amp; Analysis
            </h1>
            <p className="text-on-surface-variant text-sm">
              Real-time classification, urgency detection, confidence scoring, and team routing powered by Gemini AI.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-full border border-outline-variant text-xs text-outline font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Gemini 3.6 Flash Active
          </div>
        </div>

        {/* Quick Sample Selector */}
        <div className="mb-8 p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm">
          <div className="text-xs font-bold text-outline mb-2.5 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[16px]">touch_app</span>
            Test Predefined Support Tickets (Click to load):
          </div>
          <div className="flex flex-wrap gap-2">
            {sampleTickets.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSelectSample(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  subject === s.subject
                    ? 'bg-primary text-on-primary border-primary font-bold shadow-xs'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high border-outline-variant'
                }`}
              >
                {s.subject}
              </button>
            ))}
          </div>
        </div>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Input Panel */}
          <div className="lg:col-span-5 bg-surface-container-lowest p-6 sm:p-8 rounded-3xl shadow-sm border border-outline-variant flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-card-title text-card-title text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">edit_note</span> Ticket Input
                </h3>
                <span className="text-xs text-outline font-medium">Form / API Request</span>
              </div>

              {errorMessage && (
                <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-xl text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleAnalyze} className="space-y-5">
                <div>
                  <label htmlFor="ticket-subject" className="block text-xs font-bold text-on-surface mb-2">
                    Ticket Subject <span className="text-error">*</span>
                  </label>
                  <input
                    id="ticket-subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Cannot login after resetting password"
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary focus:outline-none transition-all text-sm text-on-surface placeholder:text-outline"
                  />
                </div>

                <div>
                  <label htmlFor="ticket-desc" className="block text-xs font-bold text-on-surface mb-2">
                    Ticket Body / Description <span className="text-error">*</span>
                  </label>
                  <textarea
                    id="ticket-desc"
                    rows={6}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Enter customer message, error trace, or email body..."
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary focus:outline-none transition-all text-sm text-on-surface placeholder:text-outline resize-none"
                  ></textarea>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={clearForm}
                    className="px-4 py-2 bg-surface-container-low hover:bg-surface-container-high text-outline rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Clear Form
                  </button>
                  <span className="text-xs text-outline ml-auto">
                    {body.length} chars
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="w-full bg-primary text-on-primary py-4 rounded-xl font-button-label text-button-label hover:shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                      Analyzing Ticket...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                      Analyze Ticket
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="mt-8 pt-4 border-t border-outline-variant flex items-center justify-between text-xs text-outline">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary"></span> Server Proxy Gateway
              </span>
              <span>JSON Schema Verified</span>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-7 bg-surface-container-lowest p-6 sm:p-8 rounded-3xl shadow-sm border border-outline-variant relative overflow-hidden flex flex-col justify-between min-h-[500px]">
            {!analysisResult ? (
              /* Empty State */
              <div id="empty-state" className="flex flex-col items-center justify-center text-center my-auto py-12">
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[40px]">smart_toy</span>
                </div>
                <h4 className="font-card-title text-card-title text-on-surface mb-2">Ready for AI Analysis</h4>
                <p className="text-on-surface-variant text-sm max-w-md">
                  Select a sample ticket above or type a subject and description to run real-time triage &amp; classification.
                </p>
              </div>
            ) : (
              /* Result State */
              <div id="result-state" className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
                        {analysisResult.category}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getUrgencyBadge(analysisResult.urgency)}`}>
                        {analysisResult.urgency} Urgency
                      </span>
                      {needsHumanReview && (
                        <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">warning</span> Human Review
                        </span>
                      )}
                    </div>
                    <h3 id="display-subject" className="font-card-title text-card-title text-on-surface">
                      {analysisResult.subject}
                    </h3>
                  </div>

                  {/* Confidence Gauge */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="34" stroke="#e2e8f0" strokeWidth="7" fill="transparent" />
                        <circle
                          cx="40"
                          cy="40"
                          r="34"
                          stroke="currentColor"
                          strokeWidth="7"
                          fill="transparent"
                          strokeDasharray="213"
                          strokeDashoffset={213 - (213 * analysisResult.confidence) / 100}
                          className={`transition-all duration-700 ${getConfidenceColor(analysisResult.confidence)}`}
                        />
                      </svg>
                      <span className={`absolute font-extrabold text-lg ${getConfidenceColor(analysisResult.confidence)}`}>
                        {analysisResult.confidence}%
                      </span>
                    </div>
                    <span className="text-[11px] text-outline font-bold mt-1">Confidence</span>
                  </div>
                </div>

                {/* Routing Destination Box */}
                <div className="p-5 bg-surface-container-low rounded-2xl border border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[24px]">alt_route</span>
                    </div>
                    <div>
                      <span className="text-xs text-outline block font-medium">Assigned Target Team</span>
                      <span className="font-bold text-on-surface text-base sm:text-lg">{analysisResult.assignedTeam}</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-outline-variant">
                    <span className="text-xs text-outline block font-medium">Routing Status</span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full inline-block mt-0.5 ${
                      analysisResult.confidence >= 90
                        ? 'bg-emerald-100 text-emerald-800'
                        : analysisResult.confidence >= 70
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {analysisResult.confidence >= 90 ? 'Auto-Routed (≥90%)' : analysisResult.confidence >= 70 ? 'Recommended (70-89%)' : 'Needs Review (<70%)'}
                    </span>
                  </div>
                </div>

                {/* Decision Boundary & Human Review Toggle */}
                <div className="p-4 bg-surface-bright rounded-2xl border border-outline-variant flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className={`material-symbols-outlined ${needsHumanReview ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {needsHumanReview ? 'person_search' : 'verified_user'}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-on-surface block">Human Review Flag</span>
                      <span className="text-[11px] text-outline">
                        {needsHumanReview
                          ? 'Flagged: Confidence score below 70% threshold or ticket is ambiguous.'
                          : 'Auto-Routing Approved: High confidence classification score.'}
                      </span>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={needsHumanReview}
                      onChange={() => setNeedsHumanReview(!needsHumanReview)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                {/* AI Reasoning Rationale Accordion */}
                <div className="border border-outline-variant rounded-2xl overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setShowReasoning(!showReasoning)}
                    className="w-full p-4 flex items-center justify-between bg-surface-container-low hover:bg-surface-container-high transition-colors text-left cursor-pointer"
                  >
                    <span className="font-bold text-xs sm:text-sm text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[18px]">psychology</span>
                      AI Decision Rationale &amp; Chain-of-Thought
                    </span>
                    <span className="material-symbols-outlined text-outline">
                      {showReasoning ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>

                  {showReasoning && (
                    <div className="p-4 text-xs sm:text-sm text-on-surface-variant bg-surface-bright border-t border-outline-variant space-y-3">
                      <p className="leading-relaxed font-normal text-on-surface bg-primary/5 p-3 rounded-xl border border-primary/10">
                        "{analysisResult.reason}"
                      </p>
                      <div className="text-xs text-outline space-y-1">
                        <div>• <strong>Category Selection:</strong> {analysisResult.category}</div>
                        <div>• <strong>Urgency Assessment:</strong> {analysisResult.urgency}</div>
                        <div>• <strong>Destination Department:</strong> {analysisResult.assignedTeam}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-outline-variant flex justify-between items-center text-xs text-outline mt-auto">
              <span>Model: Gemini 3.6 Flash</span>
              <span>Ticket ID: {analysisResult ? analysisResult.id : 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Pipeline Execution Lifecycle */}
        <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant shadow-sm">
          <h3 className="font-card-title text-card-title text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">route</span> Triage Execution Lifecycle
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant">
              <span className="text-[10px] font-bold text-outline uppercase block mb-1">STAGE 01</span>
              <span className="font-bold text-on-surface text-sm block mb-1">Ticket Ingestion</span>
              <p className="text-xs text-on-surface-variant">Inbound message payload parsed by backend REST route.</p>
            </div>
            <div className={`p-4 rounded-2xl border transition-colors ${
              analysisResult ? 'bg-primary/10 border-primary/40' : 'bg-surface-container-low border-outline-variant'
            }`}>
              <span className="text-[10px] font-bold text-outline uppercase block mb-1">STAGE 02</span>
              <span className="font-bold text-on-surface text-sm block mb-1">Gemini AI Analysis</span>
              <p className="text-xs text-on-surface-variant">Intent extraction, sentiment &amp; priority evaluated.</p>
            </div>
            <div className={`p-4 rounded-2xl border transition-colors ${
              analysisResult ? 'bg-primary/10 border-primary/40' : 'bg-surface-container-low border-outline-variant'
            }`}>
              <span className="text-[10px] font-bold text-outline uppercase block mb-1">STAGE 03</span>
              <span className="font-bold text-on-surface text-sm block mb-1">Confidence Check</span>
              <p className="text-xs text-on-surface-variant">
                {analysisResult ? `${analysisResult.confidence}% confidence calculated.` : 'Decision boundary evaluated.'}
              </p>
            </div>
            <div className={`p-4 rounded-2xl border transition-colors ${
              analysisResult ? 'bg-primary/10 border-primary/40' : 'bg-surface-container-low border-outline-variant'
            }`}>
              <span className="text-[10px] font-bold text-outline uppercase block mb-1">STAGE 04</span>
              <span className="font-bold text-on-surface text-sm block mb-1">Team Dispatch</span>
              <p className="text-xs text-on-surface-variant">
                {analysisResult ? `Routed to ${analysisResult.assignedTeam}.` : 'Assigned to target team queue.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
