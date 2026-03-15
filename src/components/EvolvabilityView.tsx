'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Puzzle,
  Plug,
  LayoutTemplate,
  ArrowLeftRight,
  Database,
  ToggleRight,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Layers,
  Bot,
  Cable,
  Lock,
  Play,
  AlertTriangle,
  KeyRound,
  Link2,
  BookOpen,
  Eye,
  Rocket,
  Shield,
  Flag,
  GitBranch,
  Bell,
  Search,
  Check,
  X,
  Plus,
} from 'lucide-react';

// --- SECTION 1: Plugin Architecture ---

interface PluginField {
  name: string;
  description: string;
  color: string;
  icon: React.ElementType;
}

const agentPluginFields: PluginField[] = [
  { name: 'id', description: 'Unique identifier (e.g. "discovery-concierge")', color: '#6366f1', icon: Puzzle },
  { name: 'name', description: 'Human-readable display name', color: '#6366f1', icon: BookOpen },
  { name: 'version', description: 'Semver version for template compatibility', color: '#6366f1', icon: GitBranch },
  { name: 'triggers', description: 'Events that activate this agent (e.g. "lead.received", "cron:daily")', color: '#22c55e', icon: Play },
  { name: 'integrations', description: 'Services this agent needs (e.g. "jobtread", "google-drive")', color: '#3b82f6', icon: Link2 },
  { name: 'permissions', description: 'Data access scope — what it can read and write', color: '#f97316', icon: Lock },
  { name: 'execute()', description: 'Core logic — receives event context, returns agent output', color: '#a855f7', icon: Rocket },
  { name: 'escalate()', description: 'Exception handler — routes failures to the approval queue', color: '#ef4444', icon: AlertTriangle },
];

const integrationAdapterFields: PluginField[] = [
  { name: 'id', description: 'Unique identifier (e.g. "jobtread", "quickbooks")', color: '#14b8a6', icon: Cable },
  { name: 'authMethod', description: 'Authentication type: api_key or oauth2', color: '#14b8a6', icon: KeyRound },
  { name: 'connect / disconnect', description: 'Tenant-level setup and teardown of credentials', color: '#22c55e', icon: Link2 },
  { name: 'read()', description: 'Fetch data from the external service (contacts, jobs, invoices)', color: '#3b82f6', icon: Search },
  { name: 'write()', description: 'Optional — send data back (create job, send email, post invoice)', color: '#f97316', icon: Play },
];

// --- SECTION 2: Industry Templates ---

interface AgentEntry {
  name: string;
  status: 'reused' | 'new' | 'reconfigured';
}

interface IntegrationEntry {
  name: string;
  status: 'same' | 'swapped' | 'new';
}

interface IndustryTemplate {
  name: string;
  color: string;
  agents: AgentEntry[];
  integrations: IntegrationEntry[];
  note: string;
}

const currentTemplate = {
  name: 'Construction Remodeling',
  agents: [
    'Discovery Concierge',
    'Estimate Engine',
    'Design Spec Assistant',
    'Project Orchestrator',
    'Operations Controller',
    'Executive Navigator',
    'Support Agent',
  ],
};

