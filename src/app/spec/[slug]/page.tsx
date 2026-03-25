import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import matter from 'gray-matter';
import { specSections } from '@/content/spec/toc';
import { SpecContent } from './SpecContent';
import Link from 'next/link';

const SECTIONS_DIR = path.join(process.cwd(), 'src/content/spec/sections');

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return specSections.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const section = specSections.find((s) => s.slug === slug);
  if (!section) return { title: 'Not Found' };
  return {
    title: `${section.title} — Kiptra AI Spec`,
  };
}

export default async function SpecSectionPage({ params }: PageProps) {
  const { slug } = await params;
  const section = specSections.find((s) => s.slug === slug);
  if (!section) notFound();

  const filePath = path.join(SECTIONS_DIR, section.file);
  if (!fs.existsSync(filePath)) notFound();

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { content } = matter(raw);

  // Find prev/next sections
  const currentIndex = specSections.findIndex((s) => s.slug === slug);
  const prev = currentIndex > 0 ? specSections[currentIndex - 1] : null;
  const next = currentIndex < specSections.length - 1 ? specSections[currentIndex + 1] : null;

  return (
    <article className="max-w-4xl mx-auto px-6 sm:px-10 py-10 pb-24">
      <h1 className="text-3xl font-bold text-white mb-8 pb-4 border-b border-white/10">
        {section.title}
      </h1>

      <SpecContent content={content} />

      <nav className="mt-16 pt-8 border-t border-white/10 flex justify-between gap-4">
        {prev ? (
          <Link
            href={`/spec/${prev.slug}`}
            className="group flex flex-col items-start gap-1 px-4 py-3 rounded-lg border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-colors max-w-[45%]"
          >
            <span className="text-[10px] uppercase tracking-wider text-slate-500 group-hover:text-indigo-400 transition-colors">
              Previous
            </span>
            <span className="text-sm text-slate-300 group-hover:text-white transition-colors line-clamp-1">
              {prev.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/spec/${next.slug}`}
            className="group flex flex-col items-end gap-1 px-4 py-3 rounded-lg border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-colors max-w-[45%] ml-auto"
          >
            <span className="text-[10px] uppercase tracking-wider text-slate-500 group-hover:text-indigo-400 transition-colors">
              Next
            </span>
            <span className="text-sm text-slate-300 group-hover:text-white transition-colors line-clamp-1">
              {next.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </article>
  );
}
