"use client";

import React, { useEffect, useState } from 'react';
import { UserCheck, Brain, Search, PenTool, Share2, ShieldAlert } from 'lucide-react';

const AGENT_DATA: Record<string, any> = {
  minion: { color: '#9333ea', hair: 'bg-black', accessory: 'glasses', name: 'ARAMAKI' },
  sage: { color: '#2563eb', hair: 'bg-zinc-400', accessory: 'headset', name: 'ISHIKAWA' },
  scout: { color: '#4b5563', hair: 'bg-white', accessory: 'buff', name: 'BATOU' },
  quill: { color: '#16a34a', hair: 'bg-amber-900', accessory: 'tie', name: 'TOGUSA' },
  xalt: { color: '#dc2626', hair: 'bg-zinc-800', accessory: 'patch', name: 'SAITO' },
  observer: { color: '#ea580c', hair: 'bg-zinc-900', accessory: 'mask', name: 'BORMA' },
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
  const [tachikomas, setTachikomas] = useState<any[]>([
    { id: 'tachi-1', x: 20, y: 20, state: 'Curious' },
    { id: 'tachi-2', x: 70, y: 80, state: 'Oil Time' }
  ]);

  useEffect(() => {
    const initialPos: any = {};
    agents.forEach((a, i) => {
      const loc = LOCATIONS[i % LOCATIONS.length];
      initialPos[a.id] = { x: loc.x, y: loc.y };
    });
    setPositions(initialPos);

    const interval = setInterval(() => {
      // Move one random agent
      if (agents.length > 0) {
        const luckyAgent = agents[Math.floor(Math.random() * agents.length)];
        setPositions(prev => ({
          ...prev,
          [luckyAgent.id]: {
            x: Math.min(90, Math.max(10, prev[luckyAgent.id]?.x + (Math.random() * 30 - 15) || 50)),
            y: Math.min(85, Math.max(10, prev[luckyAgent.id]?.y + (Math.random() * 30 - 15) || 50))
          }
        }));
      }

      // Move Tachikomas
      setTachikomas(prev => prev.map(t => ({
        ...t,
        x: Math.min(90, Math.max(5, t.x + (Math.random() * 40 - 20))),
        y: Math.min(90, Math.max(5, t.y + (Math.random() * 40 - 20))),
        state: Math.random() > 0.7 ? ['Syncing Ghost', 'Oil Sample', 'Spinning!', 'Hello Commander!'][Math.floor(Math.random()*4)] : t.state
      })));
    }, 6000);

    return () => clearInterval(interval);
  }, [agents]);

  return (
    <div className="relative w-full h-[550px] bg-ink-950 border-4 border-black overflow-hidden shadow-2xl">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      {/* HUD Header */}
      <div className="absolute top-0 w-full p-2 bg-black/80 border-b-2 border-green-900/50 flex justify-between items-center z-[60] font-mono">
        <div className="text-[8px] font-black text-green-500 uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
          Section 9 Tactical Hub // Sub-Level 04 // Surveillance_Active
        </div>
      </div>

      {/* Background Locations */}
      {LOCATIONS.map(loc => (
        <div 
          key={loc.name}
          className="absolute border border-white/5 p-3 rounded-sm flex flex-col items-center justify-center opacity-20"
          style={{ left: `${loc.x}%`, top: `${loc.y}%`, transform: 'translate(-50%, -50%)' }}
        >
          <div className="text-[7px] font-bold text-white uppercase">{loc.name}</div>
        </div>
      ))}

      {/* Tachikomas! */}
      {tachikomas.map(t => (
        <div 
          key={t.id}
          className="absolute transition-all duration-[4000ms] ease-in-out z-40 flex flex-col items-center group"
          style={{ left: `${t.x}%`, top: `${t.y}%`, transform: 'translate(-50%, -50%)' }}
        >
          <div className="absolute -top-8 px-2 py-1 bg-blue-500 text-white text-[7px] font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {t.state}
          </div>
          {/* CSS Tachikoma */}
          <div className="relative w-10 h-10 animate-bounce" style={{ animationDuration: '3s' }}>
            <div className="w-8 h-6 bg-blue-600 border-2 border-black rounded-full relative shadow-lg">
                <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full border border-black"></div>
                <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full border border-black"></div>
                <div className="absolute -bottom-1 left-1 w-2 h-2 bg-zinc-800 rounded-full"></div>
                <div className="absolute -bottom-1 right-1 w-2 h-2 bg-zinc-800 rounded-full"></div>
            </div>
            <div className="absolute -right-2 top-1 w-4 h-4 bg-blue-700 border-2 border-black rounded-full"></div>
          </div>
          <div className="mt-1 text-[6px] font-black text-blue-400 uppercase tracking-tighter">TACHIKOMA</div>
        </div>
      ))}

      {/* Agents */}
      {agents.map(agent => {
        const pos = positions[agent.id] || { x: 50, y: 50 };
        const meta = AGENT_DATA[agent.id] || { color: '#ccc', hair: 'bg-zinc-500' };
        const isThinking = agent.status === 'thinking' || agent.status === 'syncing';
        
        return (
          <div 
            key={agent.id}
            className="absolute transition-all duration-[3000ms] ease-in-out flex flex-col items-center group cursor-help z-50"
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            {/* Holographic Speech Bubble */}
            <div className={`absolute -top-16 px-3 py-2 bg-black/90 border border-accent text-[9px] font-bold text-accent min-w-[120px] max-w-[200px] shadow-[0_0_10px_rgba(255,87,34,0.3)] transition-all duration-500 origin-bottom scale-0 group-hover:scale-100 z-[100] ${isThinking ? 'border-dashed animate-pulse' : ''}`}>
              <div className="text-[7px] opacity-50 mb-1 border-b border-accent/20">LOG_FRAGMENT //</div>
              <div className="line-clamp-3 italic">"{agent.lastAction || "System on standby."}"</div>
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-black border-r border-b border-accent rotate-45"></div>
            </div>
            
            {/* Custom Pixel Character */}
            <div className="relative">
                {isThinking && <div className="absolute inset-[-10px] bg-accent/20 rounded-full blur-md animate-pulse"></div>}
                <div className="relative w-12 h-14 flex flex-col items-center">
                    {/* Unique Hair/Head for each */}
                    <div className={`w-6 h-6 bg-ink-200 border-2 border-black rounded-sm relative overflow-hidden`}>
                        <div className={`absolute top-0 w-full h-2 ${meta.hair}`}></div>
                        <div className="absolute top-2.5 w-full flex justify-around px-1">
                            <div className="w-1 h-1 bg-black"></div>
                            <div className="w-1 h-1 bg-black"></div>
                        </div>
                        {/* Accessory */}
                        {meta.accessory === 'glasses' && <div className="absolute top-2.5 w-full h-1 bg-black/40"></div>}
                        {meta.accessory === 'patch' && <div className="absolute top-2.5 right-1 w-1.5 h-1.5 bg-black"></div>}
                    </div>
                    {/* Body */}
                    <div className={`w-10 h-8 ${meta.color} border-2 border-black rounded-t-lg -mt-1 relative`}>
                        {meta.accessory === 'tie' && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-3 bg-red-800"></div>}
                        <div className="absolute inset-0 flex items-center justify-center text-white/20 text-[8px] font-black uppercase">
                            {meta.name.substring(0,2)}
                        </div>
                    </div>
                    {/* Legs */}
                    <div className="flex gap-2 -mt-0.5">
                        <div className="w-3 h-2 bg-black rounded-b-sm animate-bounce"></div>
                        <div className="w-3 h-2 bg-black rounded-b-sm animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                </div>
            </div>
            
            <div className={`mt-2 px-2 py-0.5 border border-black text-[8px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${isThinking ? 'bg-accent text-white' : 'bg-white text-black'}`}>
              {agent.name}
            </div>
          </div>
        );
      })}
    </div>
  );
};
