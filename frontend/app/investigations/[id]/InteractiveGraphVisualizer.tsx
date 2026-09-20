'use client';

import React, { useState } from 'react';
import { Network, Filter, User, Building, Briefcase, Calendar, Globe, Sparkles } from 'lucide-react';
import { GraphData, GraphNode } from '../../../lib/api';

interface Props {
  graph: GraphData;
}

export default function InteractiveGraphVisualizer({ graph }: Props) {
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  const { nodes, edges } = graph;

  const nodeTypes = Array.from(new Set(nodes.map(n => n.type)));
  const filteredNodes = selectedType === 'ALL' ? nodes : nodes.filter(n => n.type === selectedType);
  const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
  const filteredEdges = edges.filter(e => filteredNodeIds.has(e.source) || filteredNodeIds.has(e.target));

  // Circular Layout Calculation for SVG
  const width = 600;
  const height = 340;
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(cx, cy) - 60;

  const nodeCoords = new Map<string, { x: number; y: number }>();
  filteredNodes.forEach((node, idx) => {
    const angle = (idx / (filteredNodes.length || 1)) * 2 * Math.PI - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    nodeCoords.set(node.id, { x, y });
  });

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'Person':
        return '#06b6d4'; // cyan
      case 'Organization':
        return '#3b82f6'; // blue
      case 'Project':
        return '#10b981'; // emerald
      case 'Event':
        return '#a855f7'; // purple
      default:
        return '#64748b'; // slate
    }
  };

  return (
    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-900 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Network className="w-4 h-4" />
            <span>Interactive Relationship Entity Graph</span>
          </div>
          <h3 className="text-xl font-extrabold text-white">Identity Correlation Network</h3>
        </div>

        {/* Entity Type Filter */}
        <div className="flex items-center space-x-2 overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <button
            onClick={() => setSelectedType('ALL')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition ${
              selectedType === 'ALL' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            All Nodes ({nodes.length})
          </button>
          {nodeTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                selectedType === type ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* SVG Interactive Canvas */}
        <div className="lg:col-span-2 bg-slate-900/80 rounded-xl border border-slate-800 p-4 relative overflow-hidden flex justify-center items-center">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[320px]">
            {/* Edges */}
            {filteredEdges.map((edge) => {
              const sourcePos = nodeCoords.get(edge.source);
              const targetPos = nodeCoords.get(edge.target);
              if (!sourcePos || !targetPos) return null;
              const isSelected = selectedNode && (selectedNode.id === edge.source || selectedNode.id === edge.target);

              return (
                <g key={edge.id}>
                  <line
                    x1={sourcePos.x}
                    y1={sourcePos.y}
                    x2={targetPos.x}
                    y2={targetPos.y}
                    stroke={isSelected ? '#06b6d4' : '#334155'}
                    strokeWidth={isSelected ? 3 : 1.5}
                    strokeDasharray={edge.confidence < 0.8 ? '4,4' : 'none'}
                  />
                  {/* Relationship label */}
                  <text
                    x={(sourcePos.x + targetPos.x) / 2}
                    y={(sourcePos.y + targetPos.y) / 2 - 4}
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {edge.relationship_type}
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {filteredNodes.map((node) => {
              const pos = nodeCoords.get(node.id);
              if (!pos) return null;
              const isSelected = selectedNode?.id === node.id;
              const color = getNodeColor(node.type);

              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer group"
                >
                  <circle
                    r={isSelected ? 18 : 14}
                    fill={color}
                    fillOpacity="0.2"
                    stroke={color}
                    strokeWidth={isSelected ? 3 : 2}
                    className="transition-all duration-200 group-hover:scale-110"
                  />
                  <circle r="4" fill={color} />
                  <text
                    y={24}
                    fill="#f8fafc"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="pointer-events-none"
                  >
                    {node.label.length > 18 ? `${node.label.substring(0, 16)}...` : node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Node Details Sidepanel */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Entity Inspector</span>
          </h4>

          {selectedNode ? (
            <div className="space-y-3">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{selectedNode.type} Entity</span>
                <h5 className="font-extrabold text-white text-base mt-0.5">{selectedNode.label}</h5>
                <p className="text-xs font-mono text-slate-500 mt-1">ID: {selectedNode.id}</p>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Connected Relationships</span>
                {edges
                  .filter((e) => e.source === selectedNode.id || e.target === selectedNode.id)
                  .map((e) => (
                    <div key={e.id} className="p-2.5 bg-slate-950 rounded border border-slate-800 text-xs text-slate-300">
                      <span className="font-mono font-bold text-cyan-400">{e.relationship_type}</span>
                      <span className="text-slate-400 block text-[10px]">Confidence: {Math.round(e.confidence * 100)}%</span>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-slate-500 text-xs leading-relaxed">
              Click on any node in the relationship network to inspect its connected graph entities and relationship claims.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
