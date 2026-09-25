import React, { useState } from 'react';
import { NavTab } from '../types';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navTabs: { tab: NavTab; label: string; icon: string }[] = [
    { tab: 'home', label: 'Home', icon: 'home' },
    { tab: 'analyze', label: 'Analyze Ticket', icon: 'analytics' },
    { tab: 'batch', label: 'Batch Processing', icon: 'dataset' },
    { tab: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { tab: 'qa', label: 'QA Suite', icon: 'verified' },
    { tab: 'about', label: 'About', icon: 'info' },
  ];

  const handleMobileNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-surface-container-lowest sticky top-0 z-50 shadow-sm border-b border-outline-variant">
      <div className="flex justify-between items-center w-full px-4 sm:px-6 lg:px-8 max-w-container-max-width mx-auto h-16">
        <div className="flex items-center gap-4 sm:gap-8 h-full">
          {/* Logo */}
          <span 
            onClick={() => onSelectTab('home')}
            className="inline-flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none group h-full"
          >
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary via-blue-600 to-sky-400 flex items-center justify-center text-white shadow-sm shadow-primary/25 ring-1 ring-primary/20 group-hover:scale-105 group-hover:shadow-md transition-all duration-200 shrink-0">
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2 2Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </span>
            <span className="font-bold text-lg sm:text-[20px] tracking-tight text-primary leading-none">SupportFlow AI</span>
          </span>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 h-full">
            {navTabs.map(({ tab, label }) => {
              const isActive = currentTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => onSelectTab(tab)}
                  className={`h-full inline-flex items-center px-3 xl:px-3.5 border-b-2 text-sm font-medium transition-all cursor-pointer ${
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

        {/* Right Action & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-4 h-full">
          <button 
            type="button"
            onClick={() => onSelectTab('analyze')}
            className="hidden sm:inline-flex items-center justify-center h-10 px-4 sm:px-5 rounded-xl font-medium text-xs sm:text-sm bg-primary text-on-primary hover:opacity-95 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px] mr-1.5 hidden sm:inline">auto_awesome</span>
            Analyze Ticket
          </button>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 text-on-surface hover:bg-surface-container-low rounded-xl transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[26px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-start animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest border-b border-outline-variant p-4 shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto space-y-2">
            <div className="text-xs font-bold text-outline px-3 py-1.5 uppercase tracking-wider">
              Navigation Menu
            </div>
            {navTabs.map(({ tab, label, icon }) => {
              const isActive = currentTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => handleMobileNavClick(tab)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{icon}</span>
                  <span>{label}</span>
                  {isActive && (
                    <span className="material-symbols-outlined text-[18px] ml-auto">arrow_forward</span>
                  )}
                </button>
              );
            })}

            <div className="pt-3 border-t border-outline-variant">
              <button
                type="button"
                onClick={() => handleMobileNavClick('analyze')}
                className="w-full bg-primary-container text-on-primary-container py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                Start Single Ticket Triage
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)}></div>
        </div>
      )}
    </header>
  );
};
