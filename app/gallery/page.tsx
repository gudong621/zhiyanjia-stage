"use client";

import React from "react";
import { AppShell } from "../../components/AppShell";
import { FileText, Target, Zap, Download, ExternalLink, Archive } from "lucide-react";

const RESULTS = [
  {
    id: "plan-001",
    type: "OPERATIONAL_PLAN",
    title: "喵约行动 (MewYork Operation)",
    date: "2026-02-09",
    summary: "针对《炸弹狂魔》的非对称营销方案，包含核心叙事、受众画像及多维投放矩阵。",
    icon: <Target className="text-red-500" />,
    tags: ["战略", "炸弹狂魔", "喵约"]
  },
  {
    id: "copy-001",
    type: "COPY_MANUSCRIPT",
    title: "《谁是真正的猎手？》- 户草执笔",
    date: "2026-02-09",
    summary: "深邃且具张力的感性叙事文案，适用于小红书及朋友圈社交环境。",
    icon: <Zap className="text-orange-500" />,
    tags: ["文案", "小红书", "感性"]
  },
  {
    id: "edu-001",
    type: "EDU_SCHEME",
    title: "《交子行天下》金融进阶方案",
    date: "2026-02-09",
    summary: "融合大宋信用历史与现代财商逻辑的三阶教育大纲，涵盖资产配置与风险控制。",
    icon: <FileText className="text-blue-500" />,
    tags: ["教育", "交子", "财商"]
  }
];

export default function GalleryPage() {
  return (
    <AppShell>
      <div className="p-6 lg:p-10 bg-paper min-h-screen font-mono text-black">
        <header className="mb-10 border-b-4 border-black pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-ink-900 pixel-ch-text uppercase tracking-tighter mb-2">成果陈列馆</h1>
            <p className="text-sm font-bold text-ink-500 uppercase tracking-widest">展示 Section 9 情报组产出的所有核心机密档案与营销物料。</p>
          </div>
          <div className="flex gap-2">
            <div className="px-3 py-1 bg-black text-white text-[10px] font-black uppercase flex items-center gap-2">
              <Archive size={14} />
              Total_Artifacts: {RESULTS.length}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {RESULTS.map((item) => (
            <div key={item.id} className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-ink-50 border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-accent uppercase mb-1 tracking-tighter">ARTIFACT_TYPE: {item.type}</div>
                    <h3 className="text-xl font-black pixel-ch-text leading-tight">{item.title}</h3>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-ink-400 block uppercase">STAMPED_AT</span>
                  <span className="text-xs font-black">{item.date}</span>
                </div>
              </div>

              <p className="text-sm text-ink-700 leading-relaxed pixel-ch-text mb-6 bg-ink-50 p-4 border-2 border-black border-dashed">
                {item.summary}
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {item.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-black text-white text-[10px] font-black pixel-ch-text">#{tag}</span>
                ))}
              </div>

              <div className="flex items-center gap-4 border-t-2 border-black pt-6">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-black text-white border-2 border-black text-xs font-black uppercase hover:bg-accent transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                  <Download size={14} /> DOWNLOAD_DATA
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-white text-black border-2 border-black text-xs font-black uppercase hover:bg-ink-100 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                  <ExternalLink size={14} /> PREVIEW_LINK
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 border-4 border-black border-dotted bg-ink-50 text-center">
          <div className="w-16 h-16 bg-white border-4 border-black rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <Zap className="text-accent" size={32} />
          </div>
          <h2 className="text-xl font-black pixel-ch-text uppercase mb-2">正在同步新成果...</h2>
          <p className="text-xs font-bold text-ink-500 uppercase tracking-widest">Section 9 成员正在后台全速作业，更多高价值档案即将解锁。</p>
        </div>
      </div>
    </AppShell>
  );
}
