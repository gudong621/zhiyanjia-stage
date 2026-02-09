"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "../../components/AppShell";
import { Brain, Search, PenTool, Share2, ShieldAlert, UserCheck, Zap, LayoutGrid, Monitor } from "lucide-react";
import { VirtualOffice } from "../../components/VirtualOffice";

const AGENT_META: Record<string, any> = {
  minion: { icon: <UserCheck size={20} />, color: "bg-purple-900" },
  sage: { icon: <Brain size={20} />, color: "bg-blue-900" },
  scout: { icon: <Search size={20} />, color: "bg-gray-800" },
  quill: { icon: <PenTool size={20} />, color: "bg-green-900" },
  xalt: { icon: <Share2 size={20} />, color: "bg-red-900" },
  observer: { icon: <ShieldAlert size={20} />, color: "bg-orange-900" },
};

export default function StagePage() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [viewMode, setViewViewMode] = useState<'grid' | 'office'>('office');
  const [data, setData] = useState<any>(null);
  const [inputValue, setInputValue] = useState("");
  const [syncProgress, setSyncProgress] = useState(65);

  const handleSendMission = async () => {
    if (!inputValue.trim()) return;
    try {
      await fetch('/api/storage', {
        method: 'POST',
        body: JSON.stringify({ type: 'MISSION', content: inputValue })
      });
      setInputValue("");
      setSyncProgress(95);
    } catch (e) {
      console.error("Mission dispatch failed", e);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/storage');
        const result = await response.json();
        setData(result);
        const base = result.events?.length > 0 ? 85 : 65;
        setSyncProgress(base + Math.floor(Math.random() * 10));
      } catch (error) {
        console.error("Failed to fetch stage data", error);
      }
    };

    fetchData();
    const interval = setInterval(() => {
      if (isPlaying) fetchData();
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!data) return <div className="p-10 pixel-text text-white bg-black h-screen">LOADING_GHOST_SHELL...</div>;

  return (
    <AppShell>
      <div className="p-6 lg:p-10 bg-paper min-h-screen font-mono text-black">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b-4 border-black pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2 text-accent text-xs tracking-widest uppercase font-bold">
              <span className="flex h-3 w-3 bg-accent animate-pulse"></span>
              LIVE - SECTION 9 TACTICAL STAGE
            </div>
            <h1 className="text-4xl font-black text-ink-900 pixel-ch-text uppercase tracking-tighter">实验室控制台</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white border-4 border-black p-1 flex shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <button 
                    onClick={() => setViewViewMode('office')}
                    className={`px-3 py-1 text-[10px] font-black flex items-center gap-2 ${viewMode === 'office' ? 'bg-black text-white' : 'hover:bg-ink-100'}`}
                >
                    <Monitor size={14} /> OFFICE_VIEW
                </button>
                <button 
                    onClick={() => setViewViewMode('grid')}
                    className={`px-3 py-1 text-[10px] font-black flex items-center gap-2 ${viewMode === 'grid' ? 'bg-black text-white' : 'hover:bg-ink-100'}`}
                >
                    <LayoutGrid size={14} /> AGENT_GRID
                </button>
            </div>
          </div>
        </header>

        <section className="mb-12 bg-ink-900 border-4 border-black p-6 shadow-[12px_12px_0px_0px_rgba(255,87,34,0.3)]">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMission()}
              placeholder="输入指令，看 Agent 们如何在办公室里开始讨论..."
              className="flex-1 bg-black border-2 border-accent p-3 text-accent font-bold text-sm focus:outline-none pixel-ch-text placeholder:opacity-50"
            />
            <button 
              onClick={handleSendMission}
              className="px-8 py-3 bg-accent text-white border-4 border-black font-black text-xs hover:bg-accent/80 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              发起深度脑暴
            </button>
          </div>
          <div className="w-full bg-black h-4 border-2 border-black relative overflow-hidden">
            <div className="absolute inset-0 bg-accent transition-all duration-1000" style={{ width: `${syncProgress}%` }}></div>
            <div className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-white uppercase tracking-[0.5em] mix-blend-difference">
              GHOST_SYNCING_{syncProgress}%
            </div>
          </div>
        </section>

        {viewMode === 'office' ? (
            <div className="mb-12">
                <VirtualOffice agents={data.agents || []} events={data.events || []} />
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            {(data.agents || []).map((agent: any) => {
                const meta = AGENT_META[agent.id] || { icon: <UserCheck />, color: "bg-ink-500" };
                return (
                <div key={agent.id} className="bg-white border-4 border-black p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
                    <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${meta.color} border-2 border-black flex items-center justify-center text-white`}>
                        {meta.icon}
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] text-ink-400 font-black uppercase">{agent.model}</div>
                        <div className={`text-[10px] font-black px-2 py-0.5 border-2 border-black inline-block mt-1 ${agent.status === 'online' ? 'bg-green-400' : 'bg-yellow-400'}`}>
                        {agent.status.toUpperCase()}
                        </div>
                    </div>
                    </div>
                    <h3 className="text-2xl font-black mb-1 pixel-en-text uppercase leading-none">{agent.name}</h3>
                    <p className="text-[10px] text-ink-500 font-black mb-4 uppercase">{agent.role}</p>
                    <div className="bg-ink-50 p-3 border-2 border-black italic min-h-[60px]">
                    <p className="text-sm text-ink-700 leading-snug font-bold">"{agent.lastAction || "Awaiting signal..."}"</p>
                    </div>
                </div>
                );
            })}
            </div>
        )}

        <div className="bg-black border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,0.2)]">
          <div className="bg-ink-800 px-5 py-2 border-b-4 border-black flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-white uppercase tracking-tighter VT323">ZHIYANJIA_ROUNDTABLE_STREAM.LOG</span>
            </div>
          </div>
          <div className="p-6 font-mono text-xs leading-relaxed h-[400px] overflow-y-auto bg-ink-900 text-green-400 pixel-ch-text">
            <div className="space-y-4">
              {data.events?.map((event: any) => (
                <div key={event.id} className="flex gap-4 border-l-2 border-green-900 pl-4 text-xs animate-in fade-in slide-in-from-left duration-500">
                  <span className="text-green-700 shrink-0 font-bold">{event.timestamp}</span>
                  <span className={`${event.color || 'text-green-400'} font-black shrink-0 pixel-en-text text-base`}>@{event.agent}</span>
                  <span className="text-green-100 font-bold">{event.content}</span>
                </div>
              ))}
              <div className="pt-4 animate-pulse flex items-center gap-2">
                <span className="text-green-800 font-black uppercase text-[10px]">SECTION_9_GHOST_CONNECTED_AND_LISTENING...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
