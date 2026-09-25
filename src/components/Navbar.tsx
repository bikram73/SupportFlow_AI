import React from 'react';
import { NavTab } from '../types';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab }) => {
  const navTabs: { tab: NavTab; label: string }[] = [
    { tab: 'home', label: 'Home' },
    { tab: 'analyze', label: 'Analyze Ticket' },
    { tab: 'batch', label: 'Batch Processing' },
    { tab: 'dashboard', label: 'Dashboard' },
    { tab: 'about', label: 'About' },
  ];

  return (
    <header className="bg-surface-container-lowest sticky top-0 z-50 shadow-sm border-b border-outline-variant">
      <div className="flex justify-between items-center w-full px-margin-desktop max-w-container-max-width mx-auto h-16">
        <div className="flex items-center gap-8 h-full">
          <span 
            onClick={() => onSelectTab('home')}
            className="inline-flex items-center gap-2.5 cursor-pointer select-none group h-full"
          >
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary via-blue-600 to-sky-400 flex items-center justify-center text-white shadow-sm shadow-primary/25 ring-1 ring-primary/20 group-hover:scale-105 group-hover:shadow-md transition-all duration-200 shrink-0">
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </span>
            <span className="font-bold text-[20px] tracking-tight text-primary leading-none">SupportFlow AI</span>
          </span>
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 h-full">
            {navTabs.map(({ tab, label }) => {
              const isActive = currentTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => onSelectTab(tab)}
                  className={`h-full inline-flex items-center px-3.5 border-b-2 text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'text-primary border-primary font-semibold'
                      : 'text-on-surface-variant border-transparent hover:text-primary hover:border-outline-variant/60'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4 h-full">
          <button 
            type="button"
            onClick={() => onSelectTab('analyze')}
            className="inline-flex items-center justify-center h-10 px-5 rounded-xl font-medium text-sm bg-primary-container text-on-primary-container hover:opacity-90 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            Analyze Tickets
          </button>
        </div>
      </div>
    </header>
  );
};
