'use client';

import React, { useState } from 'react';
import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/react';

interface AnimatedEdgeData {
  color?: string;
  label?: string;
  strokeWidth?: number;
  animationDuration?: number;
  hidden?: boolean;
  highlighted?: boolean;
}

function AnimatedEdgeInner({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  data,
}: EdgeProps) {
  const [hovered, setHovered] = useState(false);

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const edgeData = data as AnimatedEdgeData | undefined;
  const color = edgeData?.color || 'rgba(99, 102, 241, 0.4)';
  const label = edgeData?.label || '';
  const baseStrokeWidth = edgeData?.strokeWidth || 1.5;
  const duration = edgeData?.animationDuration || 3;
  const isHidden = edgeData?.hidden ?? false;
  const isHighlighted = edgeData?.highlighted ?? false;

  if (isHidden) return null;

  const strokeWidth = hovered ? baseStrokeWidth + 1.5 : isHighlighted ? baseStrokeWidth + 0.5 : baseStrokeWidth;
  const opacity = hovered ? 0.85 : isHighlighted ? 0.7 : 0.5;
  const particleRadius = hovered ? 4 : 3;

  // Midpoint for label positioning
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;

  return (
    <>
      {/* Invisible wider path for easier hover targeting */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ cursor: 'pointer' }}
      />
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          ...style,
          stroke: color,
          strokeWidth,
          strokeDasharray: '6 4',
          opacity,
          transition: 'stroke-width 0.2s, opacity 0.2s',
          pointerEvents: 'none',
        }}
      />
      {/* Primary particle */}
      <circle r={particleRadius} fill={color} style={{ transition: 'r 0.2s' }}>
        <animateMotion
          dur={`${duration}s`}
          repeatCount="indefinite"
          path={edgePath}
        />
      </circle>
      {/* Secondary particle (offset) */}
      <circle r={particleRadius} fill={color} opacity="0.4" style={{ transition: 'r 0.2s' }}>
        <animateMotion
          dur={`${duration}s`}
          repeatCount="indefinite"
          path={edgePath}
          begin={`${duration / 2}s`}
        />
      </circle>
      {/* Hover label */}
      {hovered && label && (
        <g>
          <rect
            x={midX - label.length * 3.8}
            y={midY - 22}
            width={label.length * 7.6}
            height={20}
            rx={4}
            fill="rgba(15, 23, 42, 0.9)"
            stroke={color}
            strokeWidth={0.5}
          />
          <text
            x={midX}
            y={midY - 9}
            textAnchor="middle"
            fill="rgba(255, 255, 255, 0.9)"
            fontSize={11}
            fontFamily="system-ui, sans-serif"
            style={{ pointerEvents: 'none' }}
          >
            {label}
          </text>
        </g>
      )}
    </>
  );
}

export const AnimatedEdge = React.memo(AnimatedEdgeInner);
