'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export interface TocItem {
  id: string;
  label: string;
  level?: number;
}

interface DocsSidebarProps {
  items: TocItem[];
  activeId?: string;
  title: string;
  separator?: number;
  /** When set, links become route-based (/basePath/id) instead of anchor-based (#id) */
  basePath?: string;
}

export function DocsSidebar({ items, activeId, title, separator, basePath }: DocsSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!mobileOpen) return;
    function handleClick(e: MouseEvent) {
      if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [mobileOpen]);

  // Close on escape
  useEffect(() => {
    if (!mobileOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMobileOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [mobileOpen]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const renderItems = (onClickItem?: () => void) => (
    <ul className="space-y-0.5">
      {items.map((item, index) => {
        const isActive = activeId === item.id;
        const isSubsection = item.level === 1;

        return (
          <React.Fragment key={item.id}>
            {separator !== undefined && index === separator && (
              <li className="py-2">
                <hr className="border-white/5" />
              </li>
            )}
            <li>
              <a
                href={basePath ? `${basePath}/${item.id}` : `#${item.id}`}
                onClick={onClickItem}
                className={`block rounded-md transition-colors ${
                  isSubsection ? 'pl-7 pr-3 py-1.5 text-xs' : 'pl-3 pr-3 py-2 text-sm'
                } ${
                  isActive
                    ? 'text-white border-l-2 border-indigo-500 bg-indigo-500/8'
                    : isSubsection
                      ? 'text-slate-500 hover:text-slate-300 border-l-2 border-transparent'
                      : 'text-slate-400 hover:text-slate-200 border-l-2 border-transparent'
                }`}
              >
                {item.label}
              </a>
            </li>
          </React.Fragment>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:block sticky top-0 h-screen shrink-0 overflow-y-auto"
        style={{
          width: 280,
          background: 'rgba(10, 14, 26, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <div className="px-4 pt-6 pb-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500 mb-4">
            {title}
          </p>
          {renderItems()}
        </div>
      </aside>

      {/* Mobile hamburger trigger */}
      <div className="lg:hidden fixed top-16 left-4 z-40">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
          style={{
            background: 'rgba(15, 15, 26, 0.9)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
          aria-label="Open sidebar"
        >
          <Menu className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Mobile slide-over */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/60"
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel */}
            <motion.div
              ref={overlayRef}
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              className="lg:hidden fixed top-0 left-0 h-full z-50 overflow-y-auto"
              style={{
                width: 280,
                background: 'rgba(10, 14, 26, 0.97)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRight: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* Close button */}
              <div className="flex items-center justify-between px-4 pt-4 pb-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                  {title}
                </p>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-white/5 transition-colors"
                  aria-label="Close sidebar"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="px-4 pb-6">
                {renderItems(() => setMobileOpen(false))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
