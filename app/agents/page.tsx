"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "../../components/AppShell";
import { Users, Database, ShieldCheck, ChevronRight, Loader2, Sparkles, UserPlus, X, Save, BrainCircuit } from "lucide-react";

export default function AgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAgent, setEditingAgent] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/storage');
      const data = await response.json();
      if (data.agents) setAgents(data.agents);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleSave = async () => {
    if (!editingAgent) return;
    setIsSaving(true);
    try {
      const response = await fetch('/api/storage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'UPDATE_AGENT', 
          id: editingAgent.id,
          role: editingAgent.role,
          model: editingAgent.model
        })
      });
      
      if (response.ok) {
        setEditingAgent(null);
        await fetchAgents();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppShell>
      <div className="p-6 lg:p-10 bg-paper min-h-screen font-mono">
        <header className="mb-10 border-b-4 border-black pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-ink-900 pixel-ch-text uppercase tracking-tighter mb-2">Agent 团队配置</h1>
            <p className="text-sm font-bold text-ink-500 uppercase tracking-widest">管理 Section 9 全员及其灵魂参数。</p>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <section className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-3 mb-6 border-b-2 border-black pb-4">
                <Users className="text-accent" size={24} />
                <h2 className="text-xl font-black text-ink-900 pixel-ch-text uppercase">核心成员设置</h2>
              </div>
              
              {loading ? (
                <div className="flex justify-center p-12"><Loader2 className="animate-spin text-accent" /></div>
              ) : (
                <div className="space-y-4">
                  {agents.map((a) => (
                    <div key={a.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-ink-50 border-2 border-black hover:bg-white transition-colors group gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-black text-xs border-2 border-black group-hover:bg-accent transition-colors uppercase">
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
                      <button 
                        onClick={() => setEditingAgent({...a})}
                        className="flex items-center gap-1 text-[10px] font-black bg-black text-white px-3 py-1 hover:bg-accent transition-colors whitespace-nowrap"
                      >
                        EDIT_CORE <ChevronRight size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <div className="space-y-8">
            <section className="bg-ink-900 text-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-lg font-black mb-4 flex items-center gap-2 uppercase tracking-tighter">
                <ShieldCheck size={20} className="text-green-400" /> 系统状态
              </h2>
              <div className="space-y-4 font-mono text-[10px] font-bold uppercase text-ink-400">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span>OPENCLAW_CORE</span><span className="text-green-400">RUNNING</span>
                </div>
                <div className="flex justify-between">
                  <span>LAST_HEARTBEAT</span><span className="text-white">JUST_NOW</span>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Modal: Edit Core */}
        {editingAgent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white border-4 border-black w-full max-w-lg shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] flex flex-col">
              <div className="p-4 bg-black text-white flex justify-between items-center">
                <div className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <BrainCircuit size={16} className="text-accent" /> EDIT_GHOST_PROPERTIES
                </div>
                <button onClick={() => setEditingAgent(null)}><X size={20} /></button>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase mb-2">Agent Name / 灵魂代号</label>
                  <input 
                    type="text" 
                    value={editingAgent.name}
                    className="w-full bg-ink-50 border-2 border-black p-3 font-black text-sm focus:outline-none focus:bg-white"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase mb-2">Tactical Role / 战术职能</label>
                  <input 
                    type="text" 
                    value={editingAgent.role}
                    onChange={(e) => setEditingAgent({...editingAgent, role: e.target.value})}
                    className="w-full bg-white border-2 border-black p-3 font-bold text-sm focus:ring-2 focus:ring-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase mb-2">Compute Model / 算力模型</label>
                  <select 
                    value={editingAgent.model}
                    onChange={(e) => setEditingAgent({...editingAgent, model: e.target.value})}
                    className="w-full bg-white border-2 border-black p-3 font-bold text-sm outline-none cursor-pointer"
                  >
                    <optgroup label="Google">
                      <option value="google/gemini-3-flash-preview">Gemini 3 Flash Preview</option>
                      <option value="google/gemini-2.0-flash-exp">Gemini 2.0 Flash</option>
                    </optgroup>
                    <optgroup label="DeepSeek">
                      <option value="deepseek/deepseek-chat">DeepSeek V3 (Chat)</option>
                      <option value="deepseek/deepseek-reasoner">DeepSeek R1 (Reasoner)</option>
                    </optgroup>
                    <optgroup label="OpenAI">
                      <option value="openai/gpt-4o">GPT-4o</option>
                      <option value="openai/o1-mini">o1 Mini</option>
                      <option value="openai/gpt-4o-mini">GPT-4o Mini</option>
                    </optgroup>
                    <optgroup label="Anthropic">
                      <option value="anthropic/claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                      <option value="anthropic/claude-3-5-haiku">Claude 3.5 Haiku</option>
                    </optgroup>
                    <optgroup label="Local (OpenClaw)">
                      <option value="lmstudio/qwen3-coder-next-mlx">Qwen 3 Coder Next (MLX)</option>
                    </optgroup>
                  </select>
                </div>
              </div>
              <div className="p-6 bg-ink-50 border-t-4 border-black flex justify-end gap-4">
                <button 
                   onClick={() => setEditingAgent(null)}
                   className="px-6 py-2 border-2 border-black text-xs font-black uppercase hover:bg-ink-100"
                >Cancel</button>
                <button 
                  onClick={handleSave}
                  className="px-6 py-2 bg-black text-white border-2 border-black text-xs font-black uppercase hover:bg-accent flex items-center gap-2"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} 
                  Inject_Parameters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