const futureTemplates: IndustryTemplate[] = [
  {
    name: 'HVAC Service',
    color: '#3b82f6',
    agents: [
      { name: 'Discovery Concierge', status: 'reused' },
      { name: 'Estimate Engine', status: 'reused' },
      { name: 'Equipment Spec Tracker', status: 'new' },
      { name: 'Service Route Optimizer', status: 'new' },
      { name: 'Operations Controller', status: 'reused' },
      { name: 'Executive Navigator', status: 'reused' },
      { name: 'Support Agent', status: 'reused' },
    ],
    integrations: [
      { name: 'ServiceTitan', status: 'swapped' },
      { name: 'QuickBooks', status: 'same' },
      { name: 'Google Drive', status: 'same' },
      { name: 'Gmail', status: 'same' },
    ],
    note: 'Equipment Spec Tracker replaces Design Spec, Service Route Optimizer replaces Project Orchestrator. Swap JobTread for ServiceTitan. 4 of 7 agents reused as-is.',
  },
  {
    name: 'Design-Build',
    color: '#a855f7',
    agents: [
      { name: 'Discovery Concierge', status: 'reconfigured' },
      { name: 'Estimate Engine', status: 'reconfigured' },
      { name: 'Design Spec Assistant', status: 'reconfigured' },
      { name: 'Project Orchestrator', status: 'reconfigured' },
      { name: 'Operations Controller', status: 'reconfigured' },
      { name: 'Executive Navigator', status: 'reconfigured' },
      { name: 'Support Agent', status: 'reused' },
    ],
    integrations: [
      { name: 'JobTread', status: 'same' },
      { name: 'QuickBooks', status: 'same' },
      { name: 'Google Drive', status: 'same' },
      { name: 'Gmail', status: 'same' },
    ],
    note: 'Same 7 agents, different prompts. Different qualification criteria, estimate categories, and Drive folder hierarchy.',
  },
  {
    name: 'Landscaping',
    color: '#22c55e',
    agents: [
      { name: 'Discovery Concierge', status: 'reused' },
      { name: 'Estimate Engine', status: 'reused' },
      { name: 'Seasonal Planning', status: 'new' },
      { name: 'Project Orchestrator', status: 'reused' },
      { name: 'Executive Navigator', status: 'reused' },
      { name: 'Support Agent', status: 'reused' },
    ],
    integrations: [
      { name: 'LMN', status: 'swapped' },
      { name: 'QuickBooks', status: 'same' },
      { name: 'Google Drive', status: 'same' },
      { name: 'Gmail', status: 'same' },
    ],
    note: 'Reuse 4 agents, add Seasonal Planning, drop Design Spec + Operations Controller. Swap JobTread for LMN.',
  },
  {
    name: 'General Contracting',
    color: '#eab308',
    agents: [
      { name: 'Discovery Concierge', status: 'reused' },
      { name: 'Estimate Engine', status: 'reused' },
      { name: 'Design Spec Assistant', status: 'reused' },
      { name: 'Project Orchestrator', status: 'reused' },
      { name: 'Operations Controller', status: 'reused' },
      { name: 'Executive Navigator', status: 'reused' },
      { name: 'Support Agent', status: 'reused' },
      { name: 'Permit Tracker', status: 'new' },
    ],
    integrations: [
      { name: 'JobTread', status: 'same' },
      { name: 'QuickBooks', status: 'same' },
      { name: 'Google Drive', status: 'same' },
      { name: 'Gmail', status: 'same' },
      { name: 'Procore', status: 'new' },
    ],
    note: 'All 7 agents reused plus new Permit Tracker. Add Procore integration for project management.',
  },
];

// --- SECTION 3: What Changes vs What Stays ---

const staysSame = [
  { label: 'VPS + Docker', icon: Layers },
  { label: 'NATS event bus', icon: Cable },
  { label: 'Redis + BullMQ', icon: Database },
  { label: 'Supabase + RLS', icon: Shield },
  { label: 'LiteLLM', icon: Bot },
  { label: 'Vercel dashboard', icon: LayoutTemplate },
  { label: 'Billing (Stripe)', icon: Plug },
  { label: 'Auth (better-auth)', icon: KeyRound },
  { label: 'Approval Queue', icon: Check },
  { label: 'Multi-tenancy isolation', icon: Lock },
];

const whatYouCreate = [
  { label: 'New template config', detail: '1 database row' },
  { label: 'Agent prompt configs', detail: 'JSONB — no migrations' },
  { label: 'New agents if needed', detail: '1 file each' },
  { label: 'New integrations if needed', detail: '1 file each' },
  { label: 'Folder hierarchy templates', detail: 'Drive structure definition' },
  { label: 'Qualification criteria', detail: 'Lead scoring rules' },
];

// --- COMPONENT ---

