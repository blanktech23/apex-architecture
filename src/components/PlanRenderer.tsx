'use client';

import '@/content/plan/styles.css';

interface PlanRendererProps {
  html: string;
}

export function PlanRenderer({ html }: PlanRendererProps) {
  return (
    <div
      className="plan-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
