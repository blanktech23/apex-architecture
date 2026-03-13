'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertTriangle, TrendingUp, Link, BookOpen, Shield, ArrowRightLeft, User, ClipboardCheck, Lightbulb } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { agents } from '@/data/agents';
import { integrations } from '@/data/integrations';

type IconName = keyof typeof LucideIcons;

interface HumanTouchpoint {
  label: string;
  description: string;
  color: string;
  purpose: string;
  details: string[];
  connectedAgents: string[];
  approvalTypes: string[];
  whyItMatters: string;
}

const humanTouchpoints: Record<string, HumanTouchpoint> = {
  'approval-queue': {
    label: 'Approval Queue',
    description: 'Pending human actions',
    color: '#f59e0b',
    purpose: 'A centralized inbox where AI-generated drafts and recommendations wait for human review before being executed. Nothing goes out without your say-so.',
    details: [
      'Collects draft emails, purchase orders, and estimates from agents',
      'Shows side-by-side: what the AI wrote vs. the source data it used',
      'One-click approve, edit, or reject with optional feedback to improve future drafts',
      'Priority sorting: urgent items (overdue invoices, time-sensitive leads) surface first',
      'Audit trail: every approval/rejection logged with timestamp and user',
    ],
    connectedAgents: ['discovery-concierge', 'operations-controller', 'estimate-engine'],
    approvalTypes: [
      'Email drafts to leads and clients',
      'Purchase orders over threshold',
      'Estimate revisions before sending to client',
      'Lien waiver releases',
      'Invoice dispute responses',
    ],
    whyItMatters: 'AI handles the 80% of routine work (drafting, formatting, calculating), but humans make the final call on anything that leaves the building. This keeps you in control while saving hours of manual work.',
  },
  'ceo-review': {
    label: 'CEO Review',
    description: 'Final decisions & approvals',
    color: '#f59e0b',
    purpose: 'The executive command center where high-stakes decisions land. Only items that require owner-level authority appear here — everything else is handled by team members or auto-approved.',
    details: [
      'Morning briefing: AI-generated daily summary of all business activity across agents',
      'Escalations: items that exceeded team member authority or triggered risk flags',
      'Financial overview: cash flow, AR aging, margin analysis from Operations Controller',
      'Strategic recommendations: the Executive Navigator surfaces patterns and opportunities',
      'Team activity log: see what your employees approved, rejected, or modified',
    ],
    connectedAgents: ['executive-navigator'],
    approvalTypes: [
      'Large estimates (over configurable threshold)',
      'New vendor/subcontractor approvals',
      'Strategic pricing decisions',
      'Exception overrides flagged by agents',
      'Weekly/monthly financial sign-offs',
    ],
    whyItMatters: 'As the business owner, you see everything but only act on what matters. The Executive Navigator filters noise so you focus on decisions that move the needle — not routine operations your team already handles.',
  },
};

interface DetailPanelProps {
  selectedId: string | null;
  selectedType: 'agent' | 'integration' | 'human' | null;
  onClose: () => void;
}

