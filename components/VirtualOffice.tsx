"use client";

import React, { useEffect, useState, useRef, useMemo } from 'react';
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
  
  const positionsRef = useRef<Record<string, { x: number, y: number }>>({});

  // 1. Logic: Target Determination
  useEffect(() => {
    if (agents.length === 0) return;

    const lastEvent = events[events.length - 1];
    
    setPositions(prev => {
      const next = { ...prev };
      
      agents.forEach(agent => {
        // Initial setup
        if (!next[agent.id]) {
            const homeFurn = FURNITURE.find(f => f.id === AGENT_DATA[agent.id]?.home) || FURNITURE[0];
            next[agent.id] = { x: homeFurn.x, y: homeFurn.y };
            return;
        }

        const isSpeaking = lastEvent && lastEvent.agent === agent.name;
        const isThinking = agent.status === 'thinking' || agent.status === 'syncing';

        if (isSpeaking) {
            // Rule: If speaking, move towards the center/meeting table
            next[agent.id] = { x: 45 + (Math.random() * 4 - 2), y: 40 + (Math.random() * 4 - 2) };
        } else if (isThinking) {
            // Rule: If thinking, stay at home equipment
            const home = FURNITURE.find(f => f.id === AGENT_DATA[agent.id]?.home);
            if (home) next[agent.id] = { x: home.x + 2, y: home.y + 2 };
        } else {
            // Rule: Occasionally roam to oil bar or idle
            if (Math.random() > 0.8) {
                const randomFurn = Math.random() > 0.7 ? FURNITURE.find(f => f.id === 'f3') : FURNITURE[Math.floor(Math.random() * FURNITURE.length)];
                if (randomFurn) next[agent.id] = { x: randomFurn.x + (Math.random() * 6 - 3), y: randomFurn.y + (Math.random() * 6 - 3) };
            }
        }
      });

      return next;
    });

    // Tachikomas follow speakers or roam oil bar
    setTachikomas(prev => prev.map(t => {
        if (lastEvent && Math.random() > 0.5) {
            // Follow the current speaker!
            const speakerPos = positions[agents.find(a => a.name === lastEvent.agent)?.id || ""];
            if (speakerPos) return { ...t, x: speakerPos.x + 5, y: speakerPos.y + 5, state: 'Watching!' };
        }
        return {
            ...t,
            x: Math.min(90, Math.max(5, t.x + (Math.random() * 20 - 10))),
            y: Math.min(90, Math.max(5, t.y + (Math.random() * 20 - 10))),
            state: Math.random() > 0.9 ? 'Oil Time!' : t.state
        };
    }));

  }, [agents, events]);

  return (
    <div className="relative w-full h-[600px] bg-ink-950 border-4 border-black overflow-hidden shadow-2xl font-mono">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      {/* Furniture */}
      {FURNITURE.map(item => (
        <div 
          key={item.id}
          className="absolute flex flex-col items-center justify-center opacity-30 group cursor-help transition-opacity hover:opacity-100"
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

      {/* Tachikomas */}
      {tachikomas.map(t => (
        <div 
          key={t.id}
          className="absolute transition-all duration-[4000ms] ease-in-out z-40 flex flex-col items-center group"
          style={{ left: `${t.x}%`, top: `${t.y}%`, transform: 'translate(-50%, -50%)' }}
        >
          <div className="absolute -top-10 px-2 py-1 bg-blue-500 text-white text-[7px] font-black uppercase opacity-0 group-hover:opacity-100 transition-all border-2 border-black z-50">
            {t.state}
          </div>
          <div className="relative w-12 h-10 animate-bounce" style={{ animationDuration: '3s' }}>
            <div className="w-10 h-8 bg-blue-600 border-2 border-black rounded-full relative overflow-hidden shadow-lg">
                <div className="absolute top-2 left-2 w-2 h-2 bg-white rounded-full border-2 border-black"></div>
                <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full border-2 border-black"></div>
            </div>
            <div className="absolute -right-1 top-0 w-5 h-5 bg-blue-700 border-2 border-black rounded-full -z-10"></div>
          </div>
        </div>
      ))}

      {/* Agents */}
      {agents.map(agent => {
        const pos = positions[agent.id] || { x: 50, y: 50 };
        const meta = AGENT_DATA[agent.id] || { color: '#ccc', hair: 'bg-zinc-500' };
        const isSpeaking = events[events.length - 1]?.agent === agent.name;
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
