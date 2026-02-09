"use client";

import React, { useEffect, useState, useRef } from 'react';
import { UserCheck, Brain, Search, PenTool, Share2, ShieldAlert } from 'lucide-react';

const AGENT_DATA: Record<string, any> = {
  minion: { color: '#9333ea', hair: 'bg-zinc-100', hairStyle: 'bowl', accessory: 'glasses', name: 'ARAMAKI' },
  sage: { color: '#2563eb', hair: 'bg-zinc-400', hairStyle: 'spiky', accessory: 'headset', name: 'ISHIKAWA' },
  scout: { color: '#4b5563', hair: 'bg-zinc-100', hairStyle: 'buzz', accessory: 'buff', name: 'BATOU' },
  quill: { color: '#16a34a', hair: 'bg-amber-900', hairStyle: 'long', accessory: 'tie', name: 'TOGUSA' },
  xalt: { color: '#dc2626', hair: 'bg-zinc-800', hairStyle: 'slick', accessory: 'patch', name: 'SAITO' },
  observer: { color: '#ea580c', hair: 'bg-zinc-900', hairStyle: 'flat', accessory: 'mask', name: 'BORMA' },
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
    { id: 'tachi-1', x: 25, y: 25, state: 'Syncing...' },
    { id: 'tachi-2', x: 65, y: 75, state: 'Natural Oil!' }
  ]);
  
  // Use a ref to store positions to prevent movement resets during re-renders
  const positionsRef = useRef<Record<string, { x: number, y: number }>>({});

  useEffect(() => {
    // Initialize positions if empty
    if (Object.keys(positionsRef.current).length === 0 && agents.length > 0) {
      const initialPos: any = {};
      agents.forEach((a, i) => {
        const loc = LOCATIONS[i % LOCATIONS.length];
        initialPos[a.id] = { x: loc.x, y: loc.y };
      });
      positionsRef.current = initialPos;
      setPositions(initialPos);
    }

    const moveInterval = setInterval(() => {
      // 1. Move Agents more frequently and dynamically
      setPositions(prev => {
        const next = { ...prev };
        // Choose 2 random agents to move each time
        for(let i=0; i<2; i++) {
            const luckyId = agents[Math.floor(Math.random() * agents.length)]?.id;
            if (luckyId) {
                const targetLoc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
                // Add some jitter so they don't overlap perfectly
                next[luckyId] = { 
                    x: targetLoc.x + (Math.random() * 10 - 5), 
                    y: targetLoc.y + (Math.random() * 10 - 5) 
                };
            }
        }
        return next;
      });

      // 2. Move Tachikomas with more "energy"
      setTachikomas(prev => prev.map(t => ({
        ...t,
        x: Math.min(90, Math.max(5, t.x + (Math.random() * 50 - 25))),
        y: Math.min(90, Math.max(5, t.y + (Math.random() * 50 - 25))),
        state: Math.random() > 0.8 ? ['Checking Security', 'Found a bug!', 'Processing...', 'Yay!', 'Oil Time!'][Math.floor(Math.random()*5)] : t.state
      })));
    }, 4000); // 4 seconds interval for faster "busy" feel

    return () => clearInterval(moveInterval);
  }, [agents.length]); // Only reset if agent count changes

  return (
    <div className="relative w-full h-[550px] bg-ink-950 border-4 border-black overflow-hidden shadow-inner font-mono">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
      
      {/* Background Locations */}
      {LOCATIONS.map(loc => (
        <div 
          key={loc.name}
          className="absolute border border-white/5 p-2 rounded-sm flex flex-col items-center justify-center opacity-20 pointer-events-none"
          style={{ left: `${loc.x}%`, top: `${loc.y}%`, transform: 'translate(-50%, -50%)' }}
        >
          <div className="text-[6px] font-bold text-white/50 uppercase tracking-tighter">{loc.name}</div>
        </div>
      ))}

      {/* Tachikomas */}
      {tachikomas.map(t => (
        <div 
          key={t.id}
          className="absolute transition-all duration-[3000ms] ease-in-out z-40 flex flex-col items-center group cursor-pointer"
          style={{ left: `${t.x}%`, top: `${t.y}%`, transform: 'translate(-50%, -50%)' }}
        >
          <div className="absolute -top-8 px-2 py-1 bg-blue-500 text-white text-[7px] font-black uppercase opacity-0 group-hover:opacity-100 transition-all scale-50 group-hover:scale-100 whitespace-nowrap border border-black">
            {t.state}
          </div>
          {/* Detailed CSS Tachikoma */}
          <div className="relative w-12 h-10 animate-bounce" style={{ animationDuration: '2.5s' }}>
            {/* The Pod */}
            <div className="w-10 h-7 bg-blue-600 border-2 border-black rounded-full relative overflow-hidden shadow-[0_4px_0_rgba(0,0,0,0.3)]">
                {/* Eyes */}
                <div className="absolute top-1.5 left-2 w-2 h-2 bg-white rounded-full border border-black flex items-center justify-center">
                    <div className="w-0.5 h-0.5 bg-black rounded-full"></div>
                </div>
                <div className="absolute top-1.5 right-2 w-2 h-2 bg-white rounded-full border border-black flex items-center justify-center">
                    <div className="w-0.5 h-0.5 bg-black rounded-full"></div>
                </div>
                {/* Mouth/Vent */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-1 bg-black/30 rounded-full"></div>
            </div>
            {/* Rear Pod */}
            <div className="absolute -right-1 top-0 w-5 h-5 bg-blue-700 border-2 border-black rounded-full -z-10"></div>
            {/* Legs */}
            <div className="absolute -bottom-1 left-1 w-2.5 h-2.5 bg-zinc-800 rounded-full border border-black"></div>
            <div className="absolute -bottom-1 right-1 w-2.5 h-2.5 bg-zinc-800 rounded-full border border-black"></div>
          </div>
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
            className="absolute transition-all duration-[3500ms] ease-in-out flex flex-col items-center group cursor-crosshair z-50"
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            {/* Speech Bubble */}
            <div className={`absolute -top-20 px-3 py-2 bg-white border-2 border-black text-[9px] font-bold text-black min-w-[140px] max-w-[220px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 origin-bottom scale-0 group-hover:scale-100 z-[100]`}>
              <div className="text-[7px] text-ink-400 mb-1 border-b border-black/10">ENCRYPTED_SIGNAL //</div>
              <div className="line-clamp-3">"{agent.lastAction || "Standby mode."}"</div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-2 border-b-2 border-black rotate-45"></div>
            </div>
            
            {/* Detailed Pixel Character */}
            <div className="relative">
                {isThinking && <div className="absolute inset-[-15px] bg-accent/30 rounded-full blur-xl animate-pulse"></div>}
                
                <div className="relative w-14 h-16 flex flex-col items-center">
                    {/* Head & Hair */}
                    <div className="w-8 h-8 bg-ink-100 border-2 border-black rounded-md relative shadow-sm overflow-hidden">
                        {/* Hair Styles */}
                        {meta.hairStyle === 'bowl' && <div className={`absolute top-0 w-full h-4 ${meta.hair}`}></div>}
                        {meta.hairStyle === 'spiky' && <div className={`absolute top-0 w-full h-3 flex gap-0.5`}><div className={`w-2 h-4 ${meta.hair} -rotate-12`}></div><div className={`w-2 h-4 ${meta.hair}`}></div><div className={`w-2 h-4 ${meta.hair} rotate-12`}></div></div>}
                        {meta.hairStyle === 'buzz' && <div className={`absolute top-0 w-full h-2 ${meta.hair} opacity-50`}></div>}
                        {meta.hairStyle === 'long' && <div className={`absolute top-0 w-full h-3 ${meta.hair}`}></div>}
                        
                        {/* Eyes */}
                        <div className="absolute top-4 w-full flex justify-around px-1.5">
                            <div className="w-1.5 h-1.5 bg-black rounded-sm"></div>
                            <div className="w-1.5 h-1.5 bg-black rounded-sm"></div>
                        </div>

                        {/* Accessories */}
                        {meta.accessory === 'glasses' && <div className="absolute top-4 w-full h-1 bg-black/20 border-y border-black/40"></div>}
                        {meta.accessory === 'headset' && <div className="absolute top-2 right-0 w-2 h-4 bg-zinc-700 border-l border-black"></div>}
                        {meta.accessory === 'patch' && <div className="absolute top-3.5 right-1 w-2.5 h-2.5 bg-zinc-900 rounded-full"></div>}
                        {meta.accessory === 'mask' && <div className="absolute bottom-0 w-full h-3 bg-zinc-800 border-t border-black"></div>}
                    </div>

                    {/* Body / Uniform */}
                    <div className={`w-12 h-9 ${meta.color} border-2 border-black rounded-t-xl -mt-1 relative shadow-lg`}>
                        {/* Detailings */}
                        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-white/20 rounded-full"></div>
                        {meta.accessory === 'tie' && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-4 bg-red-700 border-x border-black"></div>}
                        {meta.accessory === 'buff' && <div className="absolute top-0 w-full h-2 bg-zinc-200/30"></div>}
                        
                        <div className="absolute inset-0 flex items-center justify-center text-white/10 text-[10px] font-black">
                            {meta.name.substring(0,2)}
                        </div>
                    </div>

                    {/* Legs with walking animation */}
                    <div className="flex gap-3 -mt-1">
                        <div className="w-3.5 h-2.5 bg-zinc-900 rounded-b-md animate-bounce" style={{ animationDuration: '0.6s' }}></div>
                        <div className="w-3.5 h-2.5 bg-zinc-900 rounded-b-md animate-bounce" style={{ animationDuration: '0.6s', animationDelay: '0.3s' }}></div>
                    </div>
                </div>
            </div>
            
            {/* Tag */}
            <div className={`mt-2 px-2 py-0.5 border-2 border-black text-[8px] font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${isThinking ? 'bg-accent text-white animate-pulse' : 'bg-white text-black'}`}>
              {agent.name}
            </div>
          </div>
        );
      })}
    </div>
  );
};
