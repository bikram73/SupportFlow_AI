import React from 'react';
import { NavTab } from '../types';

interface MobileBottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentTab, onSelectTab }) => {
  const bottomTabs: { tab: NavTab; label: string; icon: string }[] = [
    { tab: 'home', label: 'Home', icon: 'home' },
    { tab: 'analyze', label: 'Analyze', icon: 'auto_awesome' },
    { tab: 'batch', label: 'Batch', icon: 'dataset' },
    { tab: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { tab: 'qa', label: 'QA Suite', icon: 'verified' },
  ];

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur-md border-t border-outline-variant shadow-lg pb-safe"
    >
      <div className="grid grid-cols-5 h-15 max-w-md mx-auto items-center px-1">
        {bottomTabs.map(({ tab, label, icon }) => {
          const isActive = currentTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onSelectTab(tab)}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer relative ${
                isActive ? 'text-primary font-bold' : 'text-outline hover:text-on-surface'
              }`}
            >
              {isActive && (
                <span className="absolute top-0.5 w-6 h-1 bg-primary rounded-full"></span>
              )}
              <span className={`material-symbols-outlined text-[22px] transition-transform ${
                isActive ? 'scale-110' : ''
              }`}>
                {icon}
              </span>
              <span className="text-[10px] tracking-tight mt-0.5">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
