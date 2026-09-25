import React, { useState, useEffect } from 'react';
import { BatchTicket, AnalyzedTicket } from '../types';
import { DEFAULT_SAMPLE_TICKETS, ruleBasedTriage } from '../utils/triageFallback';
import { useTickets } from '../context/TicketContext';

export const BatchProcessingView: React.FC = () => {
  const { tickets: contextTickets, addBatchTickets, clearTickets: clearGlobalTickets } = useTickets();
  const [tickets, setTickets] = useState<BatchTicket[]>(() => {
    return contextTickets.map((t) => ({
      id: t.id,
      subject: t.subject,
      body: t.body,
      category: t.category,
      urgency: t.urgency,
      confidence: t.confidence,
      assignedTeam: t.assignedTeam,
      humanReview: t.humanReview,
      routingStatus: t.routingStatus,
      reason: t.reason,
      status: t.routingStatus
    }));
  });

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

  // Keep local view synced with global TicketContext
  useEffect(() => {
    setTickets(
      contextTickets.map((t) => ({
        id: t.id,
        subject: t.subject,
        body: t.body,
        category: t.category,
        urgency: t.urgency,
        confidence: t.confidence,
        assignedTeam: t.assignedTeam,
        humanReview: t.humanReview,
        routingStatus: t.routingStatus,
        reason: t.reason,
        status: t.routingStatus
      }))
    );
  }, [contextTickets]);

  const handleGenerateSamples = async (count: number) => {
    setIsProcessing(true);
    setProcessingStatus(`Generating ${count} synthetic tickets...`);
    try {
      const genRes = await fetch('/api/generate-samples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count })
      });

      if (genRes.ok) {
        const genData = await genRes.json();
        if (genData && genData.samples && genData.samples.length > 0) {
          await processTicketBatch(genData.samples);
          return;
        }
      }
      throw new Error('Fallback to local generation');
    } catch {
      // Local generator fallback
      const generated: Array<{ id: string; subject: string; body: string }> = [];
      const sampleSubjects = [
        'Production server CPU overload',
        'Cannot access billing invoice',
        'Requesting refund for accidental renewal',
        'Bug in export feature',
        'Password reset link not working',
        'Suspicious login attempt detected',
        'Inquiry about Enterprise plan pricing',
        'Please add support for dark mode'
      ];

      for (let i = 0; i < count; i++) {
        const baseSub = sampleSubjects[i % sampleSubjects.length];
        generated.push({
          id: `ANL-GEN-${2000 + i}`,
          subject: `${baseSub} #${i + 1}`,
          body: `Detailed ticket report regarding: ${baseSub}. Customer requires prompt review.`
        });
      }
      await processTicketBatch(generated);
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  const processTicketBatch = async (rawTickets: Array<{ id?: string; subject: string; body?: string }>) => {
    setIsProcessing(true);
    setProcessingStatus(`Analyzing batch of ${rawTickets.length} tickets with Gemini AI...`);

    try {
      const res = await fetch('/api/analyze-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tickets: rawTickets })
      });

      if (!res.ok) {
        throw new Error(`Batch API error: ${res.status}`);
      }

      const data = await res.json();
      if (data && data.tickets && Array.isArray(data.tickets)) {
        const formatted: BatchTicket[] = data.tickets.map((t: any) => {
          const routingStatus = t.humanReview || t.confidence < 70 ? 'Needs Review' : 'Auto Routed';
          return {
            id: t.id,
            subject: t.subject,
            body: t.body || '',
            category: t.category,
            urgency: t.urgency,
            confidence: t.confidence,
            assignedTeam: t.assignedTeam,
            humanReview: t.humanReview,
            routingStatus: t.routingStatus || routingStatus,
            reason: t.reason,
            status: routingStatus
          };
        });
        setTickets(formatted);
        setCurrentPage(1);
        addBatchTickets(
          formatted.map((t) => ({
            id: t.id,
            subject: t.subject,
            body: t.body || '',
            category: t.category,
            urgency: t.urgency,
            confidence: t.confidence,
            assignedTeam: t.assignedTeam,
            humanReview: t.humanReview,
            routingStatus: t.routingStatus,
            reason: t.reason,
            timestamp: 'Just now'
          }))
        );
        return;
      }
    } catch (err) {
      console.warn('Batch API call fallback to client-side rule classification:', err);
      const fallbackFormatted: BatchTicket[] = rawTickets.map((t, idx) => {
        const sub = t.subject || `Ticket #${idx + 1}`;
        const bodyText = t.body || '';
        const triage = ruleBasedTriage(sub, bodyText);

        return {
          id: t.id || `ANL-${Math.floor(1000 + Math.random() * 9000)}`,
          subject: sub,
          body: bodyText,
          category: triage.category,
          urgency: triage.urgency,
          confidence: triage.confidence,
          assignedTeam: triage.assignedTeam,
          humanReview: triage.humanReview,
          routingStatus: triage.routingStatus,
          reason: triage.reason,
          status: triage.routingStatus
        };
      });
      setTickets(fallbackFormatted);
      setCurrentPage(1);
      addBatchTickets(
        fallbackFormatted.map((t) => ({
          id: t.id,
          subject: t.subject,
          body: t.body || '',
          category: t.category,
          urgency: t.urgency,
          confidence: t.confidence,
          assignedTeam: t.assignedTeam,
          humanReview: t.humanReview,
          routingStatus: t.routingStatus,
          reason: t.reason,
          timestamp: 'Just now'
        }))
      );
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  const handleParsePastedText = () => {
    if (!customText.trim()) return;
    const lines = customText.split('\n').filter((l) => l.trim().length > 0);
    const parsed = lines.map((line, idx) => {
      const parts = line.split('|');
      if (parts.length >= 2) {
        return { id: `ANL-PST-${1000 + idx}`, subject: parts[0].trim(), body: parts[1].trim() };
      }
      return { id: `ANL-PST-${1000 + idx}`, subject: line.slice(0, 50).trim(), body: line.trim() };
    });

    setShowPasteModal(false);
    setCustomText('');
    processTicketBatch(parsed);
  };

  // Robust RFC 4180 CSV parser
  const parseCSVContent = (content: string) => {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentCell = '';
    let insideQuote = false;

    for (let i = 0; i < content.length; i++) {
      const char = content[i];
      const nextChar = content[i + 1];

      if (char === '"') {
        if (insideQuote && nextChar === '"') {
          currentCell += '"';
          i++; // Skip escaped quote
        } else {
          insideQuote = !insideQuote;
        }
      } else if (char === ',' && !insideQuote) {
        currentRow.push(currentCell.trim());
        currentCell = '';
      } else if ((char === '\r' || char === '\n') && !insideQuote) {
        if (char === '\r' && nextChar === '\n') {
          i++; // Skip CRLF
        }
        currentRow.push(currentCell.trim());
        if (currentRow.some((c) => c.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentCell = '';
      } else {
        currentCell += char;
      }
    }
    if (currentCell || currentRow.length > 0) {
      currentRow.push(currentCell.trim());
      if (currentRow.some((c) => c.length > 0)) {
        rows.push(currentRow);
      }
    }

    if (rows.length === 0) return [];

    // Skip header row if it contains 'subject'
    const startIdx = rows[0][0]?.toLowerCase().includes('subject') ? 1 : 0;
    const items: Array<{ id?: string; subject: string; body: string }> = [];

    for (let r = startIdx; r < rows.length; r++) {
      const row = rows[r];
      if (row.length >= 2) {
        items.push({
          id: `ANL-CSV-${3000 + r}`,
          subject: row[0],
          body: row.slice(1).join(', ')
        });
      } else if (row.length === 1 && row[0].trim().length > 0) {
        items.push({
          id: `ANL-CSV-${3000 + r}`,
          subject: row[0].slice(0, 50),
          body: row[0]
        });
      }
    }
    return items;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const parsed = parseCSVContent(content);
        if (parsed.length > 0) {
          processTicketBatch(parsed);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // 1-Click Load 25 sample CSV tickets
  const handleLoadSampleCSV = async () => {
    setIsProcessing(true);
    setProcessingStatus('Loading 25 sample CSV tickets...');
    try {
      const res = await fetch('/sample_support_tickets_batch.csv');
      if (!res.ok) throw new Error('Could not fetch sample CSV');
      const csvText = await res.text();
      const parsed = parseCSVContent(csvText);
      if (parsed.length > 0) {
        await processTicketBatch(parsed);
      }
    } catch (err) {
      console.warn('Failed to fetch static sample CSV, generating synthetic fallback:', err);
      handleGenerateSamples(25);
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  // Download Sample CSV template file
  const handleDownloadSampleTemplate = () => {
    const link = document.createElement('a');
    link.href = '/sample_support_tickets_batch.csv';
    link.download = 'sample_support_tickets_batch.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearBatch = () => {
    clearGlobalTickets();
    setTickets([]);
    setCurrentPage(1);
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
      (reviewFilter === 'Auto Routed' && !t.humanReview) ||
      (reviewFilter === 'Needs Review' && t.humanReview);

    return matchesSearch && matchesCategory && matchesUrgency && matchesReview;
  });

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage) || 1;
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Compute live local metrics
  const totalCount = tickets.length;
  const criticalCount = tickets.filter((t) => t.urgency === 'Critical').length;
  const highCount = tickets.filter((t) => t.urgency === 'High').length;
  const needsReviewCount = tickets.filter((t) => t.humanReview || t.confidence < 70).length;
  const autoRoutedCount = tickets.filter((t) => !t.humanReview && t.confidence >= 90).length;
  const avgConfidence =
    totalCount > 0 ? (tickets.reduce((acc, curr) => acc + curr.confidence, 0) / totalCount).toFixed(1) : '0';

  // Export to CSV
  const exportCSV = () => {
    if (tickets.length === 0) return;
    const headers = ['ID', 'Subject', 'Category', 'Urgency', 'Confidence', 'Target Team', 'Human Review', 'Status', 'Reason'];
    const rows = tickets.map((t) => [
      t.id,
      `"${t.subject.replace(/"/g, '""')}"`,
      t.category,
      t.urgency,
      `${t.confidence}%`,
      t.assignedTeam,
      t.humanReview ? 'Yes' : 'No',
      t.routingStatus || t.status,
      `"${(t.reason || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `support_tickets_batch_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to JSON
  const exportJSON = () => {
    if (tickets.length === 0) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(tickets, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `support_tickets_batch_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div id="batch-view" className="w-full">
      <div className="max-w-container-max-width mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8">
        {/* Top Header Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 bg-surface-container-lowest p-4 sm:p-6 rounded-3xl border border-outline-variant shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight">
                Bulk Ticket Ingestion &amp; Batch Processing
              </h1>
              {totalCount > 0 && (
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-bold">
                  {totalCount} Stored in LocalStorage
                </span>
              )}
            </div>
            <p className="text-xs text-on-surface-variant">
              Upload your support CSV file or load 25 sample tickets to run AI triage across enterprise queues.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleLoadSampleCSV}
              disabled={isProcessing}
              className="px-3 sm:px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">flash_on</span>
              Load 25 CSV Tickets
            </button>

            {totalCount > 0 && (
              <button
                type="button"
                onClick={handleClearBatch}
                className="px-3 py-2 bg-surface-container-low hover:bg-error/10 hover:text-error hover:border-error/30 border border-outline-variant text-outline rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
                Clear Batch
              </button>
            )}
          </div>
        </div>

        {/* Batch Status Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="bg-surface-container-lowest p-3.5 sm:p-5 rounded-2xl border border-outline-variant shadow-xs">
            <span className="text-[11px] sm:text-xs font-bold text-outline block mb-1">Total Ingested</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-on-surface">{totalCount}</div>
            <span className="text-[10px] sm:text-[11px] text-outline mt-1 block">Active Dataset</span>
          </div>

          <div className="bg-surface-container-lowest p-3.5 sm:p-5 rounded-2xl border border-outline-variant shadow-xs">
            <span className="text-[11px] sm:text-xs font-bold text-outline block mb-1">Auto-Routed</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700">{autoRoutedCount}</span>
              <span className="text-[10px] sm:text-[11px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                &ge; 90%
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-outline mt-1 block">High Confidence</span>
          </div>

          <div className="bg-surface-container-lowest p-3.5 sm:p-5 rounded-2xl border border-outline-variant shadow-xs">
            <span className="text-[11px] sm:text-xs font-bold text-outline block mb-1">Critical Urgency</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-error">{criticalCount}</span>
              <span className="text-[10px] sm:text-[11px] font-bold text-error bg-error-container/30 px-1.5 py-0.5 rounded-full">
                {criticalCount + highCount} High/Crit
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-outline mt-1 block">Urgent Action</span>
          </div>

          <div className="bg-surface-container-lowest p-3.5 sm:p-5 rounded-2xl border border-outline-variant shadow-xs">
            <span className="text-[11px] sm:text-xs font-bold text-outline block mb-1">Human Review</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-700">{needsReviewCount}</span>
              <span className="text-[10px] sm:text-[11px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded-full">
                &lt; 70%
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-outline mt-1 block">Review Required</span>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-surface-container-lowest p-3.5 sm:p-5 rounded-2xl border border-outline-variant shadow-xs ai-gradient-border">
            <span className="text-[11px] sm:text-xs font-bold text-outline block mb-1">Avg Confidence</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-primary">{avgConfidence}%</span>
              <span className="material-symbols-outlined text-primary text-[20px]">auto_awesome</span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-outline mt-1 block">AI Confidence Score</span>
          </div>
        </div>

        {/* Processing Indicator Banner */}
        {isProcessing && (
          <div className="p-4 bg-primary/10 border border-primary/30 rounded-2xl flex items-center gap-3 animate-pulse">
            <span className="material-symbols-outlined text-primary animate-spin">sync</span>
            <span className="text-xs sm:text-sm font-bold text-primary">{processingStatus || 'Processing batch...'}</span>
          </div>
        )}

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Controls Side Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-surface-container-lowest p-4 sm:p-6 rounded-3xl border border-outline-variant shadow-xs">
              <h3 className="font-bold text-base sm:text-lg text-on-surface mb-3 sm:mb-4">Input &amp; Batch Methods</h3>

              {/* Upload Dropzone */}
              <label className="border-2 border-dashed border-outline-variant hover:border-primary transition-colors rounded-2xl p-4 sm:p-5 text-center bg-surface-container-low cursor-pointer block mb-3 group">
                <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[24px] sm:text-[28px]">cloud_upload</span>
                </div>
                <h4 className="font-bold text-on-surface text-xs sm:text-sm mb-0.5">Upload Custom CSV File</h4>
                <p className="text-[11px] text-outline mb-2">Subject, Body columns</p>
                <span className="inline-block px-3 py-1.5 bg-white text-primary border border-primary/20 rounded-xl text-xs font-bold shadow-2xs">
                  Browse Files
                </span>
              </label>

              {/* Sample CSV Quick Actions */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  type="button"
                  onClick={handleDownloadSampleTemplate}
                  title="Download sample CSV file to your computer"
                  className="px-2.5 py-2 bg-surface-container-low hover:bg-surface-container-high border border-outline-variant text-on-surface rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px] text-primary">download</span>
                  Sample CSV
                </button>

                <button
                  type="button"
                  onClick={handleLoadSampleCSV}
                  disabled={isProcessing}
                  title="Instant load 25 realistic enterprise support tickets from CSV"
                  className="px-2.5 py-2 bg-primary/10 hover:bg-primary/15 border border-primary/30 text-primary rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[15px]">flash_on</span>
                  Load 25 CSV
                </button>
              </div>

              {/* Paste Text Action */}
              <button
                type="button"
                onClick={() => setShowPasteModal(true)}
                className="w-full bg-surface-container-low hover:bg-surface-container-high border border-outline-variant text-on-surface py-2.5 sm:py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer mb-3"
              >
                <span className="material-symbols-outlined text-[18px]">content_paste</span>
                Paste Multiple Tickets
              </button>

              {/* Filter Section */}
              <div className="pt-3 sm:pt-4 border-t border-outline-variant space-y-2.5 sm:space-y-3">
                <h4 className="text-[11px] font-bold text-on-surface uppercase tracking-wider">Filter Results</h4>

                <div>
                  <label className="text-[10px] sm:text-[11px] font-bold text-outline block mb-1">Category</label>
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
                    <option value="Sales Inquiry">Sales Inquiry</option>
                    <option value="Subscription">Subscription</option>
                    <option value="General Question">General Question</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] sm:text-[11px] font-bold text-outline block mb-1">Urgency</label>
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
                  <label className="text-[10px] sm:text-[11px] font-bold text-outline block mb-1">Review Status</label>
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
          <div className="lg:col-span-8 bg-surface-container-lowest p-4 sm:p-6 lg:p-8 rounded-3xl border border-outline-variant shadow-xs flex flex-col justify-between">
            {totalCount === 0 ? (
              <div className="my-auto py-16 text-center">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-[36px]">dataset</span>
                </div>
                <h3 className="font-extrabold text-base sm:text-lg text-on-surface mb-1">
                  No Batch Tickets Loaded Yet
                </h3>
                <p className="text-xs text-outline max-w-md mx-auto mb-6">
                  Upload your support CSV file, paste raw text, or tap "Load 25 CSV" to analyze and route tickets. All processed tickets will be saved in your browser and reflected on the live dashboard.
                </p>
                <div className="flex flex-wrap justify-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleLoadSampleCSV}
                    disabled={isProcessing}
                    className="px-5 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[18px]">flash_on</span>
                    Load 25 Sample CSV Tickets
                  </button>
                  <label className="px-4 py-2.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface border border-outline-variant rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer">
                    <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
                    <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                    Browse CSV File
                  </label>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-on-surface">Batch Results</h3>
                    <span className="text-[11px] sm:text-xs text-outline">
                      Showing {filteredTickets.length} of {tickets.length} tickets (Saved in LocalStorage)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 sm:flex-none">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search..."
                        className="pl-8 pr-3 py-1.5 sm:py-2 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary w-full sm:w-44"
                      />
                      <span className="material-symbols-outlined absolute left-2.5 top-1.5 sm:top-2 text-outline text-[16px]">
                        search
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={exportCSV}
                      title="Export CSV"
                      className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">download</span> CSV
                    </button>

                    <button
                      type="button"
                      onClick={exportJSON}
                      title="Export JSON"
                      className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">code</span> JSON
                    </button>
                  </div>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                  <table className="w-full text-left border-collapse min-w-[560px]">
                    <thead>
                      <tr className="border-b border-outline-variant text-[11px] text-outline font-bold uppercase tracking-wider">
                        <th className="py-2.5 sm:py-3 px-2 sm:px-3">Ticket ID &amp; Subject</th>
                        <th className="py-2.5 sm:py-3 px-2 sm:px-3">Category</th>
                        <th className="py-2.5 sm:py-3 px-2 sm:px-3">Urgency</th>
                        <th className="py-2.5 sm:py-3 px-2 sm:px-3">Confidence</th>
                        <th className="py-2.5 sm:py-3 px-2 sm:px-3">Target Team</th>
                        <th className="py-2.5 sm:py-3 px-2 sm:px-3 text-right">Human Review</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/60 text-xs sm:text-sm">
                      {paginatedTickets.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-10 text-center text-outline text-xs">
                            No tickets found matching your search and filter criteria.
                          </td>
                        </tr>
                      ) : (
                        paginatedTickets.map((t) => (
                          <tr key={t.id} className="hover:bg-surface-container-low/60 transition-colors">
                            <td className="py-3 px-2 sm:px-3">
                              <span className="font-mono font-bold text-primary block text-[11px] sm:text-xs">{t.id}</span>
                              <span className="text-xs text-on-surface max-w-[200px] sm:max-w-xs block truncate" title={t.subject}>
                                {t.subject}
                              </span>
                            </td>
                            <td className="py-3 px-2 sm:px-3 font-medium text-on-surface text-xs">{t.category}</td>
                            <td className="py-3 px-2 sm:px-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase ${
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
                            <td className="py-3 px-2 sm:px-3">
                              <div className="flex items-center gap-1.5 sm:gap-2">
                                <div className="w-10 sm:w-14 bg-surface-container-high rounded-full h-1.5 sm:h-2 overflow-hidden">
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
                                <span className="text-[11px] sm:text-xs font-bold text-on-surface">{t.confidence}%</span>
                              </div>
                            </td>
                            <td className="py-3 px-2 sm:px-3 text-on-surface font-medium text-xs">{t.assignedTeam}</td>
                            <td className="py-3 px-2 sm:px-3 text-right">
                              <span
                                className={`inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                  t.humanReview
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                <span className="material-symbols-outlined text-[12px]">
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
            )}

            {/* Pagination Controls (Only when data present) */}
            {totalCount > 0 && (
              <div className="pt-4 sm:pt-6 border-t border-outline-variant flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-outline mt-4 sm:mt-6">
                <span className="text-[11px] sm:text-xs">
                  Page {currentPage} of {totalPages} ({filteredTickets.length} items)
                </span>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-2.5 sm:px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface hover:bg-surface-container-high disabled:opacity-40 cursor-pointer text-xs"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-bold cursor-pointer text-xs ${
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
                    className="px-2.5 sm:px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface hover:bg-surface-container-high disabled:opacity-40 cursor-pointer text-xs"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Paste Modal */}
      {showPasteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest p-6 rounded-3xl max-w-lg w-full border border-outline-variant shadow-2xl">
            <h3 className="text-lg font-bold text-on-surface mb-2">Paste Multiple Tickets</h3>
            <p className="text-xs text-outline mb-4">
              Enter one ticket per line in format: <code className="bg-surface-container-low px-1.5 py-0.5 rounded font-mono">Subject | Body description</code>
            </p>
            <textarea
              rows={6}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Cannot login | Password reset fails&#10;Refund inquiry | Was charged twice on renewal"
              className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface mb-4 font-mono resize-none focus:outline-none focus:border-primary"
            ></textarea>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPasteModal(false)}
                className="px-4 py-2 bg-surface-container-high text-on-surface rounded-xl text-xs font-bold cursor-pointer hover:bg-surface-container-highest"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleParsePastedText}
                className="px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold cursor-pointer hover:opacity-90"
              >
                Parse &amp; Analyze
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
