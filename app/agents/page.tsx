"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "../../components/AppShell";
import { Settings, Users, Database, ShieldCheck, Mail, Globe, MessageSquare, ChevronRight, Loader2, Sparkles, UserPlus } from "lucide-react";

export default function AgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('/api/storage');
        const data = await response.json();
        if (data.agents) {
          setAgents(data.agents);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  return (
    <AppShell>
      <div className="p-6 lg:p-10 bg-paper min-h-screen font-mono">
        <header className="mb-10 border-b-4 border-black pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-ink-900 pixel-ch-text uppercase tracking-tighter mb-2">Agent 团队配置</h1>
            <p className="text-sm font-bold text-ink-500 uppercase tracking-widest">管理 Section 9 全员及其灵魂参数。</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-black uppercase hover:bg-accent transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1">
            <UserPlus size={16} /> 召集新成员
          </button>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <section className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-3 mb-6 border-b-2 border-black pb-4">
                <Users className="text-accent" size={24} />
                <h2 className="text-xl font-black text-ink-900 pixel-ch-text uppercase">核心成员设置 (Real-time)</h2>
              </div>
              
              {loading ? (
                <div className="flex justify-center p-12">
                  <Loader2 className="animate-spin text-accent" />
                </div>
              ) : (
                <div className="space-y-4">
                  {agents.map((a) => (
                    <div key={a.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-ink-50 border-2 border-black hover:bg-white transition-colors group gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-black text-xs border-2 border-black group-hover:bg-accent transition-colors">
                          {a.name.substring(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-black text-ink-900 pixel-en-text text-xl leading-none">{a.name}</h3>
                            <span className={`px-2 py-0.5 text-[8px] font-black uppercase border border-black ${a.status === 'online' ? 'bg-green-400' : 'bg-yellow-400'}`}>
                              {a.status}
                            </span>
                          </div>
                          <p className="text-[10px] text-ink-500 font-bold uppercase">{a.role} // {a.model}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="hidden sm:block text-right mr-4">
                          <div className="text-[8px] font-black text-ink-400 uppercase">Latest Action</div>
                          <div className="text-[10px] font-bold truncate max-w-[150px]">{a.lastAction || "Awaiting Orders..."}</div>
                        </div>
                        <button className="flex items-center gap-1 text-[10px] font-black bg-black text-white px-3 py-1 hover:bg-accent transition-colors whitespace-nowrap">
                          EDIT_CORE <ChevronRight size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-3 mb-6 border-b-2 border-black pb-4">
                <Database className="text-blue-500" size={24} />
                <h2 className="text-xl font-black text-ink-900 pixel-ch-text uppercase">记忆中枢同步状态</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-black text-green-400 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                  <div className="text-[10px] font-black uppercase mb-1 opacity-70">Supabase Connection</div>
                  <div className="text-2xl font-black pixel-text uppercase">Stable</div>
                </div>
                <div className="p-4 bg-black text-blue-400 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                  <div className="text-[10px] font-black uppercase mb-1 opacity-70">Ghost Sync Level</div>
                  <div className="text-2xl font-black pixel-text">98.2%</div>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="bg-ink-900 text-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-lg font-black mb-4 flex items-center gap-2 uppercase tracking-tighter">
                <ShieldCheck size={20} className="text-green-400" />
                系统状态
              </h2>
              <div className="space-y-4 font-mono text-[10px] font-bold uppercase">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-ink-400">OPENCLAW_CORE</span>
                  <span className="text-green-400">RUNNING</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-ink-400">GHOST_ENGINE</span>
                  <span className="text-green-400">SYNCING</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-400">LAST_HEARTBEAT</span>
                  <span>JUST_NOW</span>
                </div>
              </div>
              <button className="w-full mt-6 py-2 bg-accent text-white border-2 border-black font-black text-[10px] hover:translate-x-[2px] hover:translate-y-[2px] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none">
                EXECUTE_SELF_CHECK
              </button>
            </section>

            <section className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-lg font-black text-ink-900 mb-4 flex items-center gap-2 uppercase tracking-tighter text-accent">
                <Sparkles size={20} />
                自动情报总结
              </h2>
              <p className="text-[10px] font-bold text-ink-600 uppercase mb-4 leading-relaxed">
                系统将自动收集圆桌讨论的核心结论，并以作战档案的形式归档至陈列馆。
              </p>
              <div className="p-3 bg-ink-50 border-2 border-black border-dashed">
                <div className="text-[8px] font-black text-ink-400 mb-1">CURRENT_CRON</div>
                <div className="text-[10px] font-bold">INTERVAL: 20s (GHOST_PULSE)</div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
