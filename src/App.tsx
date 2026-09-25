import React, { useState } from 'react';
import { NavTab } from './types';
import { TicketProvider } from './context/TicketContext';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
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
    <TicketProvider>
      <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans antialiased selection:bg-primary/20 selection:text-primary">
        {/* Top Header Navigation */}
        <Navbar currentTab={currentTab} onSelectTab={setCurrentTab} />

        {/* Main View Area with Mobile Bottom Nav Padding */}
        <main className="flex-1 w-full pb-18 lg:pb-0 overflow-x-hidden">
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

        {/* Floating Mobile Bottom Navigation Bar */}
        <MobileBottomNav currentTab={currentTab} onSelectTab={setCurrentTab} />
      </div>
    </TicketProvider>
  );
}
