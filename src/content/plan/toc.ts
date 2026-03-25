export interface TocItem {
  id: string;
  label: string;
  level?: number;
}

export const planToc: TocItem[] = [
  { id: 'infra-sdk-overview', label: 'Infrastructure & SDK Overview' },
  { id: 'context', label: 'Context' },
  { id: 'architecture-overview', label: '1. Architecture Overview' },
  { id: 'vps-cost-comparison', label: '2. VPS Cost Comparison' },
  { id: 'tech-stack', label: '3. Tech Stack (Final)' },
  { id: 'stack-decisions', label: '3b. Stack Decisions' },
  { id: 'reference-boilerplates', label: '3c. Reference Boilerplates' },
  { id: 'ai-gateway-cost-model', label: '4. AI Gateway & Cost Model' },
  { id: 'multi-tenancy', label: '5. Multi-Tenancy Architecture' },
  { id: 'core-platform-ddl', label: '5b. Core Platform DDL' },
  { id: 'evolvability', label: '6. Evolvability Architecture' },
  { id: 'multi-persona', label: '6a. Multi-Persona Architecture' },
  { id: 'integration-architecture', label: '7. Integration Architecture' },
  { id: 'jobtread-contingency', label: '7a. JobTread Contingency' },
  { id: 'agent-execution', label: '7b. Agent Execution Patterns' },
  { id: 'support-agent', label: '7c. Support Agent' },
  { id: 'agent-memory', label: '7d. Agent Memory Architecture' },
  { id: 'anti-hallucination', label: '7e. Anti-Hallucination Architecture' },
  { id: 'mind-map', label: '8. Architecture Mind Map' },
  { id: 'build-order', label: '9. Phase 1 Build Order' },
  { id: 'cost-revenue', label: '10. Cost & Revenue Model' },
  { id: 'verification', label: '11. Verification' },
  { id: 'infrastructure-security', label: '12. Infra, Security & DevOps' },
  { id: 'ux-specifications', label: '13. UX Specifications' },
  { id: 'developer-experience', label: '14. Developer Experience' },
  { id: 'eos-business-os', label: '15. Business Operating System' },
  { id: 'kitchen-bath-design', label: '16. Kitchen & Bath AI Design Tool' },
  { id: 'pricing', label: 'A. Revised Pricing' },
  { id: 'ai-costs', label: 'B. AI Cost Model' },
  { id: 'churn', label: 'C. Churn Model' },
  { id: 'pl', label: 'D. Revised P&L' },
  { id: 'gtm', label: 'E. Go-to-Market Playbook' },
  { id: 'risks', label: 'F. Risk Register' },
];

export const separatorIndex = 27; // index after which the appendix separator appears
