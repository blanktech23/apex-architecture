'use client';

import React, { useMemo, useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  type Node,
  type Edge,
  type NodeTypes,
  type EdgeTypes,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { CoreNode } from '@/components/nodes/CoreNode';
import { AgentNode } from '@/components/nodes/AgentNode';
import { IntegrationNode } from '@/components/nodes/IntegrationNode';
import { HumanNode } from '@/components/nodes/HumanNode';
import { AnimatedEdge } from '@/components/AnimatedEdge';
import { DetailPanel } from '@/components/DetailPanel';
import { agents } from '@/data/agents';
import { integrations } from '@/data/integrations';
import type { TabId } from '@/components/NavigationTabs';

const nodeTypes: NodeTypes = {
  core: CoreNode,
  agent: AgentNode,
  integration: IntegrationNode,
  human: HumanNode,
};

const edgeTypes: EdgeTypes = {
  animated: AnimatedEdge,
};

// Position agents in inner ring at 60deg intervals
// Agents: 0°=Discovery, 60°=Design, 120°=Orchestrator, 180°=Estimate, 240°=Ops, 300°=ExecNav
const INNER_RADIUS = 320;
const CENTER_X = 0;
const CENTER_Y = 0;

function polarToXY(radius: number, angleDeg: number): { x: number; y: number } {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return {
    x: CENTER_X + radius * Math.cos(rad),
    y: CENTER_Y + radius * Math.sin(rad),
  };
}

// Integration positions — per-integration radius + angle for a balanced, compact layout
// Single-agent integrations sit closer; multi-agent ones (jobtread, quickbooks) sit slightly further
const integrationPositions: Record<string, { angle: number; radius: number }> = {
  calendar: { angle: 348, radius: 520 },    // near Discovery (0°)
  crm:      { angle: 12,  radius: 520 },    // near Discovery (0°)
  email:    { angle: 38,  radius: 560 },    // between Discovery & Design — extra radius to clear CRM
  drive:    { angle: 52,  radius: 520 },    // near Design (60°)
  jobtread: { angle: 90,  radius: 560 },    // between Design (60°) & Orchestrator (120°) — connects to 4 agents
  weather:  { angle: 140, radius: 500 },    // near Orchestrator (120°)
  quickbooks: { angle: 210, radius: 550 },  // between Estimate (180°) & Ops (240°) — connects to 4 agents
};

function buildNodes(activeTab: TabId): Node[] {
  const nodes: Node[] = [];

  // Core node
  nodes.push({
    id: 'core',
    type: 'core',
    position: { x: CENTER_X - 110, y: CENTER_Y - 55 },
    data: { label: 'Apex Intelligence' },
    draggable: true,
  });

  // Agent nodes in inner ring
  agents.forEach((agent, i) => {
    const angle = i * 60;
    const pos = polarToXY(INNER_RADIUS, angle);
    const dimmed = false;

    nodes.push({
      id: agent.id,
      type: 'agent',
      position: { x: pos.x - 100, y: pos.y - 40 },
      data: {
        label: agent.name,
        subtitle: agent.subtitle,
        description: agent.description,
        color: agent.color,
        icon: agent.icon,
        agentId: agent.id,
      },
      style: dimmed ? { opacity: 0.3, transition: 'opacity 0.3s' } : { transition: 'opacity 0.3s' },
      draggable: true,
    });
  });

  // Integration nodes in outer ring (per-integration radius)
  integrations.forEach((integration) => {
    const posData = integrationPositions[integration.id] ?? { angle: 0, radius: 540 };
    const pos = polarToXY(posData.radius, posData.angle);
    const dimmed = false;

    nodes.push({
      id: integration.id,
      type: 'integration',
      position: { x: pos.x - 85, y: pos.y - 22 },
      data: {
        label: integration.name,
        description: integration.description,
        color: integration.color,
        icon: integration.icon,
      },
      style: dimmed ? { opacity: 0.3, transition: 'opacity 0.3s' } : { transition: 'opacity 0.3s' },
      draggable: true,
    });
  });

  // Human touchpoint nodes — between outer ring and agents, on the left side
  const humanNodes = [
    {
      id: 'ceo-review',
      label: 'CEO Review',
      description: 'Final decisions & approvals',
      angle: 275,
      radius: 500,
    },
    {
      id: 'approval-queue',
      label: 'Approval Queue',
      description: 'Pending human actions',
      angle: 230,
      radius: 500,
    },
  ];

  humanNodes.forEach((hn) => {
    const pos = polarToXY(hn.radius, hn.angle);
    nodes.push({
      id: hn.id,
      type: 'human',
      position: { x: pos.x - 80, y: pos.y - 20 },
      data: { label: hn.label, description: hn.description },
      draggable: true,
    });
  });

  return nodes;
}

// Edge label mappings for data flow descriptions
const coreToAgentLabels: Record<string, string> = {
  'discovery-concierge': 'Lead routing',
  'design-spec-assistant': 'Design tasks',
  'project-orchestrator': 'Project updates',
  'estimate-engine': 'Cost data',
  'operations-controller': 'Financial ops',
  'executive-navigator': 'Intelligence feed',
};

const agentToIntegrationLabels: Record<string, string> = {
  'discovery-concierge:crm': 'Lead records',
  'discovery-concierge:email': 'Draft responses',
  'discovery-concierge:calendar': 'Consultations',
  'design-spec-assistant:jobtread': 'Selection specs',
  'design-spec-assistant:drive': 'Submittals & docs',
  'design-spec-assistant:email': 'PO drafts',
  'project-orchestrator:jobtread': 'Schedule tracking',
  'project-orchestrator:weather': 'Site forecasts',
  'project-orchestrator:quickbooks': 'Budget monitoring',
  'estimate-engine:jobtread': 'Estimate data',
  'estimate-engine:quickbooks': 'Cost history',
  'operations-controller:quickbooks': 'AR/AP tracking',
  'operations-controller:drive': 'Compliance docs',
  'executive-navigator:jobtread': 'Portfolio data',
  'executive-navigator:quickbooks': 'Financial rollup',
};

function buildEdges(): Edge[] {
  const edges: Edge[] = [];

  // Core to agents — faster animation, thicker stroke
  agents.forEach((agent) => {
    edges.push({
      id: `core-${agent.id}`,
      source: 'core',
      target: agent.id,
      type: 'animated',
      data: {
        color: agent.color,
        label: coreToAgentLabels[agent.id] || '',
        strokeWidth: 2.5,
        animationDuration: 2,
      },
    });
  });

  // Agents to integrations — slower animation, thinner stroke
  agents.forEach((agent) => {
    agent.integrations.forEach((intId) => {
      edges.push({
        id: `${agent.id}-${intId}`,
        source: agent.id,
        target: intId,
        type: 'animated',
        data: {
          color: `${agent.color}80`,
          label: agentToIntegrationLabels[`${agent.id}:${intId}`] || '',
          strokeWidth: 1.5,
          animationDuration: 4,
        },
      });
    });
  });

  // Human touchpoints
  edges.push({
    id: 'exec-nav-ceo',
    source: 'executive-navigator',
    target: 'ceo-review',
    type: 'animated',
    data: {
      color: '#eab30880',
      label: 'Escalations',
      strokeWidth: 1.5,
      animationDuration: 3,
    },
  });

  // Multiple agents connect to approval queue
  ['discovery-concierge', 'operations-controller', 'estimate-engine'].forEach(
    (agentId) => {
      const agent = agents.find((a) => a.id === agentId);
      edges.push({
        id: `${agentId}-approval`,
        source: agentId,
        target: 'approval-queue',
        type: 'animated',
        data: {
          color: `${agent?.color || '#ffffff'}40`,
          label: 'Pending approvals',
          strokeWidth: 1.5,
          animationDuration: 4,
        },
      });
    }
  );

  return edges;
}

interface ArchitectureFlowProps {
  activeTab: TabId;
  selectedId?: string | null;
  selectedType?: 'agent' | 'integration' | 'human' | null;
  onSelect?: (id: string, type: 'agent' | 'integration' | 'human') => void;
  onDeselect?: () => void;
}

// Build a lookup: for each agent, which integration IDs does it connect to?
const agentIntegrationMap = new Map<string, Set<string>>();
agents.forEach((agent) => {
  agentIntegrationMap.set(agent.id, new Set(agent.integrations));
});

// For each integration, which agents connect to it?
const integrationAgentMap = new Map<string, Set<string>>();
integrations.forEach((integration) => {
  const agentSet = new Set<string>();
  agents.forEach((agent) => {
    if (agent.integrations.includes(integration.id)) agentSet.add(agent.id);
  });
  integrationAgentMap.set(integration.id, agentSet);
});

// Human node → connected agents
const humanAgentMap: Record<string, string[]> = {
  'approval-queue': ['discovery-concierge', 'operations-controller', 'estimate-engine'],
  'ceo-review': ['executive-navigator'],
};

export function ArchitectureFlow({ activeTab, selectedId = null, selectedType = null, onSelect, onDeselect }: ArchitectureFlowProps) {
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null);
  const [internalSelectedType, setInternalSelectedType] = useState<'agent' | 'integration' | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 640);
  }, []);

  const effectiveId = onSelect ? selectedId : internalSelectedId;
  const effectiveType = onSelect ? selectedType : internalSelectedType;

  const initialNodes = useMemo(() => buildNodes(activeTab), [activeTab]);
  const initialEdges = useMemo(() => buildEdges(), []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const integrationIds = useMemo(() => new Set(integrations.map((i) => i.id)), []);
  const agentIds = useMemo(() => new Set(agents.map((a) => a.id)), []);
  const humanNodeIds = useMemo(() => new Set(['ceo-review', 'approval-queue']), []);

  // Determine which nodes are "related" to the hovered node
  const getRelatedNodeIds = useCallback((nodeId: string): Set<string> => {
    const related = new Set<string>();
    related.add(nodeId);
    related.add('core');

    if (agentIds.has(nodeId)) {
      // Hovering an agent: show its integrations + human nodes it connects to
      const intIds = agentIntegrationMap.get(nodeId);
      intIds?.forEach((id) => related.add(id));
      // Check if this agent connects to human nodes
      for (const [humanId, agentList] of Object.entries(humanAgentMap)) {
        if (agentList.includes(nodeId)) related.add(humanId);
      }
    } else if (integrationIds.has(nodeId)) {
      // Hovering an integration: show the agents that connect to it
      const agentSet = integrationAgentMap.get(nodeId);
      agentSet?.forEach((id) => related.add(id));
    } else if (humanNodeIds.has(nodeId)) {
      // Hovering a human node: show its connected agents
      const connectedAgents = humanAgentMap[nodeId] || [];
      connectedAgents.forEach((id) => related.add(id));
    }

    return related;
  }, [agentIds, integrationIds, humanNodeIds]);

  // Update edges based on hover state
  useEffect(() => {
    setEdges((currentEdges) =>
      currentEdges.map((edge) => {
        const isCoreToAgent = edge.source === 'core';
        const isAgentToIntegration = agentIds.has(edge.source) && integrationIds.has(edge.target);

        if (!hoveredNodeId) {
          // No hover: show only core→agent edges, hide everything else
          return {
            ...edge,
            data: {
              ...edge.data,
              hidden: !isCoreToAgent,
              highlighted: false,
            },
          };
        }

        // Something is hovered — only show edges where BOTH ends are related
        const related = getRelatedNodeIds(hoveredNodeId);
        const isRelatedEdge = related.has(edge.source) && related.has(edge.target);

        return {
          ...edge,
          data: {
            ...edge.data,
            hidden: !isRelatedEdge,
            highlighted: isRelatedEdge,
          },
        };
      })
    );
  }, [hoveredNodeId, setEdges, getRelatedNodeIds, agentIds, integrationIds, humanNodeIds]);

  // Update node opacity based on hover
  useEffect(() => {
    if (!hoveredNodeId) {
      setNodes((currentNodes) =>
        currentNodes.map((node) => ({
          ...node,
          style: { ...node.style, opacity: 1, transition: 'opacity 0.3s' },
        }))
      );
      return;
    }

    const related = getRelatedNodeIds(hoveredNodeId);
    setNodes((currentNodes) =>
      currentNodes.map((node) => ({
        ...node,
        style: {
          ...node.style,
          opacity: related.has(node.id) ? 1 : 0.15,
          transition: 'opacity 0.3s',
        },
      }))
    );
  }, [hoveredNodeId, setNodes, getRelatedNodeIds]);

  const onNodeMouseEnter = useCallback((_event: React.MouseEvent, node: Node) => {
    if (node.id !== 'core') setHoveredNodeId(node.id);
  }, []);

  const onNodeMouseLeave = useCallback(() => {
    setHoveredNodeId(null);
  }, []);

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      const isAgent = agentIds.has(node.id);
      const isIntegration = integrationIds.has(node.id);
      const isHuman = humanNodeIds.has(node.id);

      if (isAgent) {
        if (onSelect) {
          onSelect(node.id, 'agent');
        } else {
          setInternalSelectedId(node.id);
          setInternalSelectedType('agent');
        }
      } else if (isIntegration) {
        if (onSelect) {
          onSelect(node.id, 'integration');
        } else {
          setInternalSelectedId(node.id);
          setInternalSelectedType('integration');
        }
      } else if (isHuman) {
        if (onSelect) {
          onSelect(node.id, 'human');
        } else {
          setInternalSelectedId(node.id);
          setInternalSelectedType(null);
        }
      }
    },
    [onSelect, agentIds, integrationIds, humanNodeIds]
  );

  const handleClose = useCallback(() => {
    if (onDeselect) {
      onDeselect();
    } else {
      setInternalSelectedId(null);
      setInternalSelectedType(null);
    }
  }, [onDeselect]);

  if (!mounted) {
    return (
      <div className="w-full h-full relative flex items-center justify-center">
        <div className="text-white/40 text-sm">Loading architecture...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={onNodeClick}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        fitView={!isMobile}
        fitViewOptions={{ padding: 0.05 }}
        defaultViewport={isMobile ? { x: 195, y: 220, zoom: 0.38 } : undefined}
        minZoom={0.15}
        maxZoom={1.5}
        colorMode="dark"
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="rgba(255,255,255,0.03)" />
        <Controls position="bottom-left" />
        <MiniMap
          position="bottom-right"
          nodeColor={(node) => {
            if (node.type === 'core') return '#6366f1';
            if (node.type === 'agent') {
              const data = node.data as { color?: string };
              return data?.color || '#6366f1';
            }
            if (node.type === 'human') return '#f59e0b';
            return '#475569';
          }}
          maskColor="rgba(0, 0, 0, 0.7)"
          pannable
          zoomable
        />
      </ReactFlow>
      <DetailPanel selectedId={effectiveId ?? null} selectedType={effectiveType ?? null} onClose={handleClose} />
    </div>
  );
}