function StatusBadge({ status }: { status: 'reused' | 'new' | 'reconfigured' | 'same' | 'swapped' }) {
  const config = {
    reused: { bg: 'rgba(34, 197, 94, 0.12)', color: '#22c55e', border: 'rgba(34, 197, 94, 0.25)' },
    reconfigured: { bg: 'rgba(168, 85, 247, 0.12)', color: '#a855f7', border: 'rgba(168, 85, 247, 0.25)' },
    new: { bg: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6', border: 'rgba(59, 130, 246, 0.25)' },
    same: { bg: 'rgba(34, 197, 94, 0.12)', color: '#22c55e', border: 'rgba(34, 197, 94, 0.25)' },
    swapped: { bg: 'rgba(249, 115, 22, 0.12)', color: '#f97316', border: 'rgba(249, 115, 22, 0.25)' },
  }[status];

  return (
    <span
      className="text-[8px] sm:text-[9px] font-medium px-1.5 py-0.5 rounded-full uppercase tracking-wider"
      style={{ background: config.bg, color: config.color, border: `1px solid ${config.border}` }}
    >
      {status}
    </span>
  );
}

export function EvolvabilityView({ inline }: { inline?: boolean }) {
  const [expandedSchema, setExpandedSchema] = useState(false);
  const [expandedRollouts, setExpandedRollouts] = useState(false);

  const content = (
    <>
      {!inline && (
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight mb-2">
            Built to Evolve
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
            New agents, new integrations, new industries — without changing core infrastructure.
            The platform is designed so that expansion is configuration, not engineering.
          </p>
        </div>
      )}

          {/* ============================================ */}
          {/* SECTION 1: Plugin Architecture */}
          {/* ============================================ */}
          <div className="mb-10">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
              <Puzzle className="w-4 h-4 text-indigo-400" />
              Plugin-Based Architecture
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Every agent implements a standard AgentPlugin interface. Every external service implements
              an IntegrationAdapter interface. The core platform doesn&apos;t know what any agent does or
              what any integration connects to — it just runs whatever plugins are registered.
            </p>

            {/* AgentPlugin card */}
            <div className="mb-4">
              <div
                className="rounded-xl p-4 sm:p-5"
                style={{
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, rgba(139, 92, 246, 0.04) 100%)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                    AgentPlugin Interface
                  </span>
                </div>
                <div className="space-y-1.5">
                  {agentPluginFields.map((field, i) => (
                    <motion.div
                      key={field.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.03 * i }}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2"
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                      }}
                    >
                      <field.icon className="w-3.5 h-3.5 shrink-0" style={{ color: field.color }} />
                      <div className="min-w-0">
                        <span className="text-[11px] font-mono font-semibold text-white">{field.name}</span>
                        <p className="text-[10px] text-slate-500">{field.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* IntegrationAdapter card */}
            <div className="mb-5">
              <div
                className="rounded-xl p-4 sm:p-5"
                style={{
                  background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.06) 0%, rgba(6, 182, 212, 0.04) 100%)',
                  border: '1px solid rgba(20, 184, 166, 0.2)',
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Plug className="w-4 h-4 text-teal-400" />
                  <span className="text-xs font-semibold text-teal-300 uppercase tracking-wider">
                    IntegrationAdapter Interface
                  </span>
                </div>
                <div className="space-y-1.5">
                  {integrationAdapterFields.map((field, i) => (
                    <motion.div
                      key={field.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.03 * i }}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2"
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                      }}
                    >
                      <field.icon className="w-3.5 h-3.5 shrink-0" style={{ color: field.color }} />
                      <div className="min-w-0">
                        <span className="text-[11px] font-mono font-semibold text-white">{field.name}</span>
                        <p className="text-[10px] text-slate-500">{field.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Key message */}
            <div
              className="rounded-xl p-3 sm:p-4 text-center"
              style={{
                background: 'rgba(99, 102, 241, 0.06)',
                border: '1px solid rgba(99, 102, 241, 0.15)',
              }}
            >
              <p className="text-xs text-slate-300">
                <span className="text-white font-semibold">Adding a new agent = 1 file.</span>{' '}
                <span className="text-white font-semibold">Adding a new integration = 1 file.</span>{' '}
                No changes to the core platform.
              </p>
            </div>
          </div>

          {/* ============================================ */}
          {/* SECTION 2: Industry Templates */}
          {/* ============================================ */}
          <div className="mb-10">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
              <LayoutTemplate className="w-4 h-4 text-amber-400" />
              Industry Templates
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              A template defines which agents are enabled, which integrations are required, trigger
              conditions, escalation rules, and role definitions — all per industry. Switching industries
              means loading a different template, not rewriting code.
            </p>

            {/* Current template */}
            <div className="mb-4">
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-2">Current Template</p>
              <div
                className="rounded-xl p-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.06) 0%, rgba(16, 185, 129, 0.04) 100%)',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-emerald-300">{currentTemplate.name}</span>
                  <span
                    className="text-[8px] font-medium px-1.5 py-0.5 rounded-full uppercase tracking-wider"
                    style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.3)' }}
                  >
                    Active
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {currentTemplate.agents.map((agent) => (
                    <span
                      key={agent}
                      className="text-[10px] px-2 py-1 rounded-lg text-slate-300"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      {agent}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Future templates */}
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-2">Example Future Templates</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              {futureTemplates.map((template, i) => (
                <motion.div
                  key={template.name}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i }}
                  className="rounded-xl p-3 sm:p-4"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${template.color}25`,
                  }}
                >
                  <h4 className="text-xs font-semibold text-white mb-2.5">{template.name}</h4>

                  {/* Agents */}
                  <p className="text-[9px] font-medium text-slate-500 uppercase tracking-wider mb-1.5">Agents</p>
                  <div className="space-y-1 mb-3">
                    {template.agents.map((agent) => (
                      <div key={agent.name} className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">{agent.name}</span>
                        <StatusBadge status={agent.status} />
                      </div>
                    ))}
                  </div>

                  {/* Integrations */}
                  <p className="text-[9px] font-medium text-slate-500 uppercase tracking-wider mb-1.5">Integrations</p>
                  <div className="space-y-1 mb-3">
                    {template.integrations.map((integration) => (
                      <div key={integration.name} className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">{integration.name}</span>
                        <StatusBadge status={integration.status} />
                      </div>
                    ))}
                  </div>

                  {/* Note */}
                  <div className="pt-2 border-t border-white/5">
                    <p className="text-[10px] text-slate-500 leading-relaxed">{template.note}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Key message */}
            <div
              className="rounded-xl p-3 sm:p-4 text-center"
              style={{
                background: 'rgba(234, 179, 8, 0.06)',
                border: '1px solid rgba(234, 179, 8, 0.15)',
              }}
            >
              <p className="text-xs text-slate-300">
                <span className="text-white font-semibold">The platform doesn&apos;t know what industry it&apos;s serving.</span>{' '}
                It runs whatever agents the template tells it to run.
              </p>
            </div>
          </div>

          {/* ============================================ */}
          {/* SECTION 3: What Changes vs What Stays */}
          {/* ============================================ */}
          <div className="mb-10">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
              <ArrowLeftRight className="w-4 h-4 text-cyan-400" />
              Adding a New Vertical
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              When you expand to a new industry, most of the platform is already built. Here&apos;s the split
              between what you reuse and what you create.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* LEFT: Stays the Same */}
              <div
                className="rounded-xl p-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.04) 0%, rgba(16, 185, 129, 0.02) 100%)',
                  border: '1px solid rgba(34, 197, 94, 0.15)',
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-300">Stays the Same</span>
                  <span
                    className="text-[8px] font-medium px-1.5 py-0.5 rounded-full"
                    style={{ background: 'rgba(34, 197, 94, 0.12)', color: '#22c55e' }}
                  >
                    reused 100%
                  </span>
                </div>
                <div className="space-y-1.5">
                  {staysSame.map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.03 * i }}
                      className="flex items-center gap-2 rounded-lg px-3 py-1.5"
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                      }}
                    >
                      <item.icon className="w-3 h-3 text-emerald-500/70 shrink-0" />
                      <span className="text-[10px] sm:text-[11px] text-slate-300">{item.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* RIGHT: What You Create */}
              <div
                className="rounded-xl p-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.04) 0%, rgba(99, 102, 241, 0.02) 100%)',
                  border: '1px solid rgba(59, 130, 246, 0.15)',
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Plus className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-semibold text-blue-300">What You Create</span>
                </div>
                <div className="space-y-1.5">
                  {whatYouCreate.map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.03 * i }}
                      className="flex items-center justify-between rounded-lg px-3 py-1.5"
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                      }}
                    >
                      <span className="text-[10px] sm:text-[11px] text-slate-300">{item.label}</span>
                      <span className="text-[9px] text-slate-500">{item.detail}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ============================================ */}
          {/* SECTION 4: Schema Flexibility (Accordion) */}
          {/* ============================================ */}
          <div className="mb-3">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <button
                onClick={() => setExpandedSchema(!expandedSchema)}
                className="w-full text-left rounded-xl p-3 sm:p-4 transition-all"
                style={{
                  background: expandedSchema ? 'rgba(168, 85, 247, 0.05)' : 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${expandedSchema ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.06)'}`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Database className="w-4 h-4 text-purple-400" />
                    <div>
                      <span className="text-xs font-semibold text-white">Zero-Migration Data Model</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">JSONB columns that flex to any agent type without schema changes</p>
                    </div>
                  </div>
                  {expandedSchema ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
                  )}
                </div>
              </button>
              <AnimatePresence>
                {expandedSchema && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-3 space-y-3">
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Two JSONB columns — <span className="font-mono text-white">agent_config</span> and{' '}
                        <span className="font-mono text-white">agent_output</span> — store arbitrary data per agent type.
                        The database schema never changes when you add a new agent or industry.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {[
                          { agent: 'Estimate Engine', stores: 'Bid comparisons, line items, vendor pricing, margin calculations', color: '#22c55e' },
                          { agent: 'Design Spec Assistant', stores: 'Material selections, finish schedules, product links, room assignments', color: '#6366f1' },
                          { agent: 'HVAC Equipment Tracker', stores: 'Unit specs, tonnage, SEER ratings, warranty terms, install requirements', color: '#3b82f6' },
                        ].map((example) => (
                          <div
                            key={example.agent}
                            className="rounded-lg p-3"
                            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
                          >
                            <p className="text-[10px] font-semibold mb-1" style={{ color: example.color }}>{example.agent}</p>
                            <p className="text-[10px] text-slate-500 leading-relaxed">{example.stores}</p>
                          </div>
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Different shapes, same column, no schema changes. Add a new agent type and its data
                        structure is defined in its plugin — not in the database.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* ============================================ */}
          {/* SECTION 5: Safe Rollouts (Accordion) */}
          {/* ============================================ */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 }}
            >
              <button
                onClick={() => setExpandedRollouts(!expandedRollouts)}
                className="w-full text-left rounded-xl p-3 sm:p-4 transition-all"
                style={{
                  background: expandedRollouts ? 'rgba(234, 179, 8, 0.05)' : 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${expandedRollouts ? 'rgba(234, 179, 8, 0.2)' : 'rgba(255, 255, 255, 0.06)'}`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Flag className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="text-xs font-semibold text-white">Feature Flags & Versioning</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">Safe rollouts, kill switches, and customer-paced upgrades</p>
                    </div>
                  </div>
                  {expandedRollouts ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
                  )}
                </div>
              </button>
              <AnimatePresence>
                {expandedRollouts && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-3 space-y-2.5">
                      {[
                        {
                          title: 'Per-Tenant Feature Flags',
                          description: 'Enable beta agents for specific customers without affecting anyone else. Test new capabilities with trusted early adopters before general availability.',
                          icon: ToggleRight,
                          color: '#22c55e',
                        },
                        {
                          title: 'Gradual Rollouts',
                          description: 'Roll out new agents or features incrementally: 10% of customers, then 50%, then 100%. Monitor error rates and performance at each stage before expanding.',
                          icon: RefreshCw,
                          color: '#3b82f6',
                        },
                        {
                          title: 'Kill Switch',
                          description: 'Disable any agent instantly without a deployment. If a new agent misbehaves in production, flip one flag and it stops executing across all tenants immediately.',
                          icon: X,
                          color: '#ef4444',
                        },
                        {
                          title: 'Template Versioning',
                          description: 'Templates are versioned: v1, v2, v3. Customers upgrade on their own schedule. No forced migrations — multiple template versions run simultaneously.',
                          icon: GitBranch,
                          color: '#a855f7',
                        },
                        {
                          title: 'Upgrade Path',
                          description: 'Structured upgrade flow: notify customer of new version, let them preview changes, confirm upgrade, then migrate. Rollback available for 30 days.',
                          icon: Bell,
                          color: '#f97316',
                        },
                      ].map((item, i) => (
                        <div
                          key={item.title}
                          className="flex items-start gap-2.5 rounded-lg px-3 py-2.5"
                          style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                          }}
                        >
                          <item.icon className="w-4 h-4 shrink-0 mt-0.5" style={{ color: item.color }} />
                          <div>
                            <p className="text-[11px] font-semibold text-white">{item.title}</p>
                            <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Summary callout */}
          <div
            className="rounded-xl p-4 sm:p-5 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, rgba(234, 179, 8, 0.06) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.15)',
            }}
          >
            <Eye className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
            <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
              <span className="text-white font-semibold">One platform, unlimited verticals.</span>{' '}
              Plugin interfaces standardize how agents and integrations connect. Templates define what runs
              per industry. JSONB columns eliminate schema migrations. Feature flags make rollouts safe.
              The result: expanding to a new industry is days of configuration, not months of engineering.
            </p>
          </div>
    </>
  );

  if (inline) {
    return content;
  }

  return (
    <div className="absolute inset-0 overflow-auto">
      <div className="min-h-full p-4 sm:p-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl mx-auto"
        >
          {content}
        </motion.div>
      </div>
    </div>
  );
}
