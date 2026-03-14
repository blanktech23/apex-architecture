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
      'The Project Orchestrator checks JobTread daily for schedule drift and budget overruns',
      'The Estimate Engine pulls historical cost data from completed JobTread projects to improve future estimates'
    ],
    connectedAgents: ['design-spec-assistant', 'project-orchestrator', 'estimate-engine', 'executive-navigator'],
    authMethod: 'API Key',
    dataFlow: 'Read + Write (with human approval)',
    infrastructure: {
      connection: 'API calls routed through the shared cloud server (VPS) — the server acts as a secure middleman between agents and JobTread',
      credentials: 'Each customer\'s JobTread API key is encrypted (AES-256) and stored in Supabase — never exposed to the frontend',
      webhooks: 'JobTread sends real-time updates to a webhook endpoint on our server, which routes them to the right tenant\'s agents via NATS',
      hosting: 'One centralized server handles all customers\' JobTread connections — not a separate server per customer',
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
      'The Operations Controller monitors AR aging and drafts collection notices when invoices are overdue',
      'The Executive Navigator pulls financial summaries for the CEO morning briefing',
      'The Estimate Engine references historical costs to build more accurate estimates'
    ],
    connectedAgents: ['project-orchestrator', 'estimate-engine', 'operations-controller', 'executive-navigator'],
    authMethod: 'OAuth 2.0',
    dataFlow: 'Read-only (enforced at app layer)',
    infrastructure: {
      connection: 'OAuth 2.0 tokens managed on the shared VPS — tokens auto-refresh before expiry (QuickBooks tokens last 1 hour)',
      credentials: 'OAuth refresh tokens encrypted (AES-256) in Supabase — expire after 100 days of non-use, customers are alerted to reconnect',
      webhooks: 'QuickBooks sends payment and invoice updates via webhooks to our VPS, routed to tenant-specific agents through NATS',
      hosting: 'One centralized server handles all customers\' QuickBooks connections — read-only access enforced at the application layer',
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
      'When a lead is qualified, the Discovery Concierge checks calendar availability and proposes consultation times',
      'The system avoids double-booking by checking freebusy data before suggesting slots',
      'After booking, a prep questionnaire is automatically sent to the prospect'
    ],
    connectedAgents: ['discovery-concierge'],
    authMethod: 'OAuth 2.0',
    dataFlow: 'Read (freebusy) + Write (create events)',
    infrastructure: {
      connection: 'Google API calls made from the shared VPS using per-customer OAuth tokens — freebusy scope shows only busy/free, not event details',
      credentials: 'OAuth tokens encrypted (AES-256) in Supabase and auto-refreshed by the server before expiry',
      webhooks: 'Google Calendar push notifications alert the VPS when events change, routed to the Discovery Concierge via NATS',
      hosting: 'One centralized server manages all customers\' calendar connections — each customer\'s data isolated by tenant ID',
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
      'The Design Spec Assistant organizes submittals, cut sheets, and warranties into the correct project folders',
      'The Operations Controller stores subcontractor insurance certs and compliance documents',
      'Complete handoff packages are compiled here for the build team'
    ],
    connectedAgents: ['design-spec-assistant', 'operations-controller'],
    authMethod: 'OAuth 2.0',
    dataFlow: 'Read + Write',
    infrastructure: {
      connection: 'Google Drive API calls routed through the shared VPS — agents create folders and upload files on behalf of each customer',
      credentials: 'Per-customer OAuth tokens encrypted (AES-256) in Supabase — one Shared Drive provisioned per customer on signup',
      webhooks: 'Drive change notifications pushed to the VPS when files are added or modified externally',
      hosting: 'One centralized server handles all customers\' Drive operations — file organization follows a standard template per industry',
    },
  },
  {
    id: 'crm',
    name: 'CRM',
    icon: 'Users',
    description: 'Lead & contact management',
    color: '#ff7a59',
    details: [
      'HubSpot free tier for lead capture and pipeline tracking',
      'Contact records with full interaction history',
      'Deal pipeline with stage-based automation',
      'Lead scoring based on qualification criteria'
    ],
    useCases: [
      'Every new lead is automatically created in the CRM with source attribution',
      'The Discovery Concierge updates deal stages as leads progress through qualification',
      'Lead scoring helps prioritize which prospects get fastest follow-up'
    ],
    connectedAgents: ['discovery-concierge'],
    authMethod: 'OAuth 2.0',
    dataFlow: 'Read + Write',
    infrastructure: {
      connection: 'HubSpot API calls made from the shared VPS — each customer connects their own HubSpot account via OAuth',
      credentials: 'OAuth tokens encrypted (AES-256) in Supabase with automatic refresh handling',
      webhooks: 'HubSpot webhooks notify the VPS of new contacts and deal stage changes, routed to the Discovery Concierge via NATS',
      hosting: 'One centralized server manages all customers\' CRM connections — HubSpot free tier is sufficient for most customers',
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
      'The Project Orchestrator checks weather before scheduling exterior work like roofing or concrete',
      'Rain forecasts trigger automatic schedule adjustments and subcontractor notifications',
      'The daily briefing includes weather impacts on active job sites'
    ],
    connectedAgents: ['project-orchestrator'],
    authMethod: 'API Key',
    dataFlow: 'Read-only',
    infrastructure: {
      connection: 'OpenWeatherMap REST API called from the shared VPS — responses cached in Redis to stay within the 1K/day free tier',
      credentials: 'Single platform-level API key (not per-customer) — weather data is public and doesn\'t require per-tenant auth',
      webhooks: 'No webhooks — weather is polled on a schedule by BullMQ cron jobs for each active job site location',
      hosting: 'One centralized server fetches weather for all customers\' job sites — cached results shared when sites are in the same area',
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
      'Inbound emails to leads@company.com are parsed and routed to the Discovery Concierge',
      'The Discovery Concierge drafts acknowledgment emails that sit in queue until a human approves',
      'The Design Spec Assistant drafts purchase order emails for supplier coordination'
    ],
    connectedAgents: ['discovery-concierge', 'design-spec-assistant'],
    authMethod: 'OAuth 2.0 (Gmail) + API Key (SendGrid)',
    dataFlow: 'Read + Draft (never auto-send)',
    infrastructure: {
      connection: 'Two-part system: Gmail API (outbound drafts via OAuth) + SendGrid Inbound Parse (incoming lead emails via webhook)',
      credentials: 'Gmail OAuth tokens encrypted (AES-256) in Supabase per customer — SendGrid uses a platform-level API key with per-customer MX routing',
      webhooks: 'SendGrid forwards inbound emails to a webhook on the VPS, parsed and routed to the right tenant\'s Discovery Concierge via NATS',
      hosting: 'One centralized server handles all email routing — agents draft but never auto-send, enforced at the application layer',
    },
  },
];
