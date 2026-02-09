"use client";

import React, { useState } from "react";
import { AppShell } from "../../components/AppShell";
import { Settings, Users, Database, ShieldCheck, Mail, Globe, MessageSquare, ChevronRight } from "lucide-react";

export default function AgentsPage() {
  return (
    <AppShell>
      <div className="p-6 lg:p-10 bg-paper min-h-screen font-mono">
        <header className="mb-10 border-b-4 border-black pb-6">
          <h1 className="text-4xl font-black text-ink-900 pixel-ch-text uppercase tracking-tighter mb-2">Agent 团队配置</h1>
          <p className="text-sm font-bold text-ink-500 uppercase tracking-widest">在此管理智研家梦之队的灵魂参数与协作逻辑。</p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <section className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-3 mb-6 border-b-2 border-black pb-4">
                <Users className="text-accent" size={24} />
                <h2 className="text-xl font-black text-ink-900 pixel-ch-text uppercase">核心成员设置</h2>
              </div>
              
              <div className="space-y-4">
                {[
                  { name: "ARAMAKI-01", role: "首席幕僚", desc: "Section 9 统筹核心，负责最终决策与资源平衡。" },
                  { name: "ISHIKAWA-LOG", role: "情报潜水员", desc: "深度潜入数据深处，挖掘产品背后的历史与逻辑协议。" },
                  { name: "TOGUSA-SCRIPT", role: "生化叙事师", desc: "将冷冰冰的逻辑转录为具备人类温度的感性叙事。" }
                ].map((a) => (
                  <div key={a.name} className="flex items-center justify-between p-4 bg-ink-50 border-2 border-black hover:bg-white transition-colors group">
                    <div>
                      <h3 className="font-black text-ink-900 pixel-en-text text-xl mb-1 leading-none">{a.name}</h3>
                      <p className="text-[10px] text-ink-500 font-bold uppercase">{a.role} // {a.desc}</p>
                    </div>
                    <button className="flex items-center gap-1 text-[10px] font-black bg-black text-white px-3 py-1 hover:bg-accent transition-colors">
                      EDIT_CORE <ChevronRight size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-3 mb-6 border-b-2 border-black pb-4">
                <Database className="text-blue-500" size={24} />
                <h2 className="text-xl font-black text-ink-900 pixel-ch-text uppercase">记忆中枢 (SUPABASE)</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-black text-green-400 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                  <div className="text-[10px] font-black uppercase mb-1 opacity-70">已存记忆 / MEMORIES_STORED</div>
                  <div className="text-3xl font-black pixel-text">1,284</div>
                </div>
                <div className="p-4 bg-black text-blue-400 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                  <div className="text-[10px] font-black uppercase mb-1 opacity-70">好感度对数 / AFFINITY_PAIRS</div>
                  <div className="text-3xl font-black pixel-text">15</div>
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
                  <span className="text-ink-400">VOLCANO_ENGINE</span>
                  <span className="text-yellow-400">PENDING_DEPLOY</span>
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
              <h2 className="text-lg font-black text-ink-900 mb-4 flex items-center gap-2 uppercase tracking-tighter">
                <Globe size={20} className="text-accent" />
                外部触达
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-ink-600 uppercase">
                  <Mail size={16} className="text-black" />
                  <span>自动周报: 开启</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-ink-600 uppercase">
                  <MessageSquare size={16} className="text-black" />
                  <span>Discord 实时推送: 开启</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
