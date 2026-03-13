'use client';

import React, { useState, useCallback } from 'react';
import { Brain } from 'lucide-react';
import { NavigationTabs, type TabId } from '@/components/NavigationTabs';
import { ArchitectureFlow } from '@/components/ArchitectureFlow';
import { AgentsListView } from '@/components/AgentsListView';
import { IntegrationsListView } from '@/components/IntegrationsListView';
import { DetailPanel } from '@/components/DetailPanel';
import { ScaleView } from '@/components/ScaleView';
import { DataFlowView } from '@/components/DataFlowView';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'agent' | 'integration' | 'human' | null>(null);

  const handleSelect = useCallback((id: string, type: 'agent' | 'integration' | 'human') => {
    setSelectedId(id);
    setSelectedType(type);
  }, []);

  const handleDeselect = useCallback(() => {
    setSelectedId(null);
    setSelectedType(null);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="shrink-0 border-b border-white/5">
        <div className="max-w-[1800px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
              <Brain className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-white tracking-tight">
                Apex Intelligence
              </h1>
              <p className="text-[11px] text-slate-500">
                Platform Architecture
              </p>
            </div>
          </div>
          <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </header>

      {/* Main canvas */}
      <main className="flex-1 relative overflow-hidden">
        {activeTab === 'overview' && (
          <ArchitectureFlow
            activeTab={activeTab}
            selectedId={selectedId}
            selectedType={selectedType}
            onSelect={handleSelect}
            onDeselect={handleDeselect}
          />
        )}
        {activeTab === 'agents' && (
          <AgentsListView onSelect={handleSelect} />
        )}
        {activeTab === 'integrations' && (
          <IntegrationsListView onSelect={handleSelect} />
        )}
        {activeTab === 'dataflow' && <DataFlowView />}
        {activeTab === 'scale' && <ScaleView />}
      </main>

      {/* Detail panel for agents/integrations list views */}
      {(activeTab === 'agents' || activeTab === 'integrations') && (
        <DetailPanel
          selectedId={selectedId}
          selectedType={selectedType}
          onClose={handleDeselect}
        />
      )}

      {/* Footer */}
      <footer className="shrink-0 border-t border-white/5 px-6 py-3">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <p className="text-[11px] text-slate-600">
            Apex Intelligence &mdash; AI Agent Platform for Construction
          </p>
          <p className="text-[11px] text-slate-600">
            Click any agent or integration to explore details
          </p>
        </div>
      </footer>
    </div>
  );
}
