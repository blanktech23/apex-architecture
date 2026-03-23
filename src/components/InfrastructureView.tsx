'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Server,
  Shield,
  Layers,
  Database,
  Radio,
  Cpu,
  Cloud,
  Lock,
  Users,
  KeyRound,
  Eye,
  BarChart3,
  Globe,
  Container,
  Activity,
  FileText,
  CreditCard,
  Zap,
  ToggleRight,
  MonitorSmartphone,
  ChevronDown,
  ChevronUp,
  Search,
  Rocket,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { EvolvabilityView } from './EvolvabilityView';

// --- SECTION 1: Multi-Tenancy Visual ---

interface Tenant {
  name: string;
  tier: 'Starter' | 'Professional' | 'Enterprise';
  tierColor: string;
  agents: number;
  employees: number;
  roles: string[];
}

const tenants: Tenant[] = [
  {
    name: 'Slate Design & Remodel',
    tier: 'Professional',
    tierColor: '#6366f1',
    agents: 7,
    employees: 5,
    roles: ['CEO', 'Office Manager', 'Project Manager', 'Designer', 'Bookkeeper'],
  },
  {
    name: 'Summit Builders',
    tier: 'Starter',
    tierColor: '#22c55e',
    agents: 3,
    employees: 1,
    roles: ['Owner (solopreneur)'],
  },
  {
    name: 'Peak Renovations',
    tier: 'Professional',
    tierColor: '#6366f1',
    agents: 7,
    employees: 3,
    roles: ['CEO', 'Project Manager', 'Bookkeeper'],
  },
  {
    name: 'Premier Custom Homes',
    tier: 'Enterprise',
    tierColor: '#eab308',
    agents: 7,
    employees: 8,
    roles: ['CEO', 'Admin', '2 PMs', '2 Designers', 'Estimator', 'Bookkeeper'],
  },
  {
    name: 'GreenLeaf Landscaping',
    tier: 'Starter',
    tierColor: '#22c55e',
    agents: 3,
    employees: 2,
    roles: ['Owner', 'Office Manager'],
  },
];

// --- SECTION 2: Isolation Layers ---

interface IsolationLayer {
  name: string;
  icon: LucideIcon;
  color: string;
  what: string;
  how: string;
  technical: string;
}

