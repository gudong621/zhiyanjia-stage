"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "../../components/AppShell";
import { Brain, Search, PenTool, Share2, ShieldAlert, UserCheck, Play, Pause, Filter, Zap } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  role: string;
  model: string;
  status: string;
  affect: string;
  lastAction: string;
  icon: React.ReactNode;
  color: string;
}

const AGENTS: Agent[] = [
  {
    id: "minion",
    name: "ARAMAKI-01",
    role: "首席幕僚 (Project Director)",
    model: "Claude Opus 4.6",
    status: "syncing",
    affect: "stoic",
    lastAction: "正在对 Section 9 全体下达《炸弹狂魔 (Catch the Bomber)》作战指令...",
    icon: <UserCheck size={20} />,
    color: "bg-purple-900",
  },
  {
    id: "sage",
    name: "ISHIKAWA-LOG",
    role: "情报潜水员 (Lead Researcher)",
    model: "GPT-5.3 Codex",
    status: "diving",
    affect: "analytical",
    lastAction: "已潜入 MewYork 迷局数据深处，提取《炸弹狂魔》博弈逻辑...",
    icon: <Brain size={20} />,
    color: "bg-blue-900",
  },
  {
    id: "scout",
    name: "BATOU-SENSOR",
    role: "市场观测手 (Tactical Scout)",
    model: "Gemini 3 Flash",
    status: "scanning",
    affect: "aggressive",
    lastAction: "义眼已锁定小红书高热度流量频段...",
    icon: <Search size={20} />,
    color: "bg-gray-800",
  },
  {
    id: "quill",
    name: "TOGUSA-SCRIPT",
    role: "生化叙事师 (Narrative Designer)",
    model: "Claude Sonnet 4.5",
    status: "coding",
    affect: "humanistic",
    lastAction: "正在将硬核逻辑转录为感性灵魂文案...",
    icon: <PenTool size={20} />,
    color: "bg-green-900",
  },
  {
    id: "xalt",
    name: "SAITO-SNIPER",
    role: "流量猎人 (Targeting Officer)",
    model: "Gemini 3 Pro",
    status: "aiming",
    affect: "precise",
    lastAction: "已锁定 2026 春季教育关键词，准备发起全频段投送...",
    icon: <Share2 size={20} />,
    color: "bg-red-900",
  },
  {
    id: "observer",
    name: "BORMA-SHELL",
    role: "架构审计师 (System Auditor)",
    model: "GPT-5.3 Codex",
    status: "shielding",
    affect: "vigilant",
    lastAction: "系统防火墙自检中，确保所有输出符合品牌协议...",
    icon: <ShieldAlert size={20} />,
    color: "bg-orange-900",
  },
];

export default function StagePage() {
  const [isPlaying, setIsPlaying] = useState(true);
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
      // Fake extra pulse on mission send
      setSyncProgress(90);
      setTimeout(() => setSyncProgress(Math.floor(Math.random() * 15) + 80), 1000);
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
        
        // Dynamic Sync Progress simulation based on activity
        const base = result.events?.length > 0 ? 85 : 65;
        const jitter = Math.floor(Math.random() * 10);
        setSyncProgress(base + jitter);
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

  if (!data) return <div className="p-10 pixel-text text-white">LOADING_SYSTEM_GHOST...</div>;

  return (
    <AppShell>
      <div className="p-6 lg:p-10 bg-paper min-h-screen font-mono text-black">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b-4 border-black pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2 text-accent text-xs tracking-widest uppercase font-bold">
              <span className="flex h-3 w-3 bg-accent animate-pulse"></span>
              LIVE - ZHIYANJIA STAGE // GHOST_IN_THE_SHELL_MODE
            </div>
            <h1 className="text-4xl font-black text-ink-900 pixel-ch-text uppercase tracking-tighter">实验室控制台</h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-xs font-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all uppercase"
            >
              {isPlaying ? "PAUSE_MONITOR" : "RESUME_RUN"}
            </button>
          </div>
        </header>

        <section className="mb-12 bg-ink-900 border-4 border-black p-6 shadow-[12px_12px_0px_0px_rgba(255,87,34,0.3)]">
          <div className="flex items-center gap-3 mb-4 text-accent uppercase font-black text-xs">
            <Zap size={16} /> MISSION_DISPATCH_CENTER
          </div>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMission()}
              placeholder="输入作战代号或产品指令... (例如：针对《共创城市》制定教育方案)"
              className="flex-1 bg-black border-2 border-accent p-3 text-accent font-bold text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 pixel-ch-text placeholder:opacity-50"
            />
            <button 
              onClick={handleSendMission}
              className="px-8 py-3 bg-accent text-white border-4 border-black font-black text-xs hover:bg-accent/80 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              发起脑暴任务
            </button>
          </div>
          <div className="w-full bg-black h-4 border-2 border-black relative overflow-hidden">
            <div 
              className="absolute inset-0 bg-accent transition-all duration-1000 ease-out" 
              style={{ width: `${syncProgress}%` }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-white uppercase tracking-[0.5em] mix-blend-difference">
              Synchronizing_Ghost_Data_{syncProgress}%
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {AGENTS.map((agent) => {
            const dynamicAgent = data.agents?.find((a: any) => a.id === agent.id) || agent;
            return (
              <div key={agent.id} className="bg-white border-4 border-black p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${agent.color} border-2 border-black flex items-center justify-center text-white`}>
                    {agent.icon}
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-ink-400 font-black uppercase">{dynamicAgent.model || agent.model}</div>
                    <div className="text-[10px] font-black px-2 py-0.5 bg-black text-white inline-block mt-1">
                      {(dynamicAgent.status || agent.status).toUpperCase()}
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-black mb-1 pixel-en-text uppercase leading-none">{dynamicAgent.name || agent.name}</h3>
                <p className="text-[10px] text-ink-500 font-black mb-4 uppercase">{dynamicAgent.role || agent.role}</p>
                <div className="bg-ink-50 p-3 border-2 border-black italic min-h-[60px]">
                  <p className="text-sm text-ink-700 leading-snug font-bold">"{dynamicAgent.lastAction || agent.lastAction}"</p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t-2 border-dotted border-black pt-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black text-ink-400 uppercase tracking-tighter">AFFECT:</span>
                    <span className="text-xs font-black text-accent uppercase">{dynamicAgent.affect || agent.affect}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-black border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,0.2)]">
          <div className="bg-ink-800 px-5 py-2 border-b-4 border-black flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500 border border-white"></div>
                <div className="w-3 h-3 bg-yellow-500 border border-white"></div>
                <div className="w-3 h-3 bg-green-500 border border-white"></div>
              </div>
              <span className="text-[10px] font-black text-white uppercase tracking-tighter VT323">智研家_ROUNDTABLE_FEED.LOG</span>
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
                <span className="text-accent font-black">_</span>
                <span className="text-green-800 font-black uppercase text-[10px]">SECTION_9_LISTENING...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
