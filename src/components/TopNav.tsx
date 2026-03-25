'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Brain, BookOpen, FileCode } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Architecture', icon: Brain },
  { href: '/plan', label: 'Plan v3', icon: BookOpen },
  { href: '/spec', label: 'Spec', icon: FileCode },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <nav
      className="shrink-0 border-b border-white/5"
      style={{
        background: 'rgba(10, 14, 26, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-2 flex items-center justify-between">
        {/* Branding */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center shrink-0">
            <Brain className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <span className="text-xs font-semibold text-white tracking-tight">
            Kiptra AI
          </span>
        </div>

        {/* Nav links */}
        <div
          className="flex items-center gap-1 rounded-lg p-0.5"
          style={{ background: 'rgba(255, 255, 255, 0.03)' }}
        >
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="topnav-active"
                    className="absolute inset-0 rounded-md"
                    style={{
                      background: 'rgba(99, 102, 241, 0.15)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      boxShadow: '0 0 12px rgba(99, 102, 241, 0.2)',
                    }}
                    transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                  />
                )}
                <Icon className="relative z-10 w-3 h-3" />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