const isolationLayers: IsolationLayer[] = [
  {
    name: 'Database Isolation',
    icon: Database,
    color: '#22c55e',
    what: 'Every database query is automatically filtered so Company A can never see Company B\'s data.',
    how: 'Supabase Row-Level Security (RLS) policies enforce tenant_id checks on every single table — tenants, agents, agent_executions, drafts, escalations, integrations, event_bus_log.',
    technical: 'RLS policy: tenant_id = auth.jwt() ->> \'tenant_id\' applied to all 9 core tables. The JWT token carries the tenant_id claim from Supabase Auth — queries physically cannot return rows from another tenant.',
  },
  {
    name: 'Event Bus Isolation',
    icon: Radio,
    color: '#3b82f6',
    what: 'Agent events (lead received, estimate complete, briefing ready) are routed only to the correct company\'s agents.',
    how: 'NATS JetStream subjects are namespaced per tenant. Slate\'s Discovery Concierge subscribes to TENANT_slate.agent.discovery-concierge.* — it physically cannot receive events from another company\'s namespace.',
    technical: 'Subject pattern: TENANT_{id}.agent.{agent_name}.{event_type} for agent events, TENANT_{id}.webhook.{service}.{event_type} for integration webhooks. NATS authorization rules prevent cross-tenant subscription.',
  },
  {
    name: 'AI Spending Isolation',
    icon: Cpu,
    color: '#a855f7',
    what: 'Each company has its own AI budget — a runaway agent at one company can\'t drain another company\'s allocation.',
    how: 'Per-tenant LiteLLM API key with spending caps + fallback routing. Daily usage synced to the billing dashboard in Supabase. Circuit breaker: any single agent execution exceeding $5 is killed immediately.',
    technical: 'LiteLLM per-key daily limit: hard cap at 2x expected spend → key disabled. Per-agent max_tokens: 4,096 standard, 8,192 complex. Loop detection: abort if same tool called 3x consecutively. Model cascade routes by complexity — not all requests use expensive models.',
  },
  {
    name: 'Secret Encryption',
    icon: Lock,
    color: '#f97316',
    what: 'Each company\'s integration credentials (JobTread API key, QuickBooks OAuth token, Google tokens) are encrypted and isolated.',
    how: 'AES-256-GCM encryption for all stored OAuth tokens and API keys in the integrations table. Keys are decrypted only at runtime on the VPS — never sent to the frontend, never logged, never stored in plaintext.',
    technical: 'Encryption: AES-256-GCM with per-tenant encryption keys derived from a master secret. QuickBooks refresh tokens expire after 100 days of non-use — the platform monitors and alerts customers to reconnect. Gmail OAuth tokens have no draft-only scope — app-layer enforcement prevents auto-send.',
  },
  {
    name: 'Role-Based Access',
    icon: Users,
    color: '#14b8a6',
    what: 'Within each company, employees only see agents and data relevant to their role. The CEO sees everything.',
    how: 'RBAC via the tenant_members table: owner, admin, manager, designer, bookkeeper, viewer. Each role defines which agents are accessible. Executive Navigator outputs are CEO-only. Employee actions are logged.',
    technical: 'Role hierarchy: Owner/CEO → full access + Executive Navigator. Admin → manage integrations + team. Manager/PM → Project Orchestrator + Estimate Engine + approve drafts. Designer → Design Spec Assistant only. Bookkeeper → Operations Controller only. Viewer → read-only dashboards.',
  },
  {
    name: 'Feature Gating',
    icon: ToggleRight,
    color: '#eab308',
    what: 'Different tiers unlock different features. Starter gets 3 agents, Professional gets 7 (6 operational + Support Agent), Enterprise gets 7 + custom agents.',
    how: 'Per-tenant feature flags stored in the tenants table. The agent_templates system defines which agents are enabled per tier. Customers can\'t access agents outside their tier — enforcement at both API and UI levels.',
    technical: 'Agent templates: Starter = Discovery Concierge + Estimate Engine + Project Orchestrator. Professional = all 7 agents. Enterprise = all 7 + custom agent development. Feature flags support gradual rollouts (10% → 50% → 100%) and per-tenant beta access.',
  },
];

// --- SECTION 3: Backend Stack ---

interface StackComponent {
  name: string;
  icon: LucideIcon;
  color: string;
  role: string;
  details: string;
  specs: string;
}

