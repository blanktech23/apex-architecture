'use client';

import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { agents } from '@/data/agents';
import { integrations } from '@/data/integrations';

type IconName = keyof typeof LucideIcons;

interface IntegrationsListViewProps {
  onSelect: (id: string, type: 'agent' | 'integration') => void;
}

export function IntegrationsListView({ onSelect }: IntegrationsListViewProps) {
  return (
    <div className="w-full h-full overflow-y-auto p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-white mb-1">Integrations</h2>
          <p className="text-sm text-slate-500">
            7 connected systems powering the agent network
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map((integration, i) => {
            const Icon = (LucideIcons[integration.icon as IconName] as unknown as LucideIcon) || LucideIcons.Circle;
            const connectedAgentsList = integration.connectedAgents
              .map((agentId) => agents.find((a) => a.id === agentId))
              .filter(Boolean);

            return (
              <motion.button
                key={integration.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => onSelect(integration.id, 'integration')}
                className="group text-left rounded-xl p-5 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  backdropFilter: 'blur(12px)',
                }}
                whileHover={{
                  borderColor: `${integration.color}40`,
                  boxShadow: `0 0 30px ${integration.color}10`,
                }}
              >
                {/* Icon + Name */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: `${integration.color}15`,
                      border: `1px solid ${integration.color}30`,
                    }}
                  >
                    <Icon className="w-5 h-5" color={integration.color} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-white truncate">
                      {integration.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate">
                      {integration.description}
                    </p>
                  </div>
                </div>

                {/* Auth + Data Flow */}
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{
                      background: `${integration.color}15`,
                      color: integration.color,
                      border: `1px solid ${integration.color}25`,
                    }}
                  >
                    {integration.authMethod}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {integration.dataFlow}
                  </span>
                </div>

                {/* Connected Agents */}
                <div className="flex flex-wrap gap-1.5">
                  {connectedAgentsList.map((agent) => {
                    if (!agent) return null;
                    const AgentIcon = (LucideIcons[agent.icon as IconName] as unknown as LucideIcon) || LucideIcons.Circle;
                    return (
                      <div
                        key={agent.id}
                        className="flex items-center gap-1 rounded-md px-2 py-1"
                        style={{
                          background: `${agent.color}10`,
                          border: `1px solid ${agent.color}20`,
                        }}
                      >
                        <AgentIcon className="w-3 h-3" color={agent.color} />
                        <span className="text-[10px] text-slate-400">
                          {agent.name}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Accent line at bottom */}
                <div
                  className="h-0.5 rounded-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `linear-gradient(to right, ${integration.color}, transparent)`,
                  }}
                />
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
