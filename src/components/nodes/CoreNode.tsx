'use client';

import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Brain } from 'lucide-react';
import { motion } from 'framer-motion';

function CoreNodeInner(_props: NodeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative"
    >
      <div
        className="relative rounded-3xl p-8 text-center animate-pulse-glow cursor-pointer"
        style={{
          background:
            'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 50%, rgba(59, 130, 246, 0.15) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '2px solid rgba(99, 102, 241, 0.3)',
          minWidth: 220,
        }}
      >
        <div className="flex items-center justify-center mb-3">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background:
                'linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.3))',
              border: '1px solid rgba(99, 102, 241, 0.4)',
            }}
          >
            <Brain className="w-8 h-8 text-indigo-400" />
          </div>
        </div>
        <h2 className="text-lg font-semibold text-white tracking-tight">
          Kiptra AI
        </h2>
        <p className="text-xs text-slate-400 mt-1">AI Agent Platform</p>
      </div>
      <Handle
        type="source"
        position={Position.Top}
        className="!bg-indigo-500 !border-indigo-400 !w-2 !h-2"
        style={{ opacity: 0 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-indigo-500 !border-indigo-400 !w-2 !h-2"
        style={{ opacity: 0 }}
      />
      <Handle
        type="source"
        position={Position.Left}
        className="!bg-indigo-500 !border-indigo-400 !w-2 !h-2"
        style={{ opacity: 0 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-indigo-500 !border-indigo-400 !w-2 !h-2"
        style={{ opacity: 0 }}
      />
    </motion.div>
  );
}

export const CoreNode = React.memo(CoreNodeInner);
