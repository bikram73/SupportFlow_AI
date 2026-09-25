import React, { useState, useEffect } from 'react';
import { BatchTicket } from '../types';
import { DEFAULT_SAMPLE_TICKETS, ruleBasedTriage } from '../utils/triageFallback';

export const BatchProcessingView: React.FC = () => {
  const [tickets, setTickets] = useState<BatchTicket[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [urgencyFilter, setUrgencyFilter] = useState('All');
  const [reviewFilter, setReviewFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [customText, setCustomText] = useState<string>('');
  const [showPasteModal, setShowPasteModal] = useState(false);
  const itemsPerPage = 8;

  // On mount, analyze default sample batch
  useEffect(() => {
    loadPredefinedBatch();
  }, []);

  const loadPredefinedBatch = async () => {
    setIsProcessing(true);
    setProcessingStatus('Fetching sample tickets...');
    try {
      const res = await fetch('/api/sample-tickets');
      if (!res.ok) throw new Error('Failed to load sample tickets from server');
      const data = await res.json();
      if (data && data.samples) {
        await processTicketBatch(data.samples);
      } else {
        await processTicketBatch(DEFAULT_SAMPLE_TICKETS);
      }
    } catch (err) {
      console.warn('Using client fallback sample tickets:', err);
      await processTicketBatch(DEFAULT_SAMPLE_TICKETS);
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  const handleGenerateSamples = async (count: number) => {
    setIsProcessing(true);
    setProcessingStatus(`Generating ${count} synthetic tickets...`);
    try {
      const genRes = await fetch('/api/generate-samples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count })
      });
      if (!genRes.ok) throw new Error('Generate samples endpoint unreachable');
      const genData = await genRes.json();
      if (genData && genData.samples) {
        await processTicketBatch(genData.samples);
      } else {
        generateFallbackSamples(count);
      }
    } catch (err) {
      console.warn('Falling back to local synthetic ticket generation:', err);
      generateFallbackSamples(count);
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  const generateFallbackSamples = (count: number) => {
    const templates = [
      { subject: "Database Connection Timeout", body: "PostgreSQL cluster in us-east-1 is timing out on 40% of queries." },
      { subject: "VAT Tax Invoice Missing", body: "Need downloadable PDF tax invoice for Q3 enterprise renewal." },
      { subject: "SSO SAML Integration Failure", body: "Okta SAML single sign-on throws certificate expired error." },
      { subject: "API Rate Limit Exceeded", body: "HTTP 429 error on webhook endpoints during peak traffic." },
      { subject: "Add Export to Excel Feature", body: "Please allow exporting reports directly to XLSX format." },
      { subject: "App crashes when uploading CSV", body: "Uploading CSV files above 5MB causes browser tab to freeze and crash." },
      { subject: "Unauthorized login warning", body: "Suspicious login detected from foreign country on master admin account." },
      { subject: "Billing charged twice in July", body: "My credit card statement shows two identical charges of $299." },
      { subject: "Help needed urgently", body: "It is not working please fix it right now." },
      { subject: "Slow loading dashboard widgets", body: "The analytics charts take 20+ seconds to render on page refresh." }
    ];

    const generated = Array.from({ length: count }).map((_, i) => {
      const t = templates[i % templates.length];
      return {
        id: `TK-GEN-${2000 + i}`,
        subject: `${t.subject} (${i + 1})`,
        body: t.body
      };
    });

    processTicketBatch(generated);
  };

  const processTicketBatch = async (rawTickets: Array<{ id?: string; subject: string; body: string }>) => {
    setProcessingStatus(`Analyzing batch of ${rawTickets.length} tickets...`);
    try {
      const res = await fetch('/api/analyze-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tickets: rawTickets })
      });

      if (!res.ok) throw new Error('Batch API unreachable');

      const data = await res.json();
      if (data && Array.isArray(data.tickets)) {
        const formatted: BatchTicket[] = data.tickets.map((t: any) => {
          let status: 'Auto Routed' | 'Recommended' | 'Needs Review' = 'Auto Routed';
          if (t.humanReview || t.confidence < 70) {
            status = 'Needs Review';
          } else if (t.confidence < 90) {
            status = 'Recommended';
          }

          return {
            id: t.id || `TK-${Math.floor(1000 + Math.random() * 9000)}`,
            subject: t.subject,
            body: t.body,
            category: t.category,
            urgency: t.urgency,
            confidence: t.confidence,
            assignedTeam: t.assignedTeam,
            humanReview: t.humanReview,
            reason: t.reason,
            status
          };
        });
        setTickets(formatted);
        setCurrentPage(1);
        return;
      }
    } catch (err) {
      console.warn('Batch API call failed, falling back to client-side rule classification:', err);
      const fallbackFormatted: BatchTicket[] = rawTickets.map((t, idx) => {
        const sub = t.subject || `Ticket #${idx + 1}`;
        const bodyText = t.body || '';
        const triage = ruleBasedTriage(sub, bodyText);

        let status: 'Auto Routed' | 'Recommended' | 'Needs Review' = 'Auto Routed';
        if (triage.humanReview || triage.confidence < 70) {
          status = 'Needs Review';
        } else if (triage.confidence < 90) {
          status = 'Recommended';
        }

        return {
          id: t.id || `TK-${Math.floor(1000 + Math.random() * 9000)}`,
          subject: sub,
          body: bodyText,
          category: triage.category,
          urgency: triage.urgency,
          confidence: triage.confidence,
          assignedTeam: triage.assignedTeam,
          humanReview: triage.humanReview,
          reason: triage.reason,
          status
        };
      });
      setTickets(fallbackFormatted);
      setCurrentPage(1);
    }
  };

  const handleParsePastedText = () => {
    if (!customText.trim()) return;
    const lines = customText.split('\n').filter((l) => l.trim().length > 0);
    const parsed = lines.map((line, idx) => {
      const parts = line.split('|');
      if (parts.length >= 2) {
        return { subject: parts[0].trim(), body: parts[1].trim() };
      }
      return { subject: line.slice(0, 50).trim(), body: line.trim() };
    });

    setShowPasteModal(false);
    setCustomText('');
    processTicketBatch(parsed);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const lines = content.split('\n').filter((l) => l.trim().length > 0);
        // Skip header if header line exists
        const dataLines = lines[0].toLowerCase().includes('subject') ? lines.slice(1) : lines;
        const parsed = dataLines.map((line) => {
          const cols = line.split(',');
          if (cols.length >= 2) {
            return {
              subject: cols[0].replace(/^"|"$/g, '').trim(),
              body: cols.slice(1).join(',').replace(/^"|"$/g, '').trim()
            };
          }
          return { subject: line.slice(0, 40), body: line };
        });

        if (parsed.length > 0) {
          processTicketBatch(parsed);
        }
      }
    };
    reader.readAsText(file);
  };

  // Filter logic
  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.assignedTeam.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
    const matchesUrgency = urgencyFilter === 'All' || t.urgency === urgencyFilter;
    const matchesReview =
      reviewFilter === 'All' ||
      (reviewFilter === 'Needs Review' && t.humanReview) ||
      (reviewFilter === 'Auto Routed' && !t.humanReview);

    return matchesSearch && matchesCategory && matchesUrgency && matchesReview;
  });

  // Calculate Metrics
  const totalCount = tickets.length;
  const criticalCount = tickets.filter((t) => t.urgency === 'Critical').length;
  const highCount = tickets.filter((t) => t.urgency === 'High').length;
  const needsReviewCount = tickets.filter((t) => t.humanReview).length;
  const avgConfidence = totalCount > 0 ? (tickets.reduce((acc, t) => acc + t.confidence, 0) / totalCount).toFixed(1) : '0';

  // Pagination
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage) || 1;
  const paginatedTickets = filteredTickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Export functions
  const exportCSV = () => {
    const headers = ['Ticket ID', 'Subject', 'Category', 'Urgency', 'Confidence', 'Assigned Team', 'Human Review', 'Reason'];
    const rows = filteredTickets.map((t) => [
      `"${t.id}"`,
      `"${t.subject.replace(/"/g, '""')}"`,
      `"${t.category}"`,
      `"${t.urgency}"`,
      `"${t.confidence}%"`,
      `"${t.assignedTeam}"`,
      `"${t.humanReview ? 'Yes' : 'No'}"`,
      `"${t.reason.replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `supportflow_batch_results_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredTickets, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `supportflow_batch_results_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="batch-view" className="w-full">
      <div className="max-w-container-max-width mx-auto px-margin-desktop py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-section-title text-section-title text-on-surface mb-1">
              Batch Ticket Processing Engine
            </h1>
            <p className="text-on-surface-variant text-sm">
              Process datasets of support tickets simultaneously with Gemini AI automated triage.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={loadPredefinedBatch}
              disabled={isProcessing}
              className="px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span> Reset Standard Batch
            </button>
            <button
              type="button"
              onClick={() => handleGenerateSamples(10)}
              disabled={isProcessing}
              className="px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span> Generate 10 AI Tickets
            </button>
            <button
              type="button"
              onClick={() => handleGenerateSamples(20)}
              disabled={isProcessing}
              className="px-4 py-2 bg-tertiary text-on-tertiary rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span> Generate 20 AI Tickets
            </button>
          </div>
        </div>

        {/* Top Metric KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm">
            <span className="text-xs font-bold text-outline block mb-1">Total Tickets</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-on-surface">{totalCount}</span>
              <span className="text-xs font-bold text-secondary bg-secondary-container/30 px-2 py-0.5 rounded-full">
                Active Batch
              </span>
            </div>
            <span className="text-[11px] text-outline mt-1.5 block">Analyzed by Gemini</span>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm">
            <span className="text-xs font-bold text-outline block mb-1">Critical Priority</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-error">{criticalCount}</span>
              <span className="text-[11px] font-bold text-error bg-error-container/30 px-2 py-0.5 rounded-full">
                Immediate SLA
              </span>
            </div>
            <span className="text-[11px] text-outline mt-1.5 block">System Outage / Critical</span>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm">
            <span className="text-xs font-bold text-outline block mb-1">High Priority</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-amber-700">{highCount}</span>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                Tier-2 Escalation
              </span>
            </div>
            <span className="text-[11px] text-outline mt-1.5 block">Software Bugs / Crashes</span>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm">
            <span className="text-xs font-bold text-outline block mb-1">Needs Human Review</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-tertiary">{needsReviewCount}</span>
              <span className="text-[11px] font-bold text-tertiary bg-tertiary-fixed/40 px-2 py-0.5 rounded-full">
                &lt; 70% Conf
              </span>
            </div>
            <span className="text-[11px] text-outline mt-1.5 block">Ambiguous / Multi-issue</span>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm ai-gradient-border">
            <span className="text-xs font-bold text-outline block mb-1">Avg Confidence</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-primary">{avgConfidence}%</span>
              <span className="material-symbols-outlined text-primary text-[20px]">auto_awesome</span>
            </div>
            <span className="text-[11px] text-outline mt-1.5 block">AI Confidence Score</span>
          </div>
        </div>

        {/* Processing Indicator Banner */}
        {isProcessing && (
          <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-2xl flex items-center gap-3 animate-pulse">
            <span className="material-symbols-outlined text-primary animate-spin">sync</span>
            <span className="text-sm font-bold text-primary">{processingStatus || 'Processing batch...'}</span>
          </div>
        )}

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Side Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm">
              <h3 className="font-card-title text-card-title text-on-surface mb-4">Input &amp; Batch Methods</h3>

              {/* Upload Dropzone */}
              <label className="border-2 border-dashed border-outline-variant hover:border-primary transition-colors rounded-2xl p-6 text-center bg-surface-container-low cursor-pointer block mb-4 group">
                <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[28px]">cloud_upload</span>
                </div>
                <h4 className="font-bold text-on-surface text-sm mb-1">Upload CSV File</h4>
                <p className="text-xs text-outline mb-2">Drag &amp; drop CSV file with Subject, Body columns</p>
                <span className="inline-block px-3 py-1.5 bg-white text-primary border border-primary/20 rounded-xl text-xs font-bold shadow-2xs">
                  Browse Files
                </span>
              </label>

              {/* Paste Text Action */}
              <button
                type="button"
                onClick={() => setShowPasteModal(true)}
                className="w-full bg-surface-container-low hover:bg-surface-container-high border border-outline-variant text-on-surface py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer mb-3"
              >
                <span className="material-symbols-outlined text-[18px]">content_paste</span>
                Paste Multiple Tickets
              </button>

              {/* Filter Section */}
              <div className="pt-4 border-t border-outline-variant space-y-3">
                <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">Filter Results</h4>

                <div>
                  <label className="text-[11px] font-bold text-outline block mb-1">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface"
                  >
                    <option value="All">All Categories</option>
                    <option value="Technical Issue">Technical Issue</option>
                    <option value="Billing">Billing</option>
                    <option value="Refund">Refund</option>
                    <option value="Account Access">Account Access</option>
                    <option value="Password Reset">Password Reset</option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Security Concern">Security Concern</option>
                    <option value="General Question">General Question</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-outline block mb-1">Urgency</label>
                  <select
                    value={urgencyFilter}
                    onChange={(e) => setUrgencyFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface"
                  >
                    <option value="All">All Urgency Levels</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-outline block mb-1">Review Status</label>
                  <select
                    value={reviewFilter}
                    onChange={(e) => setReviewFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Auto Routed">Auto Routed (Approved)</option>
                    <option value="Needs Review">Needs Human Review</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Results Table Side */}
          <div className="lg:col-span-8 bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-card-title text-card-title text-on-surface">Batch Results</h3>
                  <span className="text-xs text-outline">
                    Showing {filteredTickets.length} of {tickets.length} tickets
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search tickets..."
                      className="pl-8 pr-3 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary w-36 sm:w-48"
                    />
                    <span className="material-symbols-outlined absolute left-2.5 top-2 text-outline text-[16px]">
                      search
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={exportCSV}
                    title="Export CSV"
                    className="px-3 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">download</span> CSV
                  </button>

                  <button
                    type="button"
                    onClick={exportJSON}
                    title="Export JSON"
                    className="px-3 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">code</span> JSON
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-outline-variant text-[11px] text-outline font-bold uppercase tracking-wider">
                      <th className="py-3 px-3">Ticket</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Urgency</th>
                      <th className="py-3 px-3">Confidence</th>
                      <th className="py-3 px-3">Assigned Team</th>
                      <th className="py-3 px-3 text-right">Human Review</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/60 text-xs sm:text-sm">
                    {paginatedTickets.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-outline">
                          No tickets found matching your search and filter criteria.
                        </td>
                      </tr>
                    ) : (
                      paginatedTickets.map((t) => (
                        <tr key={t.id} className="hover:bg-surface-container-low/60 transition-colors">
                          <td className="py-3.5 px-3">
                            <span className="font-bold text-primary block">{t.id}</span>
                            <span className="text-xs text-on-surface max-w-xs block truncate" title={t.subject}>
                              {t.subject}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 font-medium text-on-surface">{t.category}</td>
                          <td className="py-3.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase ${
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
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-2">
                              <div className="w-14 bg-surface-container-high rounded-full h-2 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    t.confidence >= 90
                                      ? 'bg-primary'
                                      : t.confidence >= 70
                                      ? 'bg-amber-500'
                                      : 'bg-error'
                                  }`}
                                  style={{ width: `${t.confidence}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-bold text-on-surface">{t.confidence}%</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-on-surface font-medium">{t.assignedTeam}</td>
                          <td className="py-3.5 px-3 text-right">
                            <span
                              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                                t.humanReview
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[13px]">
                                {t.humanReview ? 'warning' : 'check_circle'}
                              </span>
                              {t.humanReview ? 'Yes (<70%)' : 'No (Auto)'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="pt-6 border-t border-outline-variant flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-outline mt-6">
              <span>
                Page {currentPage} of {totalPages} ({filteredTickets.length} items)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface hover:bg-surface-container-high disabled:opacity-40 cursor-pointer"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                      currentPage === page ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface hover:bg-surface-container-high disabled:opacity-40 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Paste Modal */}
      {showPasteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-surface-container-lowest p-6 rounded-3xl max-w-lg w-full border border-outline-variant shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-on-surface text-base">Paste Multiple Tickets</h3>
              <button
                type="button"
                onClick={() => setShowPasteModal(false)}
                className="text-outline hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="text-xs text-outline">
              Format: Each line as "Subject | Body description" or simply one ticket description per line.
            </p>
            <textarea
              rows={8}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder={`Cannot login | I reset my password but I cannot access my account.\nRefund request | I was charged twice this month.\nApp crashes | Uploading PDF crashes browser.`}
              className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary font-mono"
            ></textarea>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPasteModal(false)}
                className="px-4 py-2 bg-surface-container-low text-on-surface rounded-xl text-xs font-bold hover:bg-surface-container-high cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleParsePastedText}
                className="px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold hover:opacity-90 cursor-pointer"
              >
                Analyze Batch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
