export interface SpecSection {
  slug: string;
  title: string;
  file: string;
}

export const specSections: SpecSection[] = [
  { slug: 'infrastructure-sdk-overview', title: '0. Infrastructure & SDK Overview', file: '00-infrastructure-sdk-overview.mdx' },
  { slug: 'architecture-overview', title: '1. Architecture Overview', file: '01-architecture-overview.mdx' },
  { slug: 'tech-stack', title: '3. Tech Stack (Final)', file: '03-tech-stack.mdx' },
  { slug: 'key-stack-decisions', title: '3b. Key Stack Decisions (Researched)', file: '03b-key-stack-decisions.mdx' },
  { slug: 'reference-boilerplates', title: '3c. Reference Boilerplates (Evaluated March 2026)', file: '03c-reference-boilerplates.mdx' },
  { slug: 'ai-gateway-cost-model', title: '4. AI Gateway & Cost Model', file: '04-ai-gateway-cost-model.mdx' },
  { slug: 'multi-tenancy', title: '5. Multi-Tenancy Architecture', file: '05-multi-tenancy.mdx' },
  { slug: 'core-platform-ddl', title: '5b. Core Platform DDL (Complete Schema)', file: '05b-core-platform-ddl.mdx' },
  { slug: 'evolvability', title: '6. Evolvability Architecture (Built to Evolve)', file: '06-evolvability.mdx' },
  { slug: 'multi-persona', title: '6b. Multi-Persona Architecture & Industry Template System', file: '06b-multi-persona.mdx' },
  { slug: 'integration-architecture', title: '7. Integration Architecture (Email, Webhooks, OAuth)', file: '07-integration-architecture.mdx' },
  { slug: 'jobtread-contingency', title: '7a. JobTread Contingency Architecture', file: '07a-jobtread-contingency.mdx' },
  { slug: 'agent-execution', title: '7b. Agent Execution Patterns', file: '07b-agent-execution.mdx' },
  { slug: 'support-agent', title: '7c. Support Agent (AI-First Customer Support)', file: '07c-support-agent.mdx' },
  { slug: 'agent-memory', title: '7d. Agent Memory Architecture', file: '07d-agent-memory.mdx' },
  { slug: 'anti-hallucination', title: '7e. Anti-Hallucination Architecture', file: '07e-anti-hallucination.mdx' },
  { slug: 'build-order', title: '9. Build Order (Revised --- 34--38 Weeks to Production (Realistic))', file: '09-build-order.mdx' },
  { slug: 'verification', title: '11. Verification', file: '11-verification.mdx' },
  { slug: 'infrastructure-security', title: '12. Infrastructure, Security & DevOps', file: '12-infrastructure-security.mdx' },
  { slug: 'ux-specifications', title: '13. UX Specifications --- Screens, Flows & Edge Cases', file: '13-ux-specifications.mdx' },
  { slug: 'developer-experience', title: '14. Developer Experience & Build Readiness', file: '14-developer-experience.mdx' },
  { slug: 'business-os', title: '15. Business Operating System', file: '15-business-os.mdx' },
  { slug: 'kitchen-bath-design', title: '16. Kitchen & Bath AI Design Tool', file: '16-kitchen-bath-design.mdx' },
  { slug: 'appendix-f-risk-register', title: 'Appendix F: Technical Risk Register', file: '99-appendix-f-risk-register.mdx' },
];
