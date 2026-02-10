"use client";

import React, { useEffect, useState, useRef } from 'react';
import { 
  UserCheck, Brain, Search, PenTool, Share2, ShieldAlert, 
  Monitor, Coffee, Server, Globe, Layout, Shield, Cpu, 
  Activity, Database, Terminal
} from 'lucide-react';

const AGENT_DATA: Record<string, any> = {
  minion: { color: '#9333ea', hair: 'bg-zinc-100', hairStyle: 'bowl', accessory: 'glasses', name: 'ARAMAKI', home: 'f1' },
  sage: { color: '#2563eb', hair: 'bg-zinc-400', hairStyle: 'spiky', accessory: 'headset', name: 'ISHIKAWA', home: 'f2' },
  scout: { color: '#4b5563', hair: 'bg-zinc-100', hairStyle: 'buzz', accessory: 'buff', name: 'BATOU', home: 'f6' },
  quill: { color: '#16a34a', hair: 'bg-amber-900', hairStyle: 'long', accessory: 'tie', name: 'TOGUSA', home: 'f5' },
  xalt: { color: '#dc2626', hair: 'bg-zinc-800', hairStyle: 'slick', accessory: 'patch', name: 'SAITO', home: 'f4' },
  observer: { color: '#ea580c', hair: 'bg-zinc-900', hairStyle: 'flat', accessory: 'mask', name: 'BORMA', home: 'f8' },
};

const FURNITURE = [
  { id: 'f1', name: 'Tactical Console', icon: <Monitor size={32} />, x: 45, y: 40, color: 'text-purple-500' },
  { id: 'f2', name: 'Deep Sea Mainframe', icon: <Server size={40} />, x: 15, y: 20, color: 'text-blue-500' },
  { id: 'f3', name: 'Natural Oil Bar', icon: <Coffee size={24} />, x: 85, y: 75, color: 'text-amber-500' },
  { id: 'f4', name: 'Global Uplink Array', icon: <Globe size={36} />, x: 50, y: 15, color: 'text-accent' },
  { id: 'f5', name: 'Encryption Deck', icon: <Layout size={32} />, x: 25, y: 70, color: 'text-green-500' },
  { id: 'f6', name: 'Security Firebox', icon: <Shield size={32} />, x: 75, y: 25, color: 'text-red-500' },
  { id: 'f7', name: 'Data Silo', icon: <Database size={28} />, x: 10, y: 80, color: 'text-blue-400' },
  { id: 'f8', name: 'Ghost Scanner', icon: <Activity size={24} />, x: 80, y: 10, color: 'text-emerald-400' },
];

