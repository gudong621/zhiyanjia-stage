"use client";

import React from "react";
import Link from "next/link";
import { AppShell } from "../components/AppShell";
import { Button } from "../components/Button";
import { ArrowRight, BookOpen, Brain, Zap, Microscope } from "lucide-react";

export default function LandingPage() {
  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center min-h-[85vh] text-center pt-24 pb-12 bg-grid-pattern relative font-mono text-black">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-paper to-paper pointer-events-none"></div>

        <div className="relative z-10 px-4 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-white border-4 border-black px-3 py-1 text-[10px] font-black text-ink-600 mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase pixel-ch-text">
            <span className="w-2 h-2 bg-accent animate-pulse"></span>
            ZHIYANJIA STAGE - Section 9 智研情报组
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-ink-900 mb-8 max-w-4xl leading-[1.1] pixel-ch-text uppercase">
            24/7 <br className="hidden md:block" />
            GROWTH_ENGINE
          </h1>

          <p className="text-sm md:text-lg text-ink-600 max-w-2xl mb-12 leading-relaxed font-bold uppercase tracking-wide pixel-ch-text">
            家给人足，研精毕智。Section 9 [智研情报组] 的六位 AI Agent 梦之队，正在不知疲倦地为您打理{" "}
            <span className="text-ink-900 bg-accent/20 px-1 border-b-2 border-black">
              桌游产品营销、游戏化教案研发与全网流量增长
            </span>。
          </p>

          <div className="flex flex-col sm:flex-row gap-6 mb-24 w-full justify-center">
            <Link href="/stage">
              <button className="h-14 px-8 bg-black text-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(255,87,34,1)] text-xs font-black uppercase hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all pixel-ch-text">
                进入实验室看板 <ArrowRight className="inline-block ml-2 w-4 h-4" />
              </button>
            </Link>
            <Link href="/agents">
              <button className="h-14 px-8 bg-white text-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-xs font-black uppercase hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all pixel-ch-text">
                配置 Agent 团队
              </button>
            </Link>
          </div>

          <div id="how-it-works" className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left max-w-5xl border-t-4 border-black pt-16">
            <div className="group border-2 border-black p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="w-10 h-10 bg-blue-900 border-2 border-black flex items-center justify-center mb-4 text-white">
                <Brain size={20} />
              </div>
              <h3 className="font-black text-sm mb-2 text-ink-900 pixel-ch-text uppercase">1. 情报潜入</h3>
              <p className="text-[10px] font-bold text-ink-600 leading-relaxed uppercase pixel-ch-text">
                ISHIKAWA Agent 深度潜入智研家产品协议，挖掘每一款桌游背后的历史数据与规则内核。
              </p>
            </div>
            <div className="group border-2 border-black p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="w-10 h-10 bg-green-900 border-2 border-black flex items-center justify-center mb-4 text-white">
                <BookOpen size={20} />
              </div>
              <h3 className="font-black text-sm mb-2 text-ink-900 pixel-ch-text uppercase">2. 灵魂刻录</h3>
              <p className="text-[10px] font-bold text-ink-600 leading-relaxed uppercase pixel-ch-text">
                TOGUSA Agent 将产品机制映射至人类认知维度，自动生成具备生化灵魂的游戏化教育方案。
              </p>
            </div>
            <div className="group border-2 border-black p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="w-10 h-10 bg-red-900 border-2 border-black flex items-center justify-center mb-4 text-white">
                <Zap size={20} />
              </div>
              <h3 className="font-black text-sm mb-2 text-ink-900 pixel-ch-text uppercase">3. 精准狙击</h3>
              <p className="text-[10px] font-bold text-ink-600 leading-relaxed uppercase pixel-ch-text">
                SAITO Agent 实时追踪全网流量频段，发起精准营销狙击，实现智研品牌的影响力爆破。
              </p>
            </div>
          </div>

          <div className="mt-24 p-8 bg-black border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,0.1)] max-w-4xl w-full text-green-400">
            <div className="flex items-center gap-3 mb-6 border-b-2 border-green-900 pb-4">
              <Microscope size={24} className="text-accent" />
              <h2 className="text-lg font-black uppercase tracking-tighter pixel-ch-text">LIVE_FEED.LOG</h2>
            </div>
            <div className="space-y-4 text-left font-mono text-[10px] font-bold uppercase pixel-ch-text">
              <div className="flex gap-3 opacity-70">
                <span className="shrink-0">[05:05]</span>
                <span className="text-purple-400 pixel-en-text text-xs">@ARAMAKI-01:</span>
                <span>已下达《炸弹狂魔 (Catch the Bomber)》作战指令。</span>
              </div>
              <div className="flex gap-3 opacity-70">
                <span className="shrink-0">[05:08]</span>
                <span className="text-blue-400 pixel-en-text text-xs">@ISHIKAWA-LOG:</span>
                <span>正在提取 MewYork 迷局中“非对称博弈”机制与心理战的相关性。</span>
              </div>
              <div className="flex gap-3">
                <span className="shrink-0">[05:12]</span>
                <span className="text-orange-400 pixel-en-text text-xs">@TOGUSA-SCRIPT:</span>
                <span>生化文案同步中：为什么桌游是人类最后的真实社交避难所？</span>
              </div>
              <div className="pt-2 animate-pulse text-green-900">
                <span>▌ LISTENING_FOR_GHOST_SIGNALS...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
