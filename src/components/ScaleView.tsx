'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, DollarSign, Zap, Server, Brain, Wallet, PiggyBank, Cloud, Database, Activity, CreditCard, Mail } from 'lucide-react';

// Pricing tiers differ by both setup fee and monthly recurring.
// Starter: $5,000 setup + $275/mo
// Professional: $10,000 setup + $500/mo
// Enterprise: $20,000 setup + $750/mo
// Blended mix: 40% Starter, 40% Pro, 20% Enterprise
// Blended setup: 0.4*5000 + 0.4*10000 + 0.2*20000 = $10,000 avg
// Blended monthly: 0.4*275 + 0.4*500 + 0.2*750 = $460 avg
//
// Cost data — researched March 2026 from actual pricing pages:
// Vercel Pro: $20/mo per seat (vercel.com/pricing)
// DigitalOcean: 4vCPU/8GB=$48, 8vCPU/16GB=$96 (digitalocean.com/pricing/droplets)
// Supabase Pro: $25/mo, Team: $599/mo (supabase.com/pricing)
// OpenRouter: GPT-4.1 Nano $0.10/$0.40, Haiku $1/$5, Sonnet $3/$15, Opus $15/$75 per 1M tokens
// Grafana Cloud: free tier (10K series) — $0 until ~500 customers
// Stripe: 2.9% + $0.30 per transaction (stripe.com/pricing)
// SendGrid: free 100/day, Essentials $20/mo, Pro $90/mo (sendgrid.com/pricing)

const MONTHLY_PER_CUSTOMER = 460;
const BLENDED_SETUP = 10000;

const scaleData = [
  {
    customers: 1,
    monthlyRevenue: 1 * MONTHLY_PER_CUSTOMER,
    vercel: 20, vps: 48, supabase: 25, openRouter: 14, monitoring: 0, stripe: 14, sendgrid: 0,
    get infraCost() { return this.vercel + this.vps + this.supabase + this.monitoring + this.sendgrid; },
    get totalCost() { return this.infraCost + this.openRouter + this.stripe; },
    setupFees: 1 * BLENDED_SETUP,
  },
  {
    customers: 10,
    monthlyRevenue: 10 * MONTHLY_PER_CUSTOMER,
    vercel: 20, vps: 96, supabase: 25, openRouter: 140, monitoring: 0, stripe: 136, sendgrid: 0,
    get infraCost() { return this.vercel + this.vps + this.supabase + this.monitoring + this.sendgrid; },
    get totalCost() { return this.infraCost + this.openRouter + this.stripe; },
    setupFees: 10 * BLENDED_SETUP,
  },
  {
    customers: 50,
    monthlyRevenue: 50 * MONTHLY_PER_CUSTOMER,
    vercel: 20, vps: 96, supabase: 25, openRouter: 700, monitoring: 0, stripe: 682, sendgrid: 20,
    get infraCost() { return this.vercel + this.vps + this.supabase + this.monitoring + this.sendgrid; },
    get totalCost() { return this.infraCost + this.openRouter + this.stripe; },
    setupFees: 50 * BLENDED_SETUP,
  },
  {
    customers: 100,
    monthlyRevenue: 100 * MONTHLY_PER_CUSTOMER,
    vercel: 20, vps: 192, supabase: 25, openRouter: 1400, monitoring: 0, stripe: 1364, sendgrid: 20,
    get infraCost() { return this.vercel + this.vps + this.supabase + this.monitoring + this.sendgrid; },
    get totalCost() { return this.infraCost + this.openRouter + this.stripe; },
    setupFees: 100 * BLENDED_SETUP,
  },
  {
    customers: 1000,
    monthlyRevenue: 1000 * MONTHLY_PER_CUSTOMER,
    vercel: 150, vps: 1500, supabase: 599, openRouter: 14000, monitoring: 50, stripe: 13640, sendgrid: 90,
    get infraCost() { return this.vercel + this.vps + this.supabase + this.monitoring + this.sendgrid; },
    get totalCost() { return this.infraCost + this.openRouter + this.stripe; },
    setupFees: 1000 * BLENDED_SETUP,
  },
];

