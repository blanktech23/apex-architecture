'use client';

import React from 'react';
import { motion } from 'framer-motion';

export type TabId = 'overview' | 'agents' | 'integrations' | 'dataflow' | 'scale';

const tabs: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'agents', label: 'Agents' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'dataflow', label: 'Data Flow' },
  { id: 'scale', label: 'Scale' },
];

interface NavigationTabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {
  return (
    <nav className="flex items-center gap-1 rounded-xl p-1" style={{ background: 'rgba(255,255,255,0.03)' }} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === tab.id ? 'text-white' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="active-tab"
              className="absolute inset-0 rounded-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            />
          )}
          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
