import React, { useState } from 'react';
import { NavTab } from './types';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { AnalyzeTicketView } from './components/AnalyzeTicketView';
import { BatchProcessingView } from './components/BatchProcessingView';
import { DashboardView } from './components/DashboardView';
import { AboutView } from './components/AboutView';
import { QAValidationView } from './components/QAValidationView';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');

  const handleTrySample = () => {
    setCurrentTab('analyze');
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans antialiased">
      {/* Top Fixed Header Bar */}
      <Navbar currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Main Screen Content Area */}
      <main className="flex-1 w-full">
        {currentTab === 'home' && (
          <HomeView onSelectTab={setCurrentTab} onTrySample={handleTrySample} />
        )}

        {currentTab === 'analyze' && (
          <AnalyzeTicketView />
        )}

        {currentTab === 'batch' && (
          <BatchProcessingView />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView onSelectTab={setCurrentTab} />
        )}

        {currentTab === 'qa' && (
          <QAValidationView />
        )}

        {currentTab === 'about' && (
          <AboutView onSelectTab={setCurrentTab} />
        )}
      </main>
    </div>
  );
}
