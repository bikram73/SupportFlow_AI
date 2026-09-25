import React from 'react';
import { NavTab } from '../types';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab }) => {
  return (
    <header className="bg-surface-container-lowest sticky top-0 z-50 shadow-sm border-b border-outline-variant">
      <div className="flex justify-between items-center w-full px-margin-desktop max-w-container-max-width mx-auto h-16">
        <div className="flex items-center gap-8">
          <span 
            onClick={() => onSelectTab('home')}
            className="font-card-title text-card-title text-primary cursor-pointer select-none"
          >
            SupportFlow AI
          </span>
          <nav className="hidden md:flex items-center gap-6">
            <button
              type="button"
              onClick={() => onSelectTab('home')}
              className={`font-body-main text-body-main cursor-pointer active:opacity-80 transition-colors ${
                currentTab === 'home'
                  ? 'text-primary border-b-2 border-primary pb-1 font-semibold'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Home
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('analyze')}
              className={`font-body-main text-body-main cursor-pointer active:opacity-80 transition-colors ${
                currentTab === 'analyze'
                  ? 'text-primary border-b-2 border-primary pb-1 font-semibold'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Analyze Ticket
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('batch')}
              className={`font-body-main text-body-main cursor-pointer active:opacity-80 transition-colors ${
                currentTab === 'batch'
                  ? 'text-primary border-b-2 border-primary pb-1 font-semibold'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Batch Processing
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('dashboard')}
              className={`font-body-main text-body-main cursor-pointer active:opacity-80 transition-colors ${
                currentTab === 'dashboard'
                  ? 'text-primary border-b-2 border-primary pb-1 font-semibold'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Dashboard
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('about')}
              className={`font-body-main text-body-main cursor-pointer active:opacity-80 transition-colors ${
                currentTab === 'about'
                  ? 'text-primary border-b-2 border-primary pb-1 font-semibold'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              About
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={() => onSelectTab('analyze')}
            className="bg-primary-container text-on-primary-container px-6 py-2 rounded-xl font-button-label text-button-label hover:opacity-90 transition-all cursor-pointer"
          >
            Analyze Tickets
          </button>
        </div>
      </div>
    </header>
  );
};