export function DetailPanel({ selectedId, selectedType, onClose }: DetailPanelProps) {
  const agent = selectedType === 'agent' ? agents.find((a) => a.id === selectedId) : null;
  const integration = selectedType === 'integration' ? integrations.find((i) => i.id === selectedId) : null;
  const humanTouchpoint = selectedType === 'human' && selectedId ? humanTouchpoints[selectedId] ?? null : null;
  const isOpen = !!(agent || integration || humanTouchpoint);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md overflow-y-auto"
            style={{
              background:
                'linear-gradient(135deg, rgba(15, 15, 26, 0.98) 0%, rgba(10, 10, 15, 0.98) 100%)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div className="p-6">
              {agent && <AgentDetail agent={agent} onClose={onClose} />}
              {integration && <IntegrationDetail integration={integration} onClose={onClose} />}
              {humanTouchpoint && <HumanDetail touchpoint={humanTouchpoint} onClose={onClose} />}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function AgentDetail({ agent, onClose }: { agent: typeof agents[number]; onClose: () => void }) {
  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: `${agent.color}20`,
              border: `1px solid ${agent.color}40`,
            }}
          >
            {(() => {
              const Icon = (LucideIcons[agent.icon as IconName] as unknown as LucideIcon) || LucideIcons.Circle;
              return <Icon className="w-6 h-6" color={agent.color} />;
            })()}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">{agent.name}</h2>
            <p className="text-xs text-slate-500">{agent.subtitle}</p>
          </div>
        </div>
        <CloseButton onClose={onClose} />
      </div>

      <AccentBar color={agent.color} />

      {/* What it does */}
      <section className="mb-6">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          What it does
        </h3>
        <ul className="space-y-2">
          {agent.details.map((detail, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="text-sm text-slate-300 pl-4 relative"
            >
              <span
                className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full"
                style={{ background: agent.color }}
              />
              {detail}
            </motion.li>
          ))}
        </ul>
      </section>

      {/* Connects to */}
      <section className="mb-6">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
          <Link className="w-4 h-4 text-blue-400" />
          Connects to
        </h3>
        <div className="flex flex-wrap gap-2">
          {agent.integrations.map((intId) => {
            const integration = integrations.find((ig) => ig.id === intId);
            if (!integration) return null;
            const IntIcon = (LucideIcons[integration.icon as IconName] as unknown as LucideIcon) || LucideIcons.Circle;
            return (
              <div
                key={intId}
                className="flex items-center gap-2 rounded-lg px-3 py-1.5"
                style={{
                  background: `${integration.color}10`,
                  border: `1px solid ${integration.color}25`,
                }}
              >
                <IntIcon className="w-3.5 h-3.5" color={integration.color} />
                <span className="text-xs text-slate-300">{integration.name}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Human approval */}
      <section className="mb-6">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          Human approval required for
        </h3>
        <ul className="space-y-2">
          {agent.humanApproval.map((item, i) => (
            <li key={i} className="text-sm text-slate-400 pl-4 relative">
              <span className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-amber-500/60" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Metrics */}
      <section>
        <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          Key metrics it tracks
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {agent.metrics.map((metric, i) => (
            <div
              key={i}
              className="rounded-lg px-3 py-2 text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <p className="text-xs text-slate-300">{metric}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function IntegrationDetail({ integration, onClose }: { integration: typeof integrations[number]; onClose: () => void }) {
  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: `${integration.color}20`,
              border: `1px solid ${integration.color}40`,
            }}
          >
            {(() => {
              const Icon = (LucideIcons[integration.icon as IconName] as unknown as LucideIcon) || LucideIcons.Circle;
              return <Icon className="w-6 h-6" color={integration.color} />;
            })()}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">{integration.name}</h2>
            <p className="text-xs text-slate-500">{integration.description}</p>
          </div>
        </div>
        <CloseButton onClose={onClose} />
      </div>

      <AccentBar color={integration.color} />

      {/* What it does */}
      <section className="mb-6">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          What it does
        </h3>
        <ul className="space-y-2">
          {integration.details.map((detail, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="text-sm text-slate-300 pl-4 relative"
            >
              <span
                className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full"
                style={{ background: integration.color }}
              />
              {detail}
            </motion.li>
          ))}
        </ul>
      </section>

      {/* Real-world use cases */}
      <section className="mb-6">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-purple-400" />
          Real-world use cases
        </h3>
        <ul className="space-y-3">
          {integration.useCases.map((useCase, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="text-sm text-slate-300 rounded-lg p-3"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              {useCase}
            </motion.li>
          ))}
        </ul>
      </section>

      {/* Connected Agents */}
      <section className="mb-6">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
          <Link className="w-4 h-4 text-blue-400" />
          Connected Agents
        </h3>
        <div className="flex flex-wrap gap-2">
          {integration.connectedAgents.map((agentId) => {
            const agent = agents.find((a) => a.id === agentId);
            if (!agent) return null;
            const AgentIcon = (LucideIcons[agent.icon as IconName] as unknown as LucideIcon) || LucideIcons.Circle;
            return (
              <div
                key={agentId}
                className="flex items-center gap-2 rounded-lg px-3 py-1.5"
                style={{
                  background: `${agent.color}10`,
                  border: `1px solid ${agent.color}25`,
                }}
              >
                <AgentIcon className="w-3.5 h-3.5" color={agent.color} />
                <span className="text-xs text-slate-300">{agent.name}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Technical Details */}
      <section>
        <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-cyan-400" />
          Technical Details
        </h3>
        <div className="space-y-2">
          <div
            className="flex items-center justify-between rounded-lg px-3 py-2.5"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <span className="text-xs text-slate-500">Auth Method</span>
            <span className="text-xs text-slate-300 font-medium">{integration.authMethod}</span>
          </div>
          <div
            className="flex items-center justify-between rounded-lg px-3 py-2.5"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div className="flex items-center gap-1.5">
              <ArrowRightLeft className="w-3 h-3 text-slate-500" />
              <span className="text-xs text-slate-500">Data Flow</span>
            </div>
            <span className="text-xs text-slate-300 font-medium">{integration.dataFlow}</span>
          </div>
        </div>
      </section>
    </>
  );
}

function HumanDetail({ touchpoint, onClose }: { touchpoint: HumanTouchpoint; onClose: () => void }) {
  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: `${touchpoint.color}15`,
              border: `2px dashed ${touchpoint.color}40`,
            }}
          >
            <User className="w-6 h-6" color={touchpoint.color} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">{touchpoint.label}</h2>
            <p className="text-xs text-slate-500">{touchpoint.description}</p>
          </div>
        </div>
        <CloseButton onClose={onClose} />
      </div>

      <AccentBar color={touchpoint.color} />

      {/* Purpose */}
      <section className="mb-6">
        <p className="text-sm text-slate-300 leading-relaxed">{touchpoint.purpose}</p>
      </section>

      {/* How it works */}
      <section className="mb-6">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          How it works
        </h3>
        <ul className="space-y-2">
          {touchpoint.details.map((detail, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="text-sm text-slate-300 pl-4 relative"
            >
              <span
                className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full"
                style={{ background: touchpoint.color }}
              />
              {detail}
            </motion.li>
          ))}
        </ul>
      </section>

      {/* What needs approval */}
      <section className="mb-6">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
          <ClipboardCheck className="w-4 h-4 text-amber-400" />
          What needs approval here
        </h3>
        <ul className="space-y-2">
          {touchpoint.approvalTypes.map((item, i) => (
            <li key={i} className="text-sm text-slate-400 pl-4 relative">
              <span className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-amber-500/60" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Connected Agents */}
      <section className="mb-6">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
          <Link className="w-4 h-4 text-blue-400" />
          Feeds from these agents
        </h3>
        <div className="flex flex-wrap gap-2">
          {touchpoint.connectedAgents.map((agentId) => {
            const agent = agents.find((a) => a.id === agentId);
            if (!agent) return null;
            const AgentIcon = (LucideIcons[agent.icon as IconName] as unknown as LucideIcon) || LucideIcons.Circle;
            return (
              <div
                key={agentId}
                className="flex items-center gap-2 rounded-lg px-3 py-1.5"
                style={{
                  background: `${agent.color}10`,
                  border: `1px solid ${agent.color}25`,
                }}
              >
                <AgentIcon className="w-3.5 h-3.5" color={agent.color} />
                <span className="text-xs text-slate-300">{agent.name}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why it matters */}
      <section>
        <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-yellow-400" />
          Why it matters
        </h3>
        <p
          className="text-sm text-slate-300 rounded-lg p-3 leading-relaxed"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          {touchpoint.whyItMatters}
        </p>
      </section>
    </>
  );
}

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
      aria-label="Close detail panel"
    >
      <X className="w-4 h-4 text-slate-400" />
    </button>
  );
}

function AccentBar({ color }: { color: string }) {
  return (
    <div
      className="h-0.5 rounded-full mb-6"
      style={{ background: `linear-gradient(to right, ${color}, transparent)` }}
    />
  );
}