const backendStack: StackComponent[] = [
  {
    name: 'DigitalOcean VPS',
    icon: Server,
    color: '#6366f1',
    role: 'Agent Backend Server',
    details: 'The single shared server that runs all agent processes, handles webhook ingestion, and routes AI requests. Runs Docker Compose with Node.js, Redis, and NATS containers. All customers share this server.',
    specs: 'Starting: 8 vCPU / 16GB RAM ($96/mo). At 100 customers: dual-node ($250/mo). At 1,000: cluster ($1,500/mo). All tenant isolation is software-level — no per-customer VMs.',
  },
  {
    name: 'Docker Compose',
    icon: Container,
    color: '#2496ed',
    role: 'Service Orchestration',
    details: 'Packages the entire backend into a single deployable unit: Node.js app server, Redis cache + job queue, and NATS event bus. One docker-compose up deploys the full stack. Architecture is VPS-agnostic — same compose file works on DigitalOcean, Hetzner, or any Linux server.',
    specs: '3 containers: node (agent executor + API), redis (BullMQ + cache), nats (JetStream event bus). Health probes: /health/live (basic liveness — process up), /health/ready (full readiness — DB + Redis + NATS connected), /health/startup (startup probe for slow-starting containers). Auto-restart on failure. Volume mounts for persistent data.',
  },
  {
    name: 'LiteLLM',
    icon: Cpu,
    color: '#a855f7',
    role: 'AI Model Gateway',
    details: 'Self-hosted, zero markup, 100+ providers, fallback routing. Routes AI requests to the optimal model based on task complexity. Simple tasks (lead scoring) → GPT-4.1 Nano ($0.10/1M tokens). Medium tasks (email drafts) → Claude Haiku 4.5 ($1/1M). Complex tasks (estimates, financial analysis) → Claude Sonnet 4.5 ($3/1M). Frontier tasks (CEO briefings) → Claude Opus 4.6 ($15/1M).',
    specs: 'Per-tenant API keys with spending caps + fallback routing. Prompt caching: 90% discount on repeat system prompts (Claude) and 75% (OpenAI). At ~4,500 customers, switch to direct Anthropic/OpenAI volume discounts for 15-20% savings.',
  },
  {
    name: 'NATS JetStream',
    icon: Radio,
    color: '#27aae1',
    role: 'Event Bus (Hub-and-Spoke)',
    details: 'The nervous system of the platform. Every agent communication, webhook event, and status update flows through NATS. Hub-and-spoke topology — the core platform publishes events, agents subscribe to their relevant subjects. Durable message delivery ensures no events are lost.',
    specs: '1M+ messages/sec throughput. Subject namespacing: TENANT_{id}.agent.{name}.{event} for agents, TENANT_{id}.webhook.{service}.{event_type} for integrations. JetStream provides message persistence and replay for audit trails.',
  },
  {
    name: 'Redis',
    icon: Zap,
    color: '#dc382d',
    role: 'Cache + Job Queue Backing Store',
    details: 'Two roles: (1) L2 distributed cache — weather data, frequently accessed configs, and LiteLLM response caching. (2) BullMQ backing store — all scheduled jobs, cron timers, and retry queues live in Redis. Node.js LRU serves as L1 in-process cache for hot data.',
    specs: 'Starting: managed Redis (Upstash free tier). At 100 customers: dedicated Redis on VPS. Daily backups. BullMQ features: repeatable jobs (daily briefings), delayed jobs (follow-up reminders), retry with exponential backoff (3 attempts).',
  },
  {
    name: 'Supabase Pro',
    icon: Database,
    color: '#3ecf8e',
    role: 'PostgreSQL Database + Auth + Real-Time',
    details: 'The single source of truth. PostgreSQL with Row-Level Security on all 9 core tables. Supabase Auth handles login/signup with JWT tokens carrying tenant_id. Real-time subscriptions push agent status updates to dashboards via WebSocket.',
    specs: '$25/mo. Core tables: tenants, tenant_members, agent_templates, agents, agent_executions, event_bus_log, integrations, escalations, drafts. JSONB columns for flexible agent configs and outputs (no migrations needed for schema evolution). Migrations version-controlled.',
  },
  {
    name: 'RAG Infrastructure (Support Agent)',
    icon: Search,
    color: '#ec4899',
    role: 'Knowledge Base Retrieval',
    details: 'Powers the Support Agent\'s knowledge base with hybrid search. Articles are chunked (512 tokens, 50-token overlap) and embedded via text-embedding-3-small, stored in Supabase using the pgvector extension for vector similarity search. Retrieval combines vector cosine similarity with BM25 keyword scoring via Reciprocal Rank Fusion for high-recall, high-precision results.',
    specs: 'Tables: support_articles (source content), support_chunks (512-token chunks with pgvector embeddings), support_conversations (chat history with full threading). Embedding model: text-embedding-3-small ($0.02/1M tokens). Search: hybrid vector similarity + BM25 keyword via Reciprocal Rank Fusion. Confidence routing: >= 0.85 direct answer, 0.60-0.84 adds disclaimer, < 0.60 auto-escalates to human. RAGAS evaluation scores tracked in support_evaluations table.',
  },
  {
    name: 'Vercel',
    icon: Globe,
    color: '#fff',
    role: 'Frontend Hosting',
    details: 'Hosts the Next.js 15 dashboard (App Router) that customers use to interact with their agents. Handles auth flows (better-auth with Organization plugin), the approval queue UI, CEO portal, and agent status displays. Connects to the VPS backend via HTTPS (REST + WebSocket).',
    specs: 'Vercel Pro: $20/mo (scales to Team at $150/mo for 1,000+ customers). SSR for initial page load, client-side hydration for interactive elements. WebSocket connection to VPS for real-time agent status and briefing push notifications.',
  },
  {
    name: 'better-auth (Organization plugin)',
    icon: KeyRound,
    color: '#14b8a6',
    role: 'Authentication & Session Management',
    details: 'Built-in multi-tenant RBAC, team management, invitations — self-hosted, free. Customer signs up → creates a tenant → invites employees → assigns roles. JWT tokens carry tenant_id and role claims. OAuth adapters for customer tool connections (Google, QuickBooks, HubSpot). Session management with secure HTTP-only cookies.',
    specs: 'better-auth Organization plugin. JWT payload: { sub, tenant_id, role, email }. Role-based middleware on every API route. OAuth 2.0 redirect flows managed server-side for integration connections.',
  },
  {
    name: 'WebSocket + SSE (Real-Time)',
    icon: MonitorSmartphone,
    color: '#f97316',
    role: 'Live Dashboard Updates',
    details: 'Pushes real-time updates from agents to the customer dashboard. When an agent completes a task (estimate built, briefing ready, escalation created), a WebSocket event fires to the connected browser — no polling needed. SSE streams use a 15-second keepalive interval for Cloudflare compatibility (Cloudflare drops idle connections at 100s).',
    specs: 'Socket.io on Hono backend — NATS events → backend → Socket.io → client dashboards. No connection limits (vs Supabase Realtime\'s 500 cap). Events: agent.status.changed, draft.created, escalation.created, briefing.ready. Scoped by tenant_id — customers only receive their own events. SSE keepalive: 15s ping for long-lived streams behind Cloudflare proxy. SSE drain: 30s grace period for active streams on shutdown.',
  },
  {
    name: 'Prometheus + Grafana Cloud',
    icon: Activity,
    color: '#e6522c',
    role: 'Monitoring & Alerting',
    details: 'Tracks platform health: agent execution times, error rates, API latency, queue depths, and per-tenant resource usage. Grafana dashboards for the engineering team. Alerts fire on anomalies (agent execution spikes, queue backup, high error rate).',
    specs: 'Grafana Cloud free tier ($0/mo up to 100 customers). Prometheus scrapes Node.js metrics every 15 seconds. Key metrics: agent_execution_duration_seconds, litellm_tokens_used, nats_messages_published, bullmq_queue_depth, supabase_query_duration.',
  },
  {
    name: 'Pino → Grafana Alloy → Loki',
    icon: FileText,
    color: '#06b6d4',
    role: 'Structured Logging',
    details: 'All agent activity logged as structured JSON — searchable by tenant_id, agent_name, execution_id, or error type. Pino is the fastest Node.js JSON logger. Grafana Alloy (the successor to Promtail) ships logs to Grafana Loki for centralized search and alerting.',
    specs: 'Log format: { timestamp, tenant_id, agent_name, execution_id, level, message, duration_ms, tokens_used, model, cost_usd }. Log shipping: Grafana Alloy sidecar collects Pino JSON output and pushes to Loki. Retention: 30 days hot, 1 year cold storage. Log-based alerts: error rate > 5%, execution time > 60s, cost > $5/execution.',
  },
  {
    name: 'Stripe',
    icon: CreditCard,
    color: '#635bff',
    role: 'Billing & Metering',
    details: 'Handles SaaS billing: one-time setup fees ($5K-$20K), monthly recurring ($275-$750/mo), and usage-based overages (Enterprise tier). Customer portal for invoice history, payment method management, and plan upgrades.',
    specs: 'Stripe Checkout for onboarding. Stripe Billing for recurring subscriptions. Usage records synced daily from LiteLLM spend tracking in Supabase. Webhook events for payment success/failure → NATS → Operations Controller (for customer accounts that use it).',
  },
  {
    name: 'Deployment Safety',
    icon: Rocket,
    color: '#10b981',
    role: 'Zero-Downtime Deploys & Rollback',
    details: 'Every deployment follows a strict safety protocol. BullMQ workers shut down gracefully before the HTTP server (worker.close() before server.close() in SIGTERM handler). Outgoing images are tagged as \'previous\' before the new image is pulled, enabling sub-90s rollbacks. Code canary: 10% of load balancer traffic routes to a secondary container for 15-minute observation before full cutover.',
    specs: 'SIGTERM sequence: (1) stop accepting new BullMQ jobs, (2) drain active jobs (30s timeout), (3) drain active SSE streams (30s grace period), (4) close HTTP server, (5) exit. Rollback pre-pull: outgoing image tagged as \'previous\' before docker pull, enabling instant rollback with 90s SLA. Code canary: 10% LB traffic to secondary container, 15-min observation window — auto-rollback on error rate spike > 2x baseline.',
  },
];

