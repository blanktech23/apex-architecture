'use client';

import React from 'react';
import { AgentsListView } from './AgentsListView';
import { IntegrationsListView } from './IntegrationsListView';

interface ComponentsViewProps {
  onSelect: (id: string, type: 'agent' | 'integration' | 'human') => void;
}

export function ComponentsView({ onSelect }: ComponentsViewProps) {
  return (
    <div className="w-full h-full overflow-y-auto p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <AgentsListView onSelect={onSelect} inline />

        {/* Divider */}
        <div className="my-10 flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <span className="text-[10px] font-medium text-slate-600 uppercase tracking-widest">Connected Systems</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <IntegrationsListView onSelect={onSelect} inline />
      </div>
    </div>
  );
}
