"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "../../components/AppShell";
import { FileText, Target, Zap, Download, ExternalLink, Archive, Loader2 } from "lucide-react";

export default function GalleryPage() {
  const [artifacts, setArtifacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtifacts = async () => {
      try {
        const response = await fetch('/api/storage');
        const data = await response.json();
        // Assume the API might need updating to return missions
        // For now, let's pretend we're getting them
        if (data.missions) {
          setArtifacts(data.missions);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchArtifacts();
  }, []);

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
              Total_Artifacts: {artifacts.length}
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center p-20">
            <Loader2 className="animate-spin text-accent" size={48} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {artifacts.map((item) => (
              <div key={item.id} className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-ink-50 border-2 border-black flex items-center justify-center">
                      <Target className="text-red-500" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-accent uppercase mb-1">DOCKET_ID: {item.id.substring(0,8)}</div>
                      <h3 className="text-xl font-black pixel-ch-text leading-tight">{item.title}</h3>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-ink-700 leading-relaxed pixel-ch-text mb-6 bg-ink-50 p-4 border-2 border-black border-dashed max-h-40 overflow-y-auto whitespace-pre-wrap">
                  {item.result || "正在生成结果协议..."}
                </div>

                <div className="flex items-center gap-4 border-t-2 border-black pt-6">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-black text-white border-2 border-black text-xs font-black uppercase hover:bg-accent transition-colors">
                    <Download size={14} /> DOWNLOAD_LOG
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-white text-black border-2 border-black text-xs font-black uppercase hover:bg-ink-100 transition-colors">
                    <ExternalLink size={14} /> VIEW_FULL_MD
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 p-8 border-4 border-black border-dotted bg-ink-50 text-center">
          <h2 className="text-xl font-black pixel-ch-text uppercase mb-2">正在同步新成果...</h2>
          <p className="text-xs font-bold text-ink-500 uppercase tracking-widest">Section 9 成员正在后台全速作业，更多高价值档案即将解锁。</p>
        </div>
      </div>
    </AppShell>
  );
}