export const VirtualOffice: React.FC<{ agents: any[], events: any[] }> = ({ agents, events }) => {
  const [positions, setPositions] = useState<Record<string, { x: number, y: number }>>({});
  const [tachikomas, setTachikomas] = useState<any[]>([
    { id: 'tachi-1', x: 30, y: 30, state: 'Syncing...' },
    { id: 'tachi-2', x: 70, y: 70, state: 'Natural Oil!' }
  ]);
  
  const lastEvent = events[events.length - 1];
  const speakerId = agents.find(a => a.name === lastEvent?.agent)?.id;

  // Pre-defined slots for the meeting table (45, 40)
  const meetingSlots = [
    { dx: -6, dy: -4 }, { dx: 0, dy: -6 }, { dx: 6, dy: -4 },
    { dx: -6, dy: 4 }, { dx: 0, dy: 6 }, { dx: 6, dy: 4 }
  ];

  useEffect(() => {
    if (agents.length === 0) return;
    
    setPositions(prev => {
      const next = { ...prev };
      agents.forEach((agent, index) => {
        // Initial setup or periodic update
        const isSpeaking = lastEvent && lastEvent.agent === agent.name;
        const isThinking = agent.status === 'thinking' || agent.status === 'syncing';

        if (isSpeaking) {
            // Rule: Move to a specific slot around the meeting table
            const slot = meetingSlots[index % meetingSlots.length];
            next[agent.id] = { x: 45 + slot.dx, y: 40 + slot.dy };
        } else if (isThinking) {
            // Rule: Stay at home equipment with a unique offset
            const home = FURNITURE.find(f => f.id === AGENT_DATA[agent.id]?.home);
            if (home) {
                const offsetX = (index % 2 === 0 ? 4 : -4);
                const offsetY = (index < 3 ? 4 : -4);
                next[agent.id] = { x: home.x + offsetX, y: home.y + offsetY };
            }
        } else {
            // Rule: Idle/Roaming with unique furniture offsets
            if (!next[agent.id] || Math.random() > 0.8) {
                const targetFurn = FURNITURE[index % FURNITURE.length];
                const offsetX = (index % 2 === 0 ? 5 : -5);
                const offsetY = (index < 3 ? 5 : -5);
                next[agent.id] = { x: targetFurn.x + offsetX, y: targetFurn.y + offsetY };
            }
        }
      });
      return next;
    });

    setTachikomas(prev => prev.map((t, i) => {
        const oilBar = FURNITURE.find(f => f.id === 'f3')!;
        const distToOil = Math.sqrt(Math.pow(t.x - oilBar.x, 2) + Math.pow(t.y - oilBar.y, 2));
        const nearOil = distToOil < 10;

        if (lastEvent && Math.random() > 0.5 && !nearOil) {
            const speakerPos = positions[speakerId || ""];
            if (speakerPos) {
                // Stay near the speaker but not ON them
                const offset = i === 0 ? { dx: 8, dy: 8 } : { dx: -8, dy: 8 };
                return { ...t, x: speakerPos.x + offset.dx, y: speakerPos.y + offset.dy, state: 'Watching!' };
            }
        }

        // Randomly wander towards oil bar or randomly
        let targetX = t.x + (Math.random() * 20 - 10);
        let targetY = t.y + (Math.random() * 20 - 10);
        
        if (Math.random() > 0.7) {
            targetX = oilBar.x + (Math.random() * 10 - 5);
            targetY = oilBar.y + (Math.random() * 10 - 5);
        }

        return {
            ...t,
            x: Math.min(90, Math.max(5, targetX)),
            y: Math.min(90, Math.max(5, targetY)),
            state: nearOil ? 'HAPPY! (OIL)' : Math.random() > 0.9 ? 'Oil Time?' : t.state
        };
    }));
  }, [agents, events]);

  return (
    <div className="relative w-full h-[450px] sm:h-[600px] bg-ink-950 border-4 border-black overflow-hidden shadow-2xl font-mono">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      {/* Ghost Glitch Overlay */}
      {speakerId && (
        <div className="absolute inset-0 pointer-events-none z-[60] opacity-20 bg-gradient-to-t from-green-500/10 via-transparent to-green-500/10 animate-pulse">
            <div className="absolute top-0 left-0 w-full h-1 bg-green-500/30 animate-[scan_4s_linear_infinite]"></div>
        </div>
      )}

      {/* Furniture */}
      {FURNITURE.map(item => (
        <div 
          key={item.id}
          className="absolute flex flex-col items-center justify-center opacity-30 group"
          style={{ left: `${item.x}%`, top: `${item.y}%`, transform: 'translate(-50%, -50%)' }}
        >
          <div className={`p-4 border-2 border-dashed border-white/10 rounded-lg bg-black/20 ${item.color} shadow-inner`}>
            {item.icon}
          </div>
          <div className="mt-2 text-[6px] font-black text-white/30 uppercase tracking-[0.2em]">
            {item.name}
          </div>
        </div>
      ))}

      {/* Dynamic Connection Lines */}
      {speakerId && positions[speakerId] && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {agents.map(a => {
            if (a.id === speakerId) return null;
            const start = positions[speakerId];
            const end = positions[a.id];
            if (!start || !end) return null;
            return (
              <line 
                key={`line-${a.id}`}
                x1={`${start.x}%`} y1={`${start.y}%`}
                x2={`${end.x}%`} y2={`${end.y}%`}
                stroke="rgba(34, 197, 94, 0.2)"
                strokeWidth="1"
                strokeDasharray="4 4"
                className="animate-[dash_2s_linear_infinite]"
              />
            );
          })}
        </svg>
      )}

      {/* Tachikomas */}
      {tachikomas.map(t => (
        <div 
          key={t.id}
          className="absolute transition-all duration-[4000ms] ease-in-out z-40 flex flex-col items-center group"
          style={{ left: `${t.x}%`, top: `${t.y}%`, transform: 'translate(-50%, -50%)' }}
        >
          <div className={`absolute -top-10 px-2 py-1 ${t.state.includes('OIL') ? 'bg-amber-500' : 'bg-blue-500'} text-white text-[7px] font-black uppercase opacity-0 group-hover:opacity-100 transition-all border-2 border-black z-50`}>
            {t.state}
          </div>
          <div className="relative w-12 h-10 animate-bounce" style={{ animationDuration: t.state.includes('OIL') ? '1s' : '3s' }}>
            {/* Legs */}
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-zinc-800 border-2 border-black rounded-full"></div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-zinc-800 border-2 border-black rounded-full"></div>
            
            {/* Main Body */}
            <div className={`w-10 h-8 ${t.state.includes('OIL') ? 'bg-blue-400' : 'bg-blue-600'} border-2 border-black rounded-full relative overflow-hidden shadow-lg`}>
                <div className="absolute top-2 left-2 w-2 h-2 bg-white rounded-full border-2 border-black">
                   <div className="w-1 h-1 bg-black rounded-full m-auto mt-0.5"></div>
                </div>
                <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full border-2 border-black">
                   <div className="w-1 h-1 bg-black rounded-full m-auto mt-0.5"></div>
                </div>
                {t.state.includes('OIL') && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px]">✨</div>}
            </div>
            
            {/* Pod */}
            <div className="absolute -right-1 top-0 w-6 h-6 bg-blue-700 border-2 border-black rounded-full -z-10 flex items-center justify-center">
                <div className="w-2 h-2 bg-white/20 rounded-full"></div>
            </div>
          </div>
        </div>
      ))}

      {/* Agents */}
      {agents.map(agent => {
        const pos = positions[agent.id] || { x: 50, y: 50 };
        const meta = AGENT_DATA[agent.id] || { color: '#ccc', hair: 'bg-zinc-500' };
        const isSpeaking = speakerId === agent.id;
        const isThinking = agent.status === 'thinking' || agent.status === 'syncing';
        
        return (
          <div 
            key={agent.id}
            className="absolute transition-all duration-[4000ms] ease-in-out flex flex-col items-center group z-50"
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            {/* Bubble */}
            <div className={`absolute -top-24 px-4 py-3 bg-white border-2 border-black text-[10px] font-bold text-black min-w-[160px] max-w-[240px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 origin-bottom ${isSpeaking ? 'scale-100' : 'scale-0 group-hover:scale-100'} z-[100]`}>
              <div className="text-[8px] text-ink-400 mb-2 border-b border-black/10 flex justify-between uppercase">
                <span>{isSpeaking ? 'LIVE_SPEECH' : 'LAST_LOG'} //</span>
                <span>{agent.name}</span>
              </div>
              <div className="line-clamp-4 leading-relaxed italic">"{agent.lastAction}"</div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-2 border-b-2 border-black rotate-45"></div>
            </div>
            
            {/* Sprite */}
            <div className="relative">
                {(isThinking || isSpeaking) && <div className={`absolute inset-[-20px] ${isSpeaking ? 'bg-green-500/20' : 'bg-accent/20'} rounded-full blur-2xl animate-pulse`}></div>}
                
                <div className="relative w-16 h-20 flex flex-col items-center">
                    <div className="w-10 h-10 bg-ink-100 border-2 border-black rounded-lg relative shadow-sm overflow-hidden flex flex-col">
                        {meta.hairStyle === 'bowl' && <div className={`w-full h-5 ${meta.hair} border-b-2 border-black`}></div>}
                        {meta.hairStyle === 'spiky' && <div className="flex gap-0.5 h-4"><div className={`flex-1 ${meta.hair}`}></div><div className={`flex-1 ${meta.hair}`}></div><div className={`flex-1 ${meta.hair}`}></div></div>}
                        {meta.hairStyle === 'long' && <div className={`w-full h-4 ${meta.hair}`}></div>}
                        <div className="flex-1 relative flex items-center justify-center">
                            <div className="w-full flex justify-around px-2">
                                <div className={`w-2 h-2 bg-black rounded-sm ${isSpeaking ? 'animate-bounce' : ''}`}></div>
                                <div className={`w-2 h-2 bg-black rounded-sm ${isSpeaking ? 'animate-bounce' : ''}`}></div>
                            </div>
                            {meta.accessory === 'glasses' && <div className="absolute top-1 w-full h-1.5 bg-black/30"></div>}
                            {meta.accessory === 'headset' && <div className="absolute -right-1 w-3 h-6 bg-zinc-800 border-2 border-black rounded-l-md"></div>}
                        </div>
                    </div>
                    <div className={`w-14 h-11 ${meta.color} border-2 border-black rounded-t-2xl -mt-1 relative shadow-xl`}>
                        {meta.accessory === 'tie' && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-5 bg-red-800 border-x-2 border-black"></div>}
                    </div>
                    <div className="flex gap-4 -mt-1">
                        <div className="w-4 h-3 bg-zinc-950 rounded-b-lg animate-bounce"></div>
                        <div className="w-4 h-3 bg-zinc-950 rounded-b-lg animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                </div>
            </div>
            
            <div className={`mt-3 px-3 py-1 border-2 border-black text-[10px] font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${isSpeaking ? 'bg-green-500 text-white border-green-600' : isThinking ? 'bg-accent text-white border-accent' : 'bg-white text-black'}`}>
              {agent.name}
            </div>
          </div>
        );
      })}
    </div>
  );
};
