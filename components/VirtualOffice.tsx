"use client";

import React, { useEffect, useState } from 'react';
import { UserCheck, Brain, Search, PenTool, Share2, ShieldAlert } from 'lucide-react';

const AGENT_COLORS = {
  minion: '#9333ea', // Purple
  sage: '#2563eb',   // Blue
  scout: '#4b5563',  // Gray
  quill: '#16a34a',  // Green
  xalt: '#dc2626',   // Red
  observer: '#ea580c', // Orange
};

const LOCATIONS = [
  { name: 'Tactical Table', x: 45, y: 40 },
  { name: 'Mainframe', x: 15, y: 25 },
  { name: 'Coffee Lab', x: 80, y: 75 },
  { name: 'Global Uplink', x: 50, y: 15 },
  { name: 'Analysis Deck', x: 25, y: 65 },
  { name: 'Security Hub', x: 75, y: 25 },
];

export const VirtualOffice: React.FC<{ agents: any[] }> = ({ agents }) => {
  const [positions, setPositions] = useState<Record<string, { x: number, y: number }>>({});
  const [activeSpeaker, setActiveSpeaker] = useState<string | null>(null);

  useEffect(() => {
    // Initial organic placement
    const initialPos: any = {};
    agents.forEach((a, i) => {
      const loc = LOCATIONS[i % LOCATIONS.length];
      initialPos[a.id] = { x: loc.x, y: loc.y };
    });
    setPositions(initialPos);

    // Organic movement: only move one agent occasionally
    const interval = setInterval(() => {
      const luckyAgent = agents[Math.floor(Math.random() * agents.length)];
      if (!luckyAgent) return;

      setPositions(prev => ({
        ...prev,
        [luckyAgent.id]: {
          x: Math.min(90, Math.max(10, prev[luckyAgent.id].x + (Math.random() * 20 - 10))),
          y: Math.min(85, Math.max(10, prev[luckyAgent.id].y + (Math.random() * 20 - 10)))
        }
      }));
    }, 8000); // Much slower movement frequency

    return () => clearInterval(interval);
  }, [agents]);

  return (
    <div className="relative w-full h-[500px] bg-ink-950 border-4 border-black overflow-hidden shadow-2xl">
      {/* Grid Pattern with Glow */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-accent/10 to-transparent"></div>

      {/* Top Status Bar */}
      <div className="absolute top-0 w-full p-2 bg-black/80 border-b-2 border-green-900/50 flex justify-between items-center z-[60]">
        <div className="text-[8px] font-black text-green-500 uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
          Section 9 HQ // Sub-Level 04 // Surveillance_Active
        </div>
        <div className="text-[8px] font-black text-ink-500">
          COORD_SYS: STABLE // GHOST_COUNT: {agents.length}
        </div>
      </div>

      {/* Background Locations */}
      {LOCATIONS.map(loc => (
        <div 
          key={loc.name}
          className="absolute border border-white/5 p-3 rounded-sm flex flex-col items-center justify-center opacity-30"
          style={{ left: `${loc.x}%`, top: `${loc.y}%`, transform: 'translate(-50%, -50%)' }}
        >
          <div className="w-12 h-12 border border-dashed border-white/10 rounded-full mb-1 animate-pulse"></div>
          <div className="text-[7px] font-bold text-white uppercase">{loc.name}</div>
        </div>
      ))}

      {/* Agents as Tactical Sprites */}
      {agents.map(agent => {
        const pos = positions[agent.id] || { x: 50, y: 50 };
        const isThinking = agent.status === 'thinking' || agent.status === 'syncing';
        
        return (
          <div 
            key={agent.id}
            className="absolute transition-all duration-[3000ms] ease-in-out flex flex-col items-center group cursor-help"
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)', zIndex: 50 }}
          >
            {/* Holographic Speech Bubble */}
            <div className={`absolute -top-16 px-3 py-2 bg-black/90 border border-accent text-[9px] font-bold text-accent min-w-[120px] max-w-[200px] shadow-[0_0_10px_rgba(255,87,34,0.3)] transition-all duration-500 origin-bottom scale-0 group-hover:scale-100 z-[100] ${isThinking ? 'border-dashed animate-pulse' : ''}`}>
              <div className="text-[7px] opacity-50 mb-1 border-b border-accent/20">LOG_FRAGMENT //</div>
              <div className="line-clamp-3 italic">"{agent.lastAction || "System on standby."}"</div>
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-black border-r border-b border-accent rotate-45"></div>
            </div>
            
            {/* Tactical Sprite Body */}
            <div className="relative">
                {/* Thinking Aura */}
                {isThinking && (
                    <div className="absolute inset-[-10px] bg-accent/20 rounded-full blur-md animate-pulse"></div>
                )}
                
                {/* The "Pixel" Character */}
                <div className="relative w-12 h-14 flex flex-col items-center">
                    {/* Head */}
                    <div className="w-6 h-6 bg-ink-200 border-2 border-black rounded-sm relative overflow-hidden flex items-center justify-center">
                        <div className="absolute top-1.5 w-full flex justify-around px-1">
                            <div className="w-1.5 h-1.5 bg-black animate-pulse"></div>
                            <div className="w-1.5 h-1.5 bg-black animate-pulse"></div>
                        </div>
                        {/* Tactical Visor based on color */}
                        <div className="absolute top-1 w-full h-2 bg-black/20"></div>
                    </div>
                    {/* Body/Suit */}
                    <div className={`w-10 h-8 ${AGENT_COLORS[agent.id as keyof typeof AGENT_COLORS] || 'bg-ink-500'} border-2 border-black rounded-t-lg -mt-1 relative shadow-lg`}>
                        <div className="absolute inset-0 flex items-center justify-center text-white/30">
                            <span className="text-[10px] font-black">{agent.name.substring(0,1)}</span>
                        </div>
                    </div>
                    {/* Legs (Animation) */}
                    <div className="flex gap-2 -mt-0.5">
                        <div className="w-3 h-2 bg-black/80 rounded-b-sm animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-3 h-2 bg-black/80 rounded-b-sm animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                    </div>
                </div>
            </div>
            
            {/* ID Tag */}
            <div className={`mt-2 px-2 py-0.5 border border-black text-[8px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${isThinking ? 'bg-accent text-white' : 'bg-white text-black'}`}>
              {agent.name}
            </div>
          </div>
        );
      })}

      {/* Floor Grid Shadows */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
    </div>
  );
};
