'use client';

import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

type IconName = keyof typeof LucideIcons;

interface AgentNodeData {
  label: string;
  subtitle: string;
  description: string;
  color: string;
  icon: string;
  agentId: string;
  [key: string]: unknown;
}

function AgentNodeInner({ data }: NodeProps & { data: AgentNodeData }) {
  const nodeData = data as AgentNodeData;
  const IconComponent = (LucideIcons[nodeData.icon as IconName] as unknown as LucideIcon) || LucideIcons.Circle;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ scale: 1.05, y: -2 }}
      className="relative cursor-pointer group"
    >
      <div
        className="rounded-2xl p-4 transition-all duration-300"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid rgba(255, 255, 255, 0.1)`,
          borderLeft: `3px solid ${nodeData.color}`,
          minWidth: 200,
          boxShadow: `0 0 0 0 ${nodeData.color}00`,
        }}
      >
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            boxShadow: `0 0 30px ${nodeData.color}20, 0 0 60px ${nodeData.color}10`,
          }}
        />
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: `${nodeData.color}20`,
              border: `1px solid ${nodeData.color}40`,
            }}
          >
            <IconComponent className="w-5 h-5" color={nodeData.color} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white truncate">
                {nodeData.label}
              </h3>
              <span
                className="w-2 h-2 rounded-full shrink-0 animate-pulse"
                style={{ background: nodeData.color }}
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {nodeData.subtitle}
            </p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {nodeData.description}
            </p>
          </div>
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent !border-transparent !w-3 !h-3"
        style={{ opacity: 0 }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        className="!bg-transparent !border-transparent !w-3 !h-3"
        style={{ opacity: 0 }}
      />
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-transparent !border-transparent !w-3 !h-3"
        style={{ opacity: 0 }}
      />
      <Handle
        type="target"
        position={Position.Right}
        className="!bg-transparent !border-transparent !w-3 !h-3"
        style={{ opacity: 0 }}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="source-top"
        className="!bg-transparent !border-transparent !w-3 !h-3"
        style={{ opacity: 0 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="source-bottom"
        className="!bg-transparent !border-transparent !w-3 !h-3"
        style={{ opacity: 0 }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="source-left"
        className="!bg-transparent !border-transparent !w-3 !h-3"
        style={{ opacity: 0 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="source-right"
        className="!bg-transparent !border-transparent !w-3 !h-3"
        style={{ opacity: 0 }}
      />
    </motion.div>
  );
}

export const AgentNode = React.memo(AgentNodeInner);
