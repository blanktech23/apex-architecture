'use client';

import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { agents } from '@/data/agents';
import { integrations } from '@/data/integrations';

type IconName = keyof typeof LucideIcons;

interface AgentsListViewProps {
  onSelect: (id: string, type: 'agent' | 'integration') => void;
  inline?: boolean;
}

export function AgentsListView({ onSelect, inline }: AgentsListViewProps) {
  const content = (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-xl font-semibold text-white mb-1">AI Agents</h2>
        <p className="text-sm text-slate-500">
          7 specialized agents powering Kiptra AI
        </p>
      </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent, i) => {
            const Icon = (LucideIcons[agent.icon as IconName] as unknown as LucideIcon) || LucideIcons.Circle;
            const connectedIntegrations = agent.integrations
              .map((intId) => integrations.find((ig) => ig.id === intId))
              .filter(Boolean);

            return (
              <motion.button
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => onSelect(agent.id, 'agent')}
                className="group text-left rounded-xl p-5 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  backdropFilter: 'blur(12px)',
                }}
                whileHover={{
                  borderColor: `${agent.color}40`,
                  boxShadow: `0 0 30px ${agent.color}10`,
                }}
              >
                {/* Icon + Name */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: `${agent.color}15`,
                      border: `1px solid ${agent.color}30`,
                    }}
                  >
                    <Icon className="w-5 h-5" color={agent.color} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-white truncate">
                      {agent.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate">
                      {agent.subtitle}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 mb-4 line-clamp-2">
                  {agent.description}
                </p>

                {/* Connected Integrations */}
                <div className="flex flex-wrap gap-1.5">
                  {connectedIntegrations.map((integration) => {
                    if (!integration) return null;
                    const IntIcon = (LucideIcons[integration.icon as IconName] as unknown as LucideIcon) || LucideIcons.Circle;
                    return (
                      <div
                        key={integration.id}
                        className="flex items-center gap-1 rounded-md px-2 py-1"
                        style={{
                          background: `${integration.color}10`,
                          border: `1px solid ${integration.color}20`,
                        }}
                      >
                        <IntIcon className="w-3 h-3" color={integration.color} />
                        <span className="text-[10px] text-slate-400">
                          {integration.name}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Accent line at bottom */}
                <div
                  className="h-0.5 rounded-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `linear-gradient(to right, ${agent.color}, transparent)`,
                  }}
                />
              </motion.button>
            );
          })}
        </div>
    </>
  );

  if (inline) return content;

  return (
    <div className="w-full h-full overflow-y-auto p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        {content}
      </div>
    </div>
  );
}
