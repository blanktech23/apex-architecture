'use client';

import { useEffect, useState, useRef } from 'react';
import { DocsSidebar } from '@/components/DocsSidebar';
import { planToc, separatorIndex } from '@/content/plan/toc';

export default function PlanLayout({ children }: { children: React.ReactNode }) {
  const [activeId, setActiveId] = useState<string>('');
  const mainRef = useRef<HTMLElement>(null);

  // Scroll-spy: observe all section headings
  useEffect(() => {
    const container = mainRef.current;
    if (!container) return;

    // Wait for content to render
    const timer = setTimeout(() => {
      const ids = planToc.map((item) => item.id);
      const elements = ids
        .map((id) => container.querySelector(`#${CSS.escape(id)}`))
        .filter(Boolean) as Element[];

      if (elements.length === 0) return;

      const observer = new IntersectionObserver(
        (entries) => {
          // Find the topmost visible section
          const visible = entries.filter((e) => e.isIntersecting);
          if (visible.length > 0) {
            // Pick the one closest to the top
            const top = visible.reduce((a, b) =>
              (a.boundingClientRect.top < b.boundingClientRect.top ? a : b)
            );
            setActiveId(top.target.id);
          }
        },
        {
          root: container,
          rootMargin: '-10% 0px -80% 0px',
          threshold: 0,
        }
      );

      elements.forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-[calc(100vh-45px)]">
      <DocsSidebar
        items={planToc}
        activeId={activeId}
        title="Plan v3"
        separator={separatorIndex}
      />
      <main ref={mainRef} className="flex-1 overflow-y-auto scroll-smooth" id="plan-scroll-container">
        {children}
      </main>
    </div>
  );
}