// --- COMPONENT ---

export function InfrastructureView() {
  const [expandedIsolation, setExpandedIsolation] = useState<number | null>(null);
  const [expandedStack, setExpandedStack] = useState<number | null>(null);

  return (
    <div className="absolute inset-0 overflow-auto">
      <div className="min-h-full p-4 sm:p-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight mb-2">
              Platform Infrastructure & Evolvability
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
              How the platform runs multiple companies on shared infrastructure with complete isolation —
              and how it scales to new industries without rebuilding.
            </p>
          </div>

          {/* ============================================ */}
          {/* SECTION 1: Multi-Tenancy Visual */}
          {/* ============================================ */}
          <div className="mb-10">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-indigo-400" />
              Multi-Tenant Architecture
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Every company gets their own isolated workspace — their own agents, their own employees with role-based access,
              their own integration credentials. But they all run on the same shared infrastructure, which is why the platform
              costs stay low as you add customers.
            </p>

            {/* Shared infra bar */}
            <div
              className="rounded-xl p-3 sm:p-4 mb-3"
              style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
              }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Server className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider">
                  Shared Platform Infrastructure
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {['DigitalOcean VPS', 'NATS JetStream', 'Redis + BullMQ', 'Supabase (PostgreSQL + RLS)', 'LiteLLM', 'Vercel'].map((svc) => (
                  <span
                    key={svc}
                    className="text-[10px] px-2 py-0.5 rounded-full text-slate-300"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    {svc}
                  </span>
                ))}
              </div>
            </div>

            {/* Tenant cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {tenants.map((tenant, i) => (
                <motion.div
                  key={tenant.name}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                  className="rounded-xl p-3 sm:p-4"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${tenant.tierColor}25`,
                  }}
                >
                  {/* Company name + tier badge */}
                  <div className="flex items-start justify-between mb-2.5">
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-white truncate">{tenant.name}</h4>
                    </div>
                    <span
                      className="text-[9px] font-medium px-1.5 py-0.5 rounded-full shrink-0 ml-2"
                      style={{
                        background: `${tenant.tierColor}15`,
                        color: tenant.tierColor,
                        border: `1px solid ${tenant.tierColor}30`,
                      }}
                    >
                      {tenant.tier}
                    </span>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center gap-3 mb-2.5">
                    <div className="flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-slate-500" />
                      <span className="text-[10px] text-slate-400">{tenant.agents} agents</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-500" />
                      <span className="text-[10px] text-slate-400">{tenant.employees} {tenant.employees === 1 ? 'user' : 'users'}</span>
                    </div>
                  </div>

                  {/* Roles */}
                  <div className="flex flex-wrap gap-1">
                    {tenant.roles.map((role) => (
                      <span
                        key={role}
                        className="text-[9px] px-1.5 py-0.5 rounded text-slate-400"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                      >
                        {role}
                      </span>
                    ))}
                  </div>

                  {/* Isolation indicators */}
                  <div className="mt-2.5 pt-2 border-t border-white/5">
                    <div className="flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5 text-emerald-500" />
                      <span className="text-[9px] text-emerald-400/80">Isolated data, events, AI budget, credentials</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Cost note */}
            <div className="mt-3 text-center">
              <p className="text-[10px] text-slate-600">
                Adding customer #6 costs ~$13/mo in AI + ~$1.50/mo infrastructure — no new servers needed
              </p>
            </div>
          </div>

          {/* ============================================ */}
          {/* SECTION 2: Isolation Layers */}
          {/* ============================================ */}
          <div className="mb-10">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-emerald-400" />
              7 Layers of Tenant Isolation
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Shared infrastructure doesn&apos;t mean shared data. Seven independent mechanisms ensure
              no company can ever access another company&apos;s data, events, AI budget, or credentials.
            </p>

            <div className="space-y-2">
              {isolationLayers.map((layer, i) => {
                const isExpanded = expandedIsolation === i;
                return (
                  <motion.div
                    key={layer.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    <button
                      onClick={() => setExpandedIsolation(isExpanded ? null : i)}
                      className="w-full text-left rounded-xl p-3 sm:p-4 transition-all"
                      style={{
                        background: isExpanded ? `${layer.color}08` : 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${isExpanded ? `${layer.color}30` : 'rgba(255, 255, 255, 0.06)'}`,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <layer.icon className="w-4 h-4 shrink-0" style={{ color: layer.color }} />
                          <div>
                            <span className="text-xs font-semibold text-white">{layer.name}</span>
                            <p className="text-[11px] text-slate-400 mt-0.5">{layer.what}</p>
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
                        )}
                      </div>
                    </button>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-2 space-y-3">
                            <div>
                              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">How it works</p>
                              <p className="text-xs text-slate-300 leading-relaxed">{layer.how}</p>
                            </div>
                            <div
                              className="rounded-lg p-3"
                              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
                            >
                              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">Technical detail</p>
                              <p className="text-[11px] text-slate-400 leading-relaxed font-mono">{layer.technical}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* ============================================ */}
          {/* SECTION 3: Complete Backend Stack */}
          {/* ============================================ */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
              <Cloud className="w-4 h-4 text-cyan-400" />
              Complete Backend Stack
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Every piece of technology that powers the platform — from the server that runs agent code
              to the billing system that charges customers.
            </p>

            <div className="space-y-2">
              {backendStack.map((component, i) => {
                const isExpanded = expandedStack === i;
                return (
                  <motion.div
                    key={component.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.03 * i }}
                  >
                    <button
                      onClick={() => setExpandedStack(isExpanded ? null : i)}
                      className="w-full text-left rounded-xl p-3 sm:p-4 transition-all"
                      style={{
                        background: isExpanded ? `${component.color}08` : 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${isExpanded ? `${component.color}30` : 'rgba(255, 255, 255, 0.06)'}`,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <component.icon className="w-4 h-4 shrink-0" style={{ color: component.color }} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-white">{component.name}</span>
                              <span className="text-[9px] text-slate-500 hidden sm:inline">— {component.role}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 sm:hidden">{component.role}</p>
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
                        )}
                      </div>
                    </button>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-2 space-y-3">
                            <div>
                              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">What it does</p>
                              <p className="text-xs text-slate-300 leading-relaxed">{component.details}</p>
                            </div>
                            <div
                              className="rounded-lg p-3"
                              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
                            >
                              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">Specifications</p>
                              <p className="text-[11px] text-slate-400 leading-relaxed">{component.specs}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Divider between Infrastructure and Evolvability */}
          <div className="my-10 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span className="text-[10px] font-medium text-slate-600 uppercase tracking-widest">Built to Evolve</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* Evolvability content (inline) */}
          <EvolvabilityView inline />
        </motion.div>
      </div>
    </div>
  );
}
