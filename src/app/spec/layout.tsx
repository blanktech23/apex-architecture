'use client';

import { usePathname } from 'next/navigation';
import { DocsSidebar } from '@/components/DocsSidebar';
import { specSections } from '@/content/spec/toc';

const sidebarItems = specSections.map((s) => ({
  id: s.slug,
  label: s.title,
}));

export default function SpecLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activeSlug = pathname.split('/').pop() || '';

  return (
    <div className="flex h-[calc(100vh-45px)]">
      <DocsSidebar
        items={sidebarItems}
        activeId={activeSlug}
        title="Engineering Spec"
        basePath="/spec"
      />
      <main className="flex-1 overflow-y-auto scroll-smooth">
        {children}
      </main>
    </div>
  );
}
