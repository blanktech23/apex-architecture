export const integrations = [
  {
    id: 'jobtread',
    name: 'JobTread',
    icon: 'Hammer',
    description: 'Project management & scheduling',
    color: '#6366f1',
    details: [
      'Central system of record for all project data',
      'Schedule tracking with milestone dependencies',
      'Budget line items with real-time cost tracking',
      'Subcontractor assignment and coordination'
    ],
    useCases: [
      'When a new project is signed, JobTread creates the master schedule that all agents reference',
      'The Project Management Agent checks JobTread daily for schedule drift and budget overruns',
      'The Sales Agent pulls historical cost data from completed JobTread projects to improve future estimates'
    ],
    connectedAgents: ['design-agent', 'project-management-agent', 'sales-agent', 'ceo-agent'],
    authMethod: 'API Key',
    dataFlow: 'Read + Write (with human approval)',
    infrastructure: {
      connection: 'JobTread REST API calls routed through the shared DigitalOcean VPS. The server implements an IntegrationAdapter interface — a standardized wrapper that handles auth, retries, and rate limiting. Rate limits are undocumented by JobTread, so the adapter uses conservative backoff.',
      credentials: 'Each customer\'s JobTread API key encrypted with AES-256-GCM and stored in the integrations table in Supabase. Keys are decrypted only at runtime on the VPS — never sent to the frontend or logged. Key rotation handled by the customer through the dashboard.',
      webhooks: 'JobTread webhooks POST to the VPS at /webhooks/jobtread/:tenantId. The server validates the request, stores the raw payload in event_bus_log (full audit trail), then publishes to NATS JetStream at TENANT_{id}.webhook.jobtread.{event_type}. Connected agents subscribe to their relevant event types.',
      hosting: 'Single multi-tenant VPS handles all customers\' JobTread connections. No per-customer servers or API proxies. Tenant isolation via NATS subject namespacing and Supabase RLS. JobTread offers only a trial free tier with limited support — they won\'t debug integration code.',
    },
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    icon: 'Receipt',
    description: 'Accounting & financial data',
    color: '#2ca01c',
    details: [
      'Financial system of record — agents read, never write directly',
      'Invoice generation and accounts receivable tracking',
      'Expense categorization and P&L reporting',
      'Cash flow monitoring and projections'
    ],
    useCases: [
      'The Bookkeeping Agent monitors AR aging and drafts collection notices when invoices are overdue',
      'The CEO Agent pulls financial summaries for the CEO morning briefing',
      'The Sales Agent references historical costs to build more accurate estimates'
    ],
    connectedAgents: ['project-management-agent', 'sales-agent', 'bookkeeping-agent', 'ceo-agent'],
    authMethod: 'OAuth 2.0',
    dataFlow: 'Read-only (enforced at app layer)',
    infrastructure: {
      connection: 'QuickBooks Online REST + GraphQL API accessed via OAuth 2.0 from the shared VPS. The IntegrationAdapter wraps QB in a read-only interface — the QB API technically allows writes, but all write methods are blocked at the app layer per the architecture spec. Rate limit: 100 requests per 10 seconds per tenant.',
      credentials: 'OAuth 2.0 flow: customer authorizes → access_token (1 hour TTL) + refresh_token (100 days of non-use expiry). Both encrypted with AES-256-GCM in the integrations table. The VPS auto-refreshes access tokens before expiry. Critical: if a customer doesn\'t use the system for 100 days, their refresh token dies — the platform alerts them to reconnect.',
      webhooks: 'QB webhooks POST to /webhooks/quickbooks/:tenantId on the VPS. Signature validated, raw event stored in event_bus_log, then published to NATS at TENANT_{id}.webhook.quickbooks.{event_type} (invoice, payment, expense). The Bookkeeping Agent and CEO Agent subscribe to these events.',
      hosting: 'Single multi-tenant VPS — all customers share one server. QB read-only enforcement is an application-layer decision (not a QuickBooks permission setting). QB sandbox available for testing. At scale, QB is the most rate-limited integration (100 req/10s) — the adapter queues excess requests with BullMQ.',
    },
  },
  {
    id: 'calendar',
    name: 'Google Calendar',
    icon: 'Calendar',
    description: 'Scheduling & availability',
    color: '#4285f4',
    details: [
      'Consultation scheduling with availability checking',
      'Uses freebusy scope for privacy — no event titles visible',
      'Automated prep questionnaire sent after booking',
      'Conflict detection across team members'
    ],
    useCases: [
      'When a lead is qualified, the Leads Agent checks calendar availability and proposes consultation times',
      'The system avoids double-booking by checking freebusy data before suggesting slots',
      'After booking, a prep questionnaire is automatically sent to the prospect'
    ],
    connectedAgents: ['leads-agent'],
    authMethod: 'OAuth 2.0',
    dataFlow: 'Read (freebusy) + Write (create events)',
    infrastructure: {
      connection: 'Google Calendar REST API via OAuth 2.0 from the shared VPS. Two scopes used: calendar.freebusy (read availability without seeing event titles — privacy by design) and calendar.events (create consultation events). Generous rate limits from Google. The freebusy scope is a deliberate privacy choice — agents never see what\'s on the customer\'s calendar, only when they\'re free.',
      credentials: 'Per-customer Google OAuth tokens encrypted with AES-256-GCM in the integrations table. Access tokens auto-refreshed by the VPS before expiry. Google refresh tokens don\'t expire from non-use (unlike QuickBooks), so reconnection is rarely needed.',
      webhooks: 'Google Calendar push notifications (via Pub/Sub) alert the VPS when events are created, modified, or deleted. Events published to NATS at TENANT_{id}.webhook.calendar.{event_type}. The Leads Agent subscribes to detect scheduling conflicts or cancellations.',
      hosting: 'Single multi-tenant VPS manages all customers\' calendar connections. Tenant isolation via Supabase RLS and NATS subject namespacing. No per-customer calendar proxies. Conflict detection runs entirely on the VPS by comparing freebusy data across team members.',
    },
  },
  {
    id: 'drive',
    name: 'Google Drive',
    icon: 'FolderOpen',
    description: 'Documents & submittals',
    color: '#fbbc04',
    details: [
      'Shared Drive per customer with structured folder hierarchy',
      'Project → Room → Category (Submittals, Cut Sheets, Warranties)',
      'Design specifications and material selection documents',
      'Compliance documents and insurance certificates'
    ],
    useCases: [
      'The Design Agent organizes submittals, cut sheets, and warranties into the correct project folders',
      'The Bookkeeping Agent stores subcontractor insurance certs and compliance documents',
      'Complete handoff packages are compiled here for the build team'
    ],
    connectedAgents: ['design-agent', 'bookkeeping-agent'],
    authMethod: 'OAuth 2.0',
    dataFlow: 'Read + Write',
    infrastructure: {
      connection: 'Google Drive REST API via OAuth 2.0 from the shared VPS. Rate limit: 10 requests per second per user. On customer signup, the system provisions a Shared Drive with the standard folder hierarchy: Project → Room → Category (Submittals, Cut Sheets, Warranties). Key gotcha: Shared Drives don\'t allow external sharing — all files stay within the customer\'s Google Workspace.',
      credentials: 'Per-customer Google OAuth tokens encrypted with AES-256-GCM in the integrations table. Drive uses the same Google OAuth consent as Calendar — one authorization flow grants both scopes. Tokens auto-refreshed on the VPS.',
      webhooks: 'Google Drive change notifications (Changes API with push channels) alert the VPS when files are added, modified, or deleted. Published to NATS at TENANT_{id}.webhook.drive.{change_type}. The Design Agent listens for new submittals; the Bookkeeping Agent watches for compliance document uploads.',
      hosting: 'Single multi-tenant VPS handles all Drive operations. File organization enforced by the agent template — the "Construction Remodeling" template defines the folder structure. Agents create and organize files but never delete without human approval. Rate limiting handled by the IntegrationAdapter with per-tenant request queuing.',
    },
  },
  {
    id: 'crm',
    name: 'Kiptra CRM (Built-in)',
    icon: 'Users',
    description: 'Built-in CRM with 13-stage pipeline, contact management, and deal tracking',
    color: '#ff7a59',
    details: [
      'Built-in CRM replaces external CRM dependency (previously HubSpot)',
      '13-stage deal pipeline with stage-based automation',
      'Contact records with full interaction history',
      'Lead scoring based on qualification criteria',
      'Native integration with all Kiptra agents — no API overhead'
    ],
    useCases: [
      'Every new lead is automatically created in the CRM with source attribution',
      'The Leads Agent updates deal stages as leads progress through the 13-stage pipeline',
      'Lead scoring helps prioritize which prospects get fastest follow-up',
      'All agent interactions are logged natively — no external sync required'
    ],
    connectedAgents: ['leads-agent', 'sales-agent', 'ceo-agent'],
    authMethod: 'Built-in (Supabase RLS)',
    dataFlow: 'Native read + write (no external API)',
    infrastructure: {
      connection: 'Built-in CRM backed by Supabase Postgres with RLS. No external API calls — all CRM data lives in the same database as the rest of the platform. This replaced the previous HubSpot dependency, eliminating rate limits, OAuth complexity, and external sync issues.',
      credentials: 'No external credentials needed. CRM data is secured by Supabase Row Level Security (RLS) policies. Tenant isolation is enforced at the database level — each customer\'s CRM data is invisible to other tenants.',
      webhooks: 'No external webhooks. CRM state changes are published directly to NATS JetStream at TENANT_{id}.crm.{event_type} (contact.created, deal.stageChanged, etc.) via Supabase database triggers. All agents subscribe to relevant CRM events natively.',
      hosting: 'Runs on the same Supabase instance as the rest of the platform. Zero additional infrastructure cost. The 13-stage pipeline, contact management, and deal tracking are all built-in modules — no external CRM vendor lock-in.',
    },
  },
  {
    id: 'weather',
    name: 'Weather API',
    icon: 'CloudSun',
    description: '7-day forecast for job sites',
    color: '#87ceeb',
    details: [
      'OpenWeatherMap API with 1K free calls/day',
      '7-day forecast for each active job site location',
      'Severe weather alerts for outdoor work scheduling',
      'Historical weather data for project planning'
    ],
    useCases: [
      'The Project Management Agent checks weather before scheduling exterior work like roofing or concrete',
      'Rain forecasts trigger automatic schedule adjustments and subcontractor notifications',
      'The daily briefing includes weather impacts on active job sites'
    ],
    connectedAgents: ['project-management-agent'],
    authMethod: 'API Key',
    dataFlow: 'Read-only',
    infrastructure: {
      connection: 'OpenWeatherMap REST API called from the shared VPS. Rate limit: 60 requests per minute, 1,000 calls per day on the free tier. Responses cached in Valkey (L2 distributed cache) with a 1-hour TTL — if two job sites are within 10 miles, they share the same cached forecast to conserve API calls. Node.js LRU serves as L1 in-process cache.',
      credentials: 'Single platform-level API key — not per-customer. Weather data is public and doesn\'t require per-tenant authentication. This is the only integration that uses a shared credential rather than per-customer OAuth. The API key is stored as an environment variable on the VPS, not in Supabase.',
      webhooks: 'No webhook support from OpenWeatherMap. Weather data is polled by BullMQ scheduled jobs — one job per active job site location, running every 6 hours. Severe weather alerts checked more frequently (hourly). All timestamps returned in UTC — the VPS converts to local timezone per job site before storing. Results published to NATS at TENANT_{id}.webhook.weather.forecast.',
      hosting: 'Single multi-tenant VPS. Weather is the cheapest integration to operate — the free tier (1K calls/day) handles ~40 active job sites with 6-hour polling intervals. Valkey caching means nearby sites don\'t consume extra API calls. If the free tier is exceeded, OpenWeatherMap paid plans start at $40/month for 100K calls/day.',
    },
  },
  {
    id: 'email',
    name: 'Email',
    icon: 'Mail',
    description: 'Gmail drafts & SendGrid inbound',
    color: '#ea4335',
    details: [
      'Gmail API for outbound draft creation (human approves before sending)',
      'SendGrid Inbound Parse for leads@ inbox monitoring',
      'No draft-only OAuth scope — enforced at application layer',
      'All client communications require human approval'
    ],
    useCases: [
      'Inbound emails to leads@company.com are parsed and routed to the Leads Agent',
      'The Leads Agent drafts acknowledgment emails that sit in queue until a human approves',
      'The Design Agent drafts purchase order emails for supplier coordination'
    ],
    connectedAgents: ['leads-agent', 'design-agent'],
    authMethod: 'OAuth 2.0 (Gmail) + API Key (SendGrid)',
    dataFlow: 'Read + Draft (never auto-send)',
    infrastructure: {
      connection: 'Two separate systems: (1) Gmail REST API via OAuth 2.0 for outbound draft creation — agents create drafts in the customer\'s Gmail, but never send directly. (2) SendGrid Inbound Parse for leads@ inbox — requires MX record configuration on the customer\'s domain to route leads@company.com to SendGrid. No single tool handles both inbound and outbound.',
      credentials: 'Gmail: per-customer OAuth tokens encrypted with AES-256-GCM in the integrations table. Key gotcha — Gmail has no draft-only OAuth scope, so the app grants full gmail.compose but enforces draft-only behavior at the application layer. SendGrid: platform-level API key (not per-customer) with per-customer MX routing rules. SendGrid free tier: 100 emails/day.',
      webhooks: 'SendGrid Inbound Parse POSTs parsed email payloads to /webhooks/sendgrid/:tenantId on the VPS. The server extracts sender, subject, and body, logs the raw event to event_bus_log, and publishes to NATS at TENANT_{id}.webhook.email.inbound. Full flow: leads@company.com → MX record → SendGrid → webhook → NATS → Leads Agent → draft response → drafts table → human approves → Gmail API sends.',
      hosting: 'Single multi-tenant VPS handles all email routing. The "never auto-send" rule is enforced at the application layer — every outbound email goes through the drafts table and requires human approval in the Approval Queue before the Gmail API sends it. This is a non-negotiable architectural constraint, not a Gmail setting.',
    },
  },
];
