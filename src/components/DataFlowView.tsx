'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Search,
  Calendar,
  Palette,
  Calculator,
  BarChart3,
  Shield,
  Crown,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';

const steps = [
  {
    id: 1,
    agent: 'Leads Agent',
    color: '#3b82f6',
    icon: Search,
    title: 'New lead comes in',
    description:
      'A homeowner emails asking about a kitchen renovation. The Leads Agent responds within 15 minutes, qualifies the lead, and checks it against the ideal client profile.',
    integration: 'Email + CRM',
  },
  {
    id: 2,
    agent: 'Leads Agent',
    color: '#3b82f6',
    icon: Calendar,
    title: 'Consultation scheduled',
    description:
      'Lead is qualified. The Leads Agent schedules a consultation, sends a prep questionnaire, and updates the CRM with qualification notes.',
    integration: 'Google Calendar',
  },
  {
    id: 3,
    agent: 'Design Agent',
    color: '#a855f7',
    icon: Palette,
    title: 'Design phase begins',
    description:
      'After the consultation, the Design Agent creates a selection register. Every material choice, finish, and fixture is tracked with client approvals.',
    integration: 'JobTread + Google Drive',
  },
  {
    id: 4,
    agent: 'Sales Agent',
    color: '#22c55e',
    icon: Calculator,
    title: 'Estimate built',
    description:
      'The Sales Agent pulls historical data from similar projects, generates a confidence-range estimate, and compares subcontractor bids. The budget is set.',
    integration: 'JobTread + QuickBooks',
  },
  {
    id: 5,
    agent: 'Project Management Agent',
    color: '#f97316',
    icon: BarChart3,
    title: 'Construction monitored',
    description:
      'Once the project kicks off, the Project Management Agent tracks the schedule daily, monitors budget burn, coordinates subs, and flags issues before they become problems.',
    integration: 'JobTread + Weather API',
  },
  {
    id: 6,
    agent: 'Bookkeeping Agent',
    color: '#14b8a6',
    icon: Shield,
    title: 'Billing triggered',
    description:
      'At each milestone, the Bookkeeping Agent prepares invoice drafts, checks subcontractor compliance, and monitors cash flow. Nothing goes out without human approval.',
    integration: 'QuickBooks',
  },
  {
    id: 7,
    agent: 'CEO Agent',
    color: '#eab308',
    icon: Crown,
    title: 'CEO briefed',
    description:
      'Every morning at 7 AM, the CEO Agent delivers a 3-minute briefing: project health, pipeline status, escalations needing attention, and the day\'s priorities.',
    integration: 'All Systems',
  },
  {
    id: 8,
    agent: 'Support Agent',
    color: '#ec4899',
    icon: MessageCircle,
    title: 'Customer gets help',
    description:
      'A customer opens the in-app chat widget with a question about their project status. The Support Agent searches the knowledge base using hybrid search (vector + keyword), finds relevant articles, and responds with a confidence-scored answer. If confidence is below 60%, it auto-escalates to a human with full context.',
    integration: 'Knowledge Base + Email',
  },
];

export function DataFlowView() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(nextStep, 4000);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, nextStep]);

  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const step = steps[currentStep];

  return (
    <div className="absolute inset-0 flex items-start sm:items-center justify-center p-4 sm:p-8 overflow-auto pt-6 sm:pt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"
      >
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight mb-2">
            A Lead&apos;s Journey Through Kiptra
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Follow a single lead from first contact to CEO briefing
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 rounded-xl flex items-center justify-center glass hover:bg-white/10 transition-colors"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-white" />
            ) : (
              <Play className="w-4 h-4 text-white" />
            )}
          </button>
          <button
            onClick={reset}
            className="w-10 h-10 rounded-xl flex items-center justify-center glass hover:bg-white/10 transition-colors"
            aria-label="Reset"
          >
            <RotateCcw className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-start sm:justify-center gap-1 mb-6 sm:mb-8 overflow-x-auto scrollbar-hide pb-1 px-2">
          {steps.map((s, i) => (
            <button
              key={s.id}
              onClick={() => {
                setCurrentStep(i);
                setIsPlaying(false);
              }}
              className="flex items-center shrink-0"
            >
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-medium transition-all"
                style={{
                  background:
                    i <= currentStep ? `${s.color}30` : 'rgba(255,255,255,0.05)',
                  border: `2px solid ${i <= currentStep ? s.color : 'rgba(255,255,255,0.1)'}`,
                  color: i <= currentStep ? s.color : '#64748b',
                }}
              >
                {s.id}
              </div>
              {i < steps.length - 1 && (
                <div className="w-4 sm:w-6 h-0.5 mx-0.5">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      background: i < currentStep ? s.color : 'rgba(255,255,255,0.1)',
                    }}
                  />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Current step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="glass p-5 sm:p-8"
          >
            <div className="flex items-start gap-3 sm:gap-5">
              <div
                className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0"
                style={{
                  background: `${step.color}20`,
                  border: `1px solid ${step.color}40`,
                }}
              >
                <step.icon className="w-5 h-5 sm:w-7 sm:h-7" style={{ color: step.color }} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
                  <span
                    className="text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{
                      background: `${step.color}15`,
                      color: step.color,
                      border: `1px solid ${step.color}30`,
                    }}
                  >
                    {step.agent}
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
                  <span className="text-[10px] sm:text-xs text-slate-500">
                    {step.integration}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-1.5 sm:mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <p className="text-center text-slate-600 text-xs mt-4">
          Step {currentStep + 1} of {steps.length}
        </p>
      </motion.div>
    </div>
  );
}
