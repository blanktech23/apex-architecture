'use client';

import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

type IconName = keyof typeof LucideIcons;

interface IntegrationNodeData {
  label: string;
  description: string;
  color: string;
  icon: string;
  [key: string]: unknown;
}

function IntegrationNodeInner({ data }: NodeProps & { data: IntegrationNodeData }) {
  const nodeData = data as IntegrationNodeData;
  const IconComponent = (LucideIcons[nodeData.icon as IconName] as unknown as LucideIcon) || LucideIcons.Circle;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
      whileHover={{ scale: 1.08 }}
      className="cursor-pointer"
    >
      <div
        className="rounded-xl px-4 py-3 flex items-center gap-3 transition-all duration-300"
        style={{
          background: 'rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: `1px solid ${nodeData.color}20`,
          minWidth: 160,
        }}
      >
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{
            background: `${nodeData.color}15`,
            border: `1px solid ${nodeData.color}35`,
          }}
        >
          <IconComponent className="w-4.5 h-4.5" color={nodeData.color} />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-200">{nodeData.label}</p>
          <p className="text-[10px] text-slate-500">{nodeData.description}</p>
        </div>
        <div
          className="w-1.5 h-1.5 rounded-full ml-auto shrink-0"
          style={{ background: nodeData.color, opacity: 0.6 }}
        />
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent !border-transparent"
        style={{ opacity: 0 }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        className="!bg-transparent !border-transparent"
        style={{ opacity: 0 }}
      />
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-transparent !border-transparent"
        style={{ opacity: 0 }}
      />
      <Handle
        type="target"
        position={Position.Right}
        className="!bg-transparent !border-transparent"
        style={{ opacity: 0 }}
      />
    </motion.div>
  );
}

export const IntegrationNode = React.memo(IntegrationNodeInner);
