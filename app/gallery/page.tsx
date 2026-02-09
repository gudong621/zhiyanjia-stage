"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "../../components/AppShell";
import { FileText, Target, Zap, Download, ExternalLink, Archive, Loader2, X, Maximize2 } from "lucide-react";

export default function GalleryPage() {
  const [artifacts, setArtifacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArtifact, setSelectedArtifact] = useState<any>(null);

  useEffect(() => {
    const fetchArtifacts = async () => {
      try {
        const response = await fetch('/api/storage');
        const data = await response.json();
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

  const downloadFile = (item: any) => {
    const element = document.createElement("a");
    const file = new Blob([item.result || ""], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = `${item.title.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <AppShell>
      <div className="p-6 lg:p-10 bg-paper min-h-screen font-mono text-black relative">
        <header className="mb-10 border-b-4 border-black pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-ink-900 pixel-ch-text uppercase tracking-tighter mb-2">成果陈列馆</h1>
            <p className="text-sm font-bold text-ink-500 uppercase tracking-widest">点击卡片即可全屏预览 Section 9 核心机密档案。</p>
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
              <div 
                key={item.id} 
                onClick={() => setSelectedArtifact(item)}
                className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer group relative"
              >
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 size={20} className="text-accent" />
                </div>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-ink-50 border-2 border-black flex items-center justify-center group-hover:bg-accent transition-colors">
                      <Target className="text-red-500 group-hover:text-white" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-accent uppercase mb-1">DOCKET_ID: {item.id.substring(0,8)}</div>
                      <h3 className="text-xl font-black pixel-ch-text leading-tight">{item.title}</h3>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-ink-700 leading-relaxed pixel-ch-text mb-6 bg-ink-50 p-4 border-2 border-black border-dashed max-h-40 overflow-hidden relative">
                  <div className="whitespace-pre-wrap">{item.result || "正在同步 Ghost 协议..."}</div>
                  <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-ink-50 to-transparent"></div>
                </div>

                <div className="flex items-center gap-4 border-t-2 border-black pt-6">
                  <button 
                    onClick={(e) => { e.stopPropagation(); downloadFile(item); }}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-black text-white border-2 border-black text-xs font-black uppercase hover:bg-accent transition-colors"
                  >
                    <Download size={14} /> DOWNLOAD_MD
                  </button>
                  <div className="text-[10px] font-black uppercase text-ink-400">Click to Preview</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Preview */}
        {selectedArtifact && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/60 backdrop-blur-sm">
            <div className="bg-white border-4 border-black w-full max-w-4xl max-h-full overflow-hidden flex flex-col shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
              <div className="p-4 bg-black text-white flex items-center justify-center relative">
                <div className="text-xs font-black tracking-widest uppercase">GHOST_PREVIEW // {selectedArtifact.id.substring(0,12)}</div>
                <button 
                  onClick={() => setSelectedArtifact(null)}
                  className="absolute right-4 hover:text-accent transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-8 md:p-12 overflow-y-auto flex-1">
                <div className="max-w-2xl mx-auto">
                    <div className="mb-8 border-l-8 border-accent pl-6">
                        <div className="text-xs font-black text-accent uppercase mb-2">Operation Summary</div>
                        <h2 className="text-3xl font-black pixel-ch-text leading-tight">{selectedArtifact.title}</h2>
                    </div>
                    <div className="prose prose-slate max-w-none">
                        <div className="text-lg text-ink-900 leading-relaxed whitespace-pre-wrap font-medium">
                            {selectedArtifact.result}
                        </div>
                    </div>
                </div>
              </div>
              <div className="p-6 border-t-4 border-black bg-ink-50 flex justify-between items-center">
                <div className="text-[10px] font-black text-ink-400 uppercase">Status: Document_Verified // Clear_Level: 04</div>
                <button 
                  onClick={() => downloadFile(selectedArtifact)}
                  className="flex items-center gap-2 px-6 py-2 bg-black text-white border-2 border-black text-xs font-black uppercase hover:bg-accent transition-colors"
                >
                  <Download size={16} /> Save_to_Local
                </button>
              </div>
            </div>
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