function formatCurrency(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

function formatCurrencyExact(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
  if (n >= 100000) return `$${(n / 1000).toFixed(0)}K`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
}

export function ScaleView() {
  const [activeIndex, setActiveIndex] = useState(0);
  const data = scaleData[activeIndex];

  const totalCost = data.totalCost;
  const costPerCustomer = totalCost / data.customers;
  const monthlyNetProfit = data.monthlyRevenue - totalCost;
  const monthlyMargin = ((monthlyNetProfit / data.monthlyRevenue) * 100);

  const year1Recurring = data.monthlyRevenue * 12;
  const year1TotalRevenue = data.setupFees + year1Recurring;
  const year1TotalCosts = totalCost * 12;
  const year1NetProfit = year1TotalRevenue - year1TotalCosts;
  const year1Margin = ((year1NetProfit / year1TotalRevenue) * 100);

  return (
    <div className="absolute inset-0 overflow-auto">
      <div className="min-h-full p-4 sm:p-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl mx-auto"
        >
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight mb-2">
              Platform Economics at Scale
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Starter $275/mo | Pro $500/mo | Enterprise $750/mo. Setup fees: $5K / $10K / $20K (blended avg $10K)
            </p>
          </div>

          {/* Scale selector */}
          <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 overflow-x-auto scrollbar-hide pb-1">
            {scaleData.map((d, i) => (
              <button
                key={d.customers}
                onClick={() => setActiveIndex(i)}
                className={`relative px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  i === activeIndex
                    ? 'text-white'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                style={
                  i === activeIndex
                    ? {
                        background: 'rgba(99, 102, 241, 0.15)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                      }
                    : {
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }
                }
              >
                {d.customers.toLocaleString()} {d.customers === 1 ? 'customer' : 'customers'}
              </button>
            ))}
          </div>

          {/* Per-customer revenue breakdown */}
          <div className="glass p-4 sm:p-5 mb-6" style={{ border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-indigo-400" />
              Every New Customer Brings
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="text-center">
                <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider">One-Time Setup Fee</p>
                <p className="text-lg sm:text-xl font-bold text-amber-400">$5K — $20K</p>
                <p className="text-[10px] text-slate-600 mt-0.5">Starter $5K | Pro $10K | Enterprise $20K</p>
              </div>
              <div className="text-center relative">
                <span className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 text-slate-600 text-lg">+</span>
                <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Monthly Recurring</p>
                <p className="text-lg sm:text-xl font-bold text-emerald-400">$275 — $750/mo</p>
                <p className="text-[10px] text-slate-600 mt-0.5">Starter $275 | Pro $500 | Enterprise $750</p>
              </div>
              <div className="text-center relative">
                <span className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 text-slate-600 text-lg">=</span>
                <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Year 1 Per Customer</p>
                <p className="text-lg sm:text-xl font-bold text-white">$8.3K — $29K</p>
                <p className="text-[10px] text-slate-600 mt-0.5">Setup + 12 months recurring</p>
              </div>
            </div>
          </div>

          {/* Revenue overview at selected scale */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-6">
            {[
              {
                label: 'Customers',
                value: data.customers.toLocaleString(),
                icon: Users,
                color: '#6366f1',
              },
              {
                label: 'One-Time Revenue',
                value: formatCurrency(data.setupFees),
                sub: `${data.customers} × $10K avg setup`,
                icon: Zap,
                color: '#eab308',
              },
              {
                label: 'Monthly Recurring',
                value: formatCurrency(data.monthlyRevenue),
                sub: `${data.customers} × $460/mo avg`,
                icon: TrendingUp,
                color: '#22c55e',
              },
              {
                label: 'Monthly Costs',
                value: formatCurrencyExact(totalCost),
                sub: `$${costPerCustomer.toFixed(0)}/customer`,
                icon: DollarSign,
                color: '#f97316',
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass p-3 sm:p-5 text-center"
              >
                <stat.icon
                  className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1.5 sm:mb-2"
                  style={{ color: stat.color }}
                />
                <motion.p
                  key={`${stat.label}-${data.customers}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-lg sm:text-2xl font-bold text-white"
                >
                  {stat.value}
                </motion.p>
                <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
                {'sub' in stat && (
                  <p className="text-[10px] text-slate-600 mt-0.5">{stat.sub}</p>
                )}
              </motion.div>
            ))}
          </div>

          {/* What You Take Home — the hero section */}
          <div className="glass p-4 sm:p-6 mb-6" style={{ border: '1px solid rgba(34, 197, 94, 0.2)' }}>
            <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
              <PiggyBank className="w-4 h-4 text-emerald-400" />
              What You Take Home
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Monthly Net Profit */}
              <div className="text-center">
                <p className="text-xs text-slate-500 mb-1">Monthly Net Profit</p>
                <motion.p
                  key={`mnp-${data.customers}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl sm:text-3xl font-bold text-emerald-400"
                >
                  {formatCurrency(monthlyNetProfit)}
                </motion.p>
                <p className="text-[10px] text-slate-600 mt-2">
                  {formatCurrency(data.monthlyRevenue)}/mo recurring
                </p>
                <p className="text-[10px] text-slate-600">
                  – {formatCurrencyExact(totalCost)}/mo platform costs
                </p>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                  = {formatCurrency(monthlyNetProfit)}/mo in your pocket
                </p>
                <div className="mt-2 inline-block px-2 py-0.5 rounded-full text-[10px] font-medium"
                  style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e' }}>
                  {monthlyMargin.toFixed(1)}% margin
                </div>
              </div>

              {/* Year 1 Net Profit */}
              <div className="text-center">
                <p className="text-xs text-slate-500 mb-1">Year 1 Net Profit</p>
                <motion.p
                  key={`y1np-${data.customers}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl sm:text-3xl font-bold text-emerald-400"
                >
                  {formatCurrency(year1NetProfit)}
                </motion.p>
                <p className="text-[10px] text-slate-600 mt-2">
                  {formatCurrency(data.setupFees)} one-time setup fees
                </p>
                <p className="text-[10px] text-slate-600">
                  + {formatCurrency(year1Recurring)} recurring ({formatCurrency(data.monthlyRevenue)} × 12 mo)
                </p>
                <p className="text-[10px] text-slate-600">
                  – {formatCurrency(year1TotalCosts)} annual costs ({formatCurrencyExact(totalCost)} × 12 mo)
                </p>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                  = {formatCurrency(year1NetProfit)} net profit year 1
                </p>
                <div className="mt-2 inline-block px-2 py-0.5 rounded-full text-[10px] font-medium"
                  style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e' }}>
                  {year1Margin.toFixed(1)}% margin
                </div>
              </div>
            </div>
          </div>

          {/* Cost breakdown — all line items */}
          <div className="glass p-4 sm:p-6 mb-6">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Server className="w-4 h-4 text-slate-400" />
              Monthly Cost Breakdown
            </h3>
            <div className="space-y-2">
              {[
                { label: 'Vercel Pro', value: data.vercel, icon: Cloud, color: '#3b82f6', desc: 'Frontend hosting' },
                { label: 'VPS (DigitalOcean)', value: data.vps, icon: Server, color: '#6366f1', desc: 'Agent backend + Redis + NATS' },
                { label: 'Supabase Pro', value: data.supabase, icon: Database, color: '#22c55e', desc: 'PostgreSQL + Auth + RLS' },
                { label: 'OpenRouter (AI)', value: data.openRouter, icon: Brain, color: '#a855f7', desc: 'Multi-model inference' },
                { label: 'Stripe', value: data.stripe, icon: CreditCard, color: '#635bff', desc: 'Payment processing (2.9% + $0.30)' },
                { label: 'SendGrid', value: data.sendgrid, icon: Mail, color: '#1a82e2', desc: 'Transactional email delivery' },
                { label: 'Monitoring', value: data.monitoring, icon: Activity, color: '#06b6d4', desc: 'Prometheus + Grafana' },
              ].map((item) => (
                <motion.div
                  key={`${item.label}-${data.customers}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between rounded-lg px-3 sm:px-4 py-2 sm:py-2.5"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                    <item.icon className="w-4 h-4 shrink-0" style={{ color: item.color }} />
                    <div className="min-w-0">
                      <span className="text-[11px] sm:text-xs text-slate-300">{item.label}</span>
                      <p className="text-[9px] sm:text-[10px] text-slate-600 truncate">{item.desc}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-white">
                    ${item.value.toLocaleString()}<span className="text-[10px] text-slate-500 font-normal">/mo</span>
                  </span>
                </motion.div>
              ))}
              {/* Total line */}
              <div
                className="flex items-center justify-between rounded-lg px-4 py-3 mt-1"
                style={{
                  background: 'rgba(249, 115, 22, 0.08)',
                  border: '1px solid rgba(249, 115, 22, 0.2)',
                }}
              >
                <div className="flex items-center gap-2.5">
                  <DollarSign className="w-4 h-4 text-orange-400 shrink-0" />
                  <span className="text-xs font-semibold text-orange-300">Total Platform Cost</span>
                </div>
                <motion.span
                  key={`total-${data.customers}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-base font-bold text-orange-400"
                >
                  ${totalCost.toLocaleString()}<span className="text-[10px] text-orange-400/60 font-normal">/mo</span>
                </motion.span>
              </div>
            </div>
          </div>

          {/* Revenue vs Cost bars */}
          <div className="glass p-4 sm:p-6">
            <h3 className="text-sm font-semibold text-white mb-4">
              Revenue vs Platform Cost
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Monthly Revenue</span>
                  <span>{formatCurrencyExact(data.monthlyRevenue)}/mo</span>
                </div>
                <div className="h-4 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(to right, #22c55e, #16a34a)' }}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Platform Cost</span>
                  <span>{formatCurrencyExact(totalCost)}/mo</span>
                </div>
                <div className="h-4 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(to right, #f97316, #ea580c)' }}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.max((totalCost / data.monthlyRevenue) * 100, 1.5)}%`,
                    }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </div>
            </div>
            <p className="text-center text-slate-500 text-xs mt-4">
              At {data.customers.toLocaleString()} customer{data.customers !== 1 ? 's' : ''}, you keep{' '}
              <span className="text-emerald-400 font-semibold">
                {formatCurrency(monthlyNetProfit)}/mo
              </span>{' '}
              ({monthlyMargin.toFixed(1)}% of revenue)
            </p>
          </div>

          {/* Pricing tiers reference */}
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-[10px] sm:text-[11px] text-slate-600 hidden sm:block">
              Starter: $5K setup + $275/mo &nbsp;|&nbsp; Professional: $10K setup + $500/mo &nbsp;|&nbsp; Enterprise: $20K setup + $750/mo
            </p>
            <div className="sm:hidden space-y-0.5">
              <p className="text-[10px] text-slate-600">Starter: $5K + $275/mo</p>
              <p className="text-[10px] text-slate-600">Professional: $10K + $500/mo</p>
              <p className="text-[10px] text-slate-600">Enterprise: $20K + $750/mo</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
