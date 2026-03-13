'use client';

import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

interface HumanNodeData {
  label: string;
  description: string;
  [key: string]: unknown;
}

function HumanNodeInner({ data }: NodeProps & { data: HumanNodeData }) {
  const nodeData = data as HumanNodeData;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
      className="cursor-pointer"
    >
      <div
        className="rounded-xl px-4 py-3 flex items-center gap-3"
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '2px dashed rgba(255, 255, 255, 0.15)',
          minWidth: 160,
        }}
      >
        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-amber-500/10 border border-amber-500/30">
          <User className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <p className="text-xs font-medium text-amber-300">{nodeData.label}</p>
          <p className="text-[9px] text-slate-500">{nodeData.description}</p>
        </div>
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

export const HumanNode = React.memo(HumanNodeInner);
