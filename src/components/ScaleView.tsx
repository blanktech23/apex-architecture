'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, DollarSign, Zap, Server, Brain, Wallet, PiggyBank, Cloud, Database, Activity } from 'lucide-react';

// Pricing: all tiers = $200/mo recurring. Setup fees differ by tier.
// Starter: $5,000 setup + $200/mo
// Professional: $7,500 setup + $200/mo
// Enterprise: $10,000 setup + $200/mo
// Blended mix: 40% Starter, 40% Pro, 20% Enterprise
// Blended setup: 0.4*5000 + 0.4*7500 + 0.2*10000 = $7,000 avg
// Monthly per customer: $200
//
// Cost data from plan document Section 10:
// | Component    | 10 Cust | 100 Cust | 1,000 Cust |
// | Vercel Pro   | $20     | $20      | $150       |
// | VPS (DO)     | $84     | $250     | $1,500     |
// | Supabase     | $25     | $25      | $599       |
// | OpenRouter   | $133    | $1,326   | $13,260    |
// | Monitoring   | $0      | $0       | $50        |
// | TOTAL        | $262    | $1,621   | $15,559    |

const MONTHLY_PER_CUSTOMER = 200;
const BLENDED_SETUP = 7000;

const scaleData = [
  {
    customers: 1,
    monthlyRevenue: 1 * MONTHLY_PER_CUSTOMER,
    vercel: 20, vps: 48, supabase: 25, openRouter: 13, monitoring: 0,
    get infraCost() { return this.vercel + this.vps + this.supabase + this.monitoring; },
    get totalCost() { return this.infraCost + this.openRouter; },
    setupFees: 1 * BLENDED_SETUP,
  },
  {
    customers: 10,
    monthlyRevenue: 10 * MONTHLY_PER_CUSTOMER,
    vercel: 20, vps: 84, supabase: 25, openRouter: 133, monitoring: 0,
    get infraCost() { return this.vercel + this.vps + this.supabase + this.monitoring; },
    get totalCost() { return this.infraCost + this.openRouter; }, // $262
    setupFees: 10 * BLENDED_SETUP,
  },
  {
    customers: 50,
    monthlyRevenue: 50 * MONTHLY_PER_CUSTOMER,
    vercel: 20, vps: 158, supabase: 25, openRouter: 663, monitoring: 0,
    get infraCost() { return this.vercel + this.vps + this.supabase + this.monitoring; },
    get totalCost() { return this.infraCost + this.openRouter; }, // $866
    setupFees: 50 * BLENDED_SETUP,
  },
  {
    customers: 100,
    monthlyRevenue: 100 * MONTHLY_PER_CUSTOMER,
    vercel: 20, vps: 250, supabase: 25, openRouter: 1326, monitoring: 0,
    get infraCost() { return this.vercel + this.vps + this.supabase + this.monitoring; },
    get totalCost() { return this.infraCost + this.openRouter; }, // $1,621
    setupFees: 100 * BLENDED_SETUP,
  },
  {
    customers: 1000,
    monthlyRevenue: 1000 * MONTHLY_PER_CUSTOMER,
    vercel: 150, vps: 1500, supabase: 599, openRouter: 13260, monitoring: 50,
    get infraCost() { return this.vercel + this.vps + this.supabase + this.monitoring; },
    get totalCost() { return this.infraCost + this.openRouter; }, // $15,559
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
      <div className="min-h-full p-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-white tracking-tight mb-2">
              Platform Economics at Scale
            </h2>
            <p className="text-slate-400 text-sm">
              All tiers: $200/mo recurring. Setup fees: $5K / $7.5K / $10K (blended avg $7K)
            </p>
          </div>

          {/* Scale selector */}
          <div className="flex items-center justify-center gap-3 mb-10 flex-wrap">
            {scaleData.map((d, i) => (
              <button
                key={d.customers}
                onClick={() => setActiveIndex(i)}
                className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
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
          <div className="glass p-5 mb-6" style={{ border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-indigo-400" />
              Every New Customer Brings
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider">One-Time Setup Fee</p>
                <p className="text-xl font-bold text-amber-400">$5K — $10K</p>
                <p className="text-[10px] text-slate-600 mt-0.5">Starter $5K | Pro $7.5K | Enterprise $10K</p>
              </div>
              <div className="text-center relative">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-600 text-lg">+</span>
                <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Monthly Recurring</p>
                <p className="text-xl font-bold text-emerald-400">$200/mo</p>
                <p className="text-[10px] text-slate-600 mt-0.5">Same across all tiers</p>
              </div>
              <div className="text-center relative">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-600 text-lg">=</span>
                <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Year 1 Per Customer</p>
                <p className="text-xl font-bold text-white">$7.4K — $12.4K</p>
                <p className="text-[10px] text-slate-600 mt-0.5">Setup + 12 months recurring</p>
              </div>
            </div>
          </div>

          {/* Revenue overview at selected scale */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
                sub: `${data.customers} × $7K avg setup`,
                icon: Zap,
                color: '#eab308',
              },
              {
                label: 'Monthly Recurring',
                value: formatCurrency(data.monthlyRevenue),
                sub: `${data.customers} × $200/mo`,
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
                className="glass p-5 text-center"
              >
                <stat.icon
                  className="w-5 h-5 mx-auto mb-2"
                  style={{ color: stat.color }}
                />
                <motion.p
                  key={`${stat.label}-${data.customers}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl font-bold text-white"
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
          <div className="glass p-6 mb-6" style={{ border: '1px solid rgba(34, 197, 94, 0.2)' }}>
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
                  className="text-3xl font-bold text-emerald-400"
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
                  className="text-3xl font-bold text-emerald-400"
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

          {/* Cost breakdown — all 5 line items from plan */}
          <div className="glass p-6 mb-6">
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
                { label: 'Monitoring', value: data.monitoring, icon: Activity, color: '#06b6d4', desc: 'Prometheus + Grafana' },
              ].map((item) => (
                <motion.div
                  key={`${item.label}-${data.customers}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between rounded-lg px-4 py-2.5"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon className="w-4 h-4 shrink-0" style={{ color: item.color }} />
                    <div>
                      <span className="text-xs text-slate-300">{item.label}</span>
                      <p className="text-[10px] text-slate-600">{item.desc}</p>
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
          <div className="glass p-6">
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
          <div className="mt-6 text-center">
            <p className="text-[11px] text-slate-600">
              Starter: $5K setup + $200/mo &nbsp;|&nbsp; Professional: $7.5K setup + $200/mo &nbsp;|&nbsp; Enterprise: $10K setup + $200/mo
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
