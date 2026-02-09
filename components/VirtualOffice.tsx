"use client";

import React, { useEffect, useState } from 'react';
import { UserCheck, Brain, Search, PenTool, Share2, ShieldAlert } from 'lucide-react';

const AGENT_ICONS = {
  minion: <UserCheck size={24} />,
  sage: <Brain size={24} />,
  scout: <Search size={24} />,
  quill: <PenTool size={24} />,
  xalt: <Share2 size={24} />,
  observer: <ShieldAlert size={24} />,
};

const AGENT_COLORS = {
  minion: 'bg-purple-500',
  sage: 'bg-blue-500',
  scout: 'bg-gray-500',
  quill: 'bg-green-500',
  xalt: 'bg-red-500',
  observer: 'bg-orange-500',
};

const LOCATIONS = [
  { name: 'Meeting Table', x: 50, y: 50 },
  { name: 'Server Rack', x: 10, y: 20 },
  { name: 'Coffee Machine', x: 85, y: 80 },
  { name: 'War Room Screen', x: 50, y: 10 },
  { name: 'Research Desk', x: 20, y: 70 },
  { name: 'Defense Perimeter', x: 80, y: 20 },
];

export const VirtualOffice: React.FC<{ agents: any[] }> = ({ agents }) => {
  const [positions, setPositions] = useState<Record<string, { x: number, y: number }>>({});

  useEffect(() => {
    // Initial random positions
    const initialPos: any = {};
    agents.forEach(a => {
      const loc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
      initialPos[a.id] = { x: loc.x, y: loc.y };
    });
    setPositions(initialPos);

    // Randomly move agents every few seconds
    const interval = setInterval(() => {
      setPositions(prev => {
        const next = { ...prev };
        const agentToMove = agents[Math.floor(Math.random() * agents.length)];
        if (agentToMove) {
          const loc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
          next[agentToMove.id] = { x: loc.x, y: loc.y };
        }
        return next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [agents]);

  return (
    <div className="relative w-full h-[400px] bg-ink-900 border-4 border-black overflow-hidden bg-grid-pattern shadow-inner">
      {/* Office Background Decorations */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-black/50 border-2 border-green-900 text-[10px] font-black text-green-500 uppercase">
        Section 9 Tactical Hub // Main Floor
      </div>

      {/* Locations */}
      {LOCATIONS.map(loc => (
        <div 
          key={loc.name}
          className="absolute border-2 border-white/10 p-2 text-[8px] font-bold text-white/20 uppercase"
          style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
        >
          {loc.name}
        </div>
      ))}

      {/* Agents */}
      {agents.map(agent => {
        const pos = positions[agent.id] || { x: 50, y: 50 };
        return (
          <div 
            key={agent.id}
            className="absolute transition-all duration-1000 ease-in-out flex flex-col items-center group"
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, zIndex: 50 }}
          >
            {/* Thinking Bubble (only when online) */}
            <div className={`mb-2 px-2 py-1 bg-white border-2 border-black text-[8px] font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap`}>
              {agent.status === 'thinking' ? '💡 BRAINSTORMING...' : '📡 STANDBY'}
            </div>
            
            {/* Agent Body */}
            <div className={`w-10 h-10 ${AGENT_COLORS[agent.id as keyof typeof AGENT_COLORS] || 'bg-white'} border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-white animate-bounce`} style={{ animationDuration: '2s' }}>
              {AGENT_ICONS[agent.id as keyof typeof AGENT_ICONS]}
            </div>
            
            {/* Name Tag */}
            <div className="mt-1 px-1 bg-black text-white text-[8px] font-bold uppercase tracking-tighter">
              {agent.name}
            </div>
          </div>
        );
      })}

      {/* Connection Lines (SVG) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        {/* We could draw dynamic lines here between agents who are communicating */}
      </svg>
    </div>
  );
};
