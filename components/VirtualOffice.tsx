"use client";

import React, { useEffect, useState, useRef } from 'react';
import { 
  UserCheck, Brain, Search, PenTool, Share2, ShieldAlert, 
  Monitor, Coffee, Server, Globe, Layout, Shield, Cpu, 
  Activity, Database, Terminal
} from 'lucide-react';

const AGENT_DATA: Record<string, any> = {
  minion: { color: '#9333ea', hair: 'bg-zinc-100', hairStyle: 'bowl', accessory: 'glasses', name: 'ARAMAKI' },
  sage: { color: '#2563eb', hair: 'bg-zinc-400', hairStyle: 'spiky', accessory: 'headset', name: 'ISHIKAWA' },
  scout: { color: '#4b5563', hair: 'bg-zinc-100', hairStyle: 'buzz', accessory: 'buff', name: 'BATOU' },
  quill: { color: '#16a34a', hair: 'bg-amber-900', hairStyle: 'long', accessory: 'tie', name: 'TOGUSA' },
  xalt: { color: '#dc2626', hair: 'bg-zinc-800', hairStyle: 'slick', accessory: 'patch', name: 'SAITO' },
  observer: { color: '#ea580c', hair: 'bg-zinc-900', hairStyle: 'flat', accessory: 'mask', name: 'BORMA' },
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

export const VirtualOffice: React.FC<{ agents: any[] }> = ({ agents }) => {
  const [positions, setPositions] = useState<Record<string, { x: number, y: number }>>({});
  const [tachikomas, setTachikomas] = useState<any[]>([
    { id: 'tachi-1', x: 30, y: 30, state: 'Syncing...' },
    { id: 'tachi-2', x: 70, y: 70, state: 'Natural Oil!' }
  ]);
  
  const positionsRef = useRef<Record<string, { x: number, y: number }>>({});

  useEffect(() => {
    if (Object.keys(positionsRef.current).length === 0 && agents.length > 0) {
      const initialPos: any = {};
      agents.forEach((a, i) => {
        const furn = FURNITURE[i % FURNITURE.length];
        initialPos[a.id] = { x: furn.x + 5, y: furn.y + 5 };
      });
      positionsRef.current = initialPos;
      setPositions(initialPos);
    }

    const moveInterval = setInterval(() => {
      setPositions(prev => {
        const next = { ...prev };
        for(let i=0; i<2; i++) {
            const luckyId = agents[Math.floor(Math.random() * agents.length)]?.id;
            if (luckyId) {
                const targetFurn = FURNITURE[Math.floor(Math.random() * FURNITURE.length)];
                next[luckyId] = { 
                    x: targetFurn.x + (Math.random() * 8 - 4), 
                    y: targetFurn.y + (Math.random() * 8 - 4) 
                };
            }
        }
        return next;
      });

      setTachikomas(prev => prev.map(t => ({
        ...t,
        x: Math.min(90, Math.max(5, t.x + (Math.random() * 40 - 20))),
        y: Math.min(90, Math.max(5, t.y + (Math.random() * 40 - 20))),
        state: Math.random() > 0.8 ? ['Checking Security', 'Found a bug!', 'Processing...', 'Yay!', 'Oil Time!'][Math.floor(Math.random()*5)] : t.state
      })));
    }, 5000);

    return () => clearInterval(moveInterval);
  }, [agents.length]);

  return (
    <div className="relative w-full h-[600px] bg-ink-950 border-4 border-black overflow-hidden shadow-2xl font-mono">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 animate-pulse" style={{ animationDuration: '10s' }}></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-950/20 via-transparent to-purple-950/20"></div>
      
      {/* Furniture and Equipment */}
      {FURNITURE.map(item => (
        <div 
          key={item.id}
          className="absolute flex flex-col items-center justify-center opacity-40 group cursor-help transition-opacity hover:opacity-100"
          style={{ left: `${item.x}%`, top: `${item.y}%`, transform: 'translate(-50%, -50%)' }}
        >
          <div className={`p-4 border-2 border-dashed border-white/10 rounded-lg bg-black/20 ${item.color} shadow-inner transition-all group-hover:border-solid group-hover:border-white/20`}>
            {item.icon}
          </div>
          <div className="mt-2 text-[6px] font-black text-white/30 uppercase tracking-[0.2em] group-hover:text-white/60">
            {item.name}
          </div>
          {/* Subtle Activity lights */}
          <div className="absolute top-2 right-2 flex gap-1">
            <div className="w-1 h-1 bg-red-500 rounded-full animate-ping"></div>
            <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      ))}

      {/* Tachikomas */}
      {tachikomas.map(t => (
        <div 
          key={t.id}
          className="absolute transition-all duration-[4000ms] ease-in-out z-40 flex flex-col items-center group cursor-pointer"
          style={{ left: `${t.x}%`, top: `${t.y}%`, transform: 'translate(-50%, -50%)' }}
        >
          <div className="absolute -top-10 px-2 py-1 bg-blue-500 text-white text-[7px] font-black uppercase opacity-0 group-hover:opacity-100 transition-all scale-50 group-hover:scale-100 whitespace-nowrap border-2 border-black z-50">
            {t.state}
          </div>
          <div className="relative w-14 h-12 animate-bounce" style={{ animationDuration: '3s' }}>
            <div className="w-10 h-8 bg-blue-600 border-2 border-black rounded-full relative overflow-hidden shadow-lg">
                <div className="absolute top-2 left-2 w-2.5 h-2.5 bg-white rounded-full border-2 border-black flex items-center justify-center">
                    <div className="w-1 h-1 bg-black rounded-full"></div>
                </div>
                <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-white rounded-full border-2 border-black flex items-center justify-center">
                    <div className="w-1 h-1 bg-black rounded-full"></div>
                </div>
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-black/40 rounded-full"></div>
            </div>
            <div className="absolute -right-2 top-1 w-6 h-6 bg-blue-700 border-2 border-black rounded-full -z-10 shadow-md"></div>
            <div className="absolute -bottom-1 left-1 w-3.5 h-3.5 bg-zinc-800 rounded-full border-2 border-black"></div>
            <div className="absolute -bottom-1 right-1 w-3.5 h-3.5 bg-zinc-800 rounded-full border-2 border-black"></div>
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
            className="absolute transition-all duration-[4000ms] ease-in-out flex flex-col items-center group cursor-crosshair z-50"
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            {/* Speech Bubble */}
            <div className={`absolute -top-24 px-4 py-3 bg-white border-2 border-black text-[10px] font-bold text-black min-w-[160px] max-w-[240px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 origin-bottom scale-0 group-hover:scale-100 z-[100]`}>
              <div className="text-[8px] text-ink-400 mb-2 border-b border-black/10 flex justify-between">
                <span>ENCRYPTED_SIGNAL //</span>
                <span>ID: {agent.id.toUpperCase()}</span>
              </div>
              <div className="line-clamp-4 leading-relaxed italic">"{agent.lastAction || "Awaiting task priority..."}"</div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-2 border-b-2 border-black rotate-45"></div>
            </div>
            
            {/* Detailed Pixel Character */}
            <div className="relative">
                {isThinking && <div className="absolute inset-[-20px] bg-accent/20 rounded-full blur-2xl animate-pulse"></div>}
                
                <div className="relative w-16 h-20 flex flex-col items-center">
                    {/* Head */}
                    <div className="w-10 h-10 bg-ink-100 border-2 border-black rounded-lg relative shadow-sm overflow-hidden flex flex-col">
                        {/* Hair styles logic */}
                        {meta.hairStyle === 'bowl' && <div className={`w-full h-5 ${meta.hair} border-b-2 border-black`}></div>}
                        {meta.hairStyle === 'spiky' && <div className="flex gap-0.5 h-4"><div className={`flex-1 ${meta.hair}`}></div><div className={`flex-1 ${meta.hair}`}></div><div className={`flex-1 ${meta.hair}`}></div></div>}
                        {meta.hairStyle === 'long' && <div className={`w-full h-4 ${meta.hair}`}></div>}
                        
                        <div className="flex-1 relative flex items-center justify-center">
                            <div className="w-full flex justify-around px-2">
                                <div className="w-2 h-2 bg-black rounded-sm shadow-inner"></div>
                                <div className="w-2 h-2 bg-black rounded-sm shadow-inner"></div>
                            </div>
                            {/* Accessories */}
                            {meta.accessory === 'glasses' && <div className="absolute top-1 w-full h-1.5 bg-black/30 border-y border-black/50"></div>}
                            {meta.accessory === 'headset' && <div className="absolute -right-1 w-3 h-6 bg-zinc-800 border-2 border-black rounded-l-md"></div>}
                            {meta.accessory === 'patch' && <div className="absolute top-0 right-1 w-3 h-3 bg-zinc-900 rounded-full border border-black"></div>}
                        </div>
                        {meta.accessory === 'mask' && <div className="w-full h-4 bg-zinc-900 border-t-2 border-black mt-auto"></div>}
                    </div>

                    {/* Body */}
                    <div className={`w-14 h-11 ${meta.color} border-2 border-black rounded-t-2xl -mt-1 relative shadow-xl overflow-hidden`}>
                        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-6 h-1 bg-white/10 rounded-full"></div>
                        {meta.accessory === 'tie' && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-5 bg-red-800 border-x-2 border-black shadow-sm"></div>}
                        {meta.accessory === 'buff' && <div className="absolute top-0 w-full h-2.5 bg-zinc-200/20 border-b border-black/30"></div>}
                        
                        <div className="absolute inset-0 flex items-center justify-center text-white/5 text-[12px] font-black uppercase">
                            {meta.name.substring(0,3)}
                        </div>
                    </div>

                    {/* Legs */}
                    <div className="flex gap-4 -mt-1">
                        <div className="w-4 h-3 bg-zinc-950 rounded-b-lg animate-bounce shadow-md" style={{ animationDuration: '0.5s' }}></div>
                        <div className="w-4 h-3 bg-zinc-950 rounded-b-lg animate-bounce shadow-md" style={{ animationDuration: '0.5s', animationDelay: '0.25s' }}></div>
                    </div>
                </div>
            </div>
            
            <div className={`mt-3 px-3 py-1 border-2 border-black text-[10px] font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${isThinking ? 'bg-accent text-white border-accent' : 'bg-white text-black'}`}>
              {agent.name}
            </div>
          </div>
        );
      })}
    </div>
  );
};
