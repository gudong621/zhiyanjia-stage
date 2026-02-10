"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "../../components/AppShell";
import { Users, Database, ShieldCheck, ChevronRight, Loader2, Sparkles, UserPlus, X, Save, BrainCircuit, Fingerprint, Edit3, Plus } from "lucide-react";

// 常用模型预设
const MODEL_PRESETS: Record<string, { models: string[], label: string }> = {
  openai: {
    models: ['gpt-4.1', 'gpt-4o', 'o1-preview', 'o1-mini', 'gpt-4o-mini'],
    label: 'OpenAI'
  },
  anthropic: {
    models: ['claude-opus-4.6', 'claude-sonnet-4.5', 'claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307'],
    label: 'Anthropic'
  },
  google: {
    models: ['gemini-2.5-pro-exp', 'gemini-2.0-flash-exp', 'gemini-1.5-pro', 'gemini-1.5-flash'],
    label: 'Google'
  },
  deepseek: {
    models: ['deepseek-chat', 'deepseek-coder'],
    label: 'DeepSeek'
  },
  zhipu: {
    models: ['glm-4-plus', 'glm-4-air', 'glm-4-flash'],
    label: '智谱'
  },
  moonshot: {
    models: ['moonshot-v1-128k', 'moonshot-v1-32k', 'moonshot-v1-8k'],
    label: '月之暗面'
  },
};

export default function AgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAgent, setEditingAgent] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [useCustomProvider, setUseCustomProvider] = useState(false);
  const [useCustomModel, setUseCustomModel] = useState(false);

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
          model: editingAgent.model,
          provider: editingAgent.provider,
          api_key: editingAgent.api_key,
          soul: editingAgent.soul
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
      <div className="p-6 lg:p-10 bg-paper min-h-screen font-mono text-black">
        <header className="mb-10 border-b-4 border-black pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-ink-900 pixel-ch-text uppercase tracking-tighter mb-2">Agent 团队配置</h1>
            <p className="text-sm font-bold text-ink-500 uppercase tracking-widest">注入灵魂参数，定义每一位 Agent 的 Ghost 核心。</p>
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
                        onClick={() => {
                          setEditingAgent({...a});
                          setUseCustomProvider(!Object.keys(MODEL_PRESETS).includes(a.provider || ''));
                          setUseCustomModel(!MODEL_PRESETS[a.provider || 'openai']?.models.includes(a.model));
                        }}
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white border-4 border-black w-full max-w-2xl shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] flex flex-col my-8">
              <div className="p-4 bg-black text-white flex justify-between items-center sticky top-0">
                <div className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <BrainCircuit size={16} className="text-accent" /> EDIT_GHOST_PROPERTIES
                </div>
                <button onClick={() => { setEditingAgent(null); }}><X size={20} /></button>
              </div>

              <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* 基本信息 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase mb-2">Agent ID</label>
                    <input
                      type="text"
                      value={editingAgent.id}
                      className="w-full bg-ink-50 border-2 border-black p-3 font-black text-sm"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase mb-2">Tactical Role / 职位</label>
                    <input
                      type="text"
                      value={editingAgent.role}
                      onChange={(e) => setEditingAgent({...editingAgent, role: e.target.value})}
                      className="w-full bg-white border-2 border-black p-3 font-bold text-sm outline-none"
                    />
                  </div>
                </div>

                {/* 系统提示词 */}
                <div>
                  <label className="block text-[10px] font-black uppercase mb-2 flex items-center gap-2">
                    <Fingerprint size={14} className="text-accent" />
                    System Prompt / 系统提示词 (Soul)
                  </label>
                  <textarea
                    value={editingAgent.soul || ""}
                    onChange={(e) => setEditingAgent({...editingAgent, soul: e.target.value})}
                    placeholder="定义 Agent 的性格、说话风格、专业知识背景等..."
                    className="w-full bg-white border-2 border-black p-3 font-bold text-sm outline-none min-h-[100px] font-mono"
                  />
                  <p className="text-[8px] text-ink-400 mt-1 uppercase">这将被注入到每次 AI 调用的系统提示中</p>
                </div>

                {/* AI 提供商 */}
                <div>
                  <label className="block text-[10px] font-black uppercase mb-2 flex items-center gap-2">
                    <Sparkles size={14} className="text-accent" />
                    AI Provider / AI 提供商
                  </label>

                  {!useCustomProvider ? (
                    <div className="flex gap-2">
                      <select
                        value={editingAgent.provider || 'openai'}
                        onChange={(e) => {
                          setEditingAgent({...editingAgent, provider: e.target.value});
                          setUseCustomModel(false);
                        }}
                        className="flex-1 bg-white border-2 border-black p-3 font-bold text-sm outline-none cursor-pointer"
                      >
                        {Object.entries(MODEL_PRESETS).map(([key, { label }]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => setUseCustomProvider(true)}
                        className="px-3 py-2 border-2 border-black bg-ink-50 hover:bg-ink-100 text-xs font-black uppercase"
                        title="自定义提供商"
                      >
                        <Edit3 size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingAgent.provider || ''}
                        onChange={(e) => setEditingAgent({...editingAgent, provider: e.target.value})}
                        placeholder="输入自定义提供商名称 (如: openai, anthropic, groq, together)"
                        className="flex-1 bg-white border-2 border-black p-3 font-bold text-sm outline-none"
                      />
                      <button
                        onClick={() => {
                          setUseCustomProvider(false);
                          setEditingAgent({...editingAgent, provider: 'openai'});
                        }}
                        className="px-3 py-2 border-2 border-black bg-ink-50 hover:bg-ink-100 text-xs font-black uppercase"
                        title="使用预设"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* 模型选择 */}
                <div>
                  <label className="block text-[10px] font-black uppercase mb-2">
                    Model / 模型名称
                  </label>

                  {!useCustomModel && !useCustomProvider && MODEL_PRESETS[editingAgent.provider || 'openai'] ? (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {MODEL_PRESETS[editingAgent.provider || 'openai'].models.map((model) => (
                          <button
                            key={model}
                            onClick={() => setEditingAgent({...editingAgent, model})}
                            className={`px-3 py-2 border-2 text-xs font-black uppercase transition-all ${
                              editingAgent.model === model
                                ? 'bg-black text-white border-black'
                                : 'bg-white border-black hover:bg-ink-50'
                            }`}
                          >
                            {model}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setUseCustomModel(true)}
                        className="flex items-center gap-1 text-[10px] font-black text-accent hover:underline uppercase"
                      >
                        <Plus size={12} /> 自定义模型
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingAgent.model}
                          onChange={(e) => setEditingAgent({...editingAgent, model: e.target.value})}
                          placeholder="输入模型名称，如: gpt-4o, claude-opus-4.6, gemini-2.5-pro"
                          className="flex-1 bg-white border-2 border-black p-3 font-bold text-sm outline-none font-mono"
                        />
                        {!useCustomProvider && (
                          <button
                            onClick={() => {
                              setUseCustomModel(false);
                              setEditingAgent({...editingAgent, model: MODEL_PRESETS[editingAgent.provider || 'openai']?.models[0] || 'gpt-4.1'});
                            }}
                            className="px-3 py-2 border-2 border-black bg-ink-50 hover:bg-ink-100 text-xs font-black uppercase"
                            title="使用预设"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                      <p className="text-[8px] text-ink-400 uppercase">
                        当前值: <code className="bg-ink-100 px-1">{editingAgent.model || '未设置'}</code>
                      </p>
                    </div>
                  )}
                </div>

                {/* API Key */}
                <div>
                  <label className="block text-[10px] font-black uppercase mb-2 flex items-center gap-2">
                    <Sparkles size={14} className="text-accent" />
                    API Key (可选)
                  </label>
                  <input
                    type="password"
                    value={editingAgent.api_key || ""}
                    onChange={(e) => setEditingAgent({...editingAgent, api_key: e.target.value})}
                    placeholder="留空则使用系统默认 API Key"
                    className="w-full bg-white border-2 border-black p-3 font-bold text-sm outline-none font-mono"
                  />
                  <p className="text-[8px] text-ink-400 mt-1 uppercase">
                    留空则使用系统环境变量中的 API Key (如 OPENAI_API_KEY)
                  </p>
                </div>
              </div>

              <div className="p-6 bg-ink-50 border-t-4 border-black flex justify-end gap-4 sticky bottom-0">
                <button
                   onClick={() => { setEditingAgent(null); }}
                   className="px-6 py-2 border-2 border-black text-xs font-black uppercase hover:bg-ink-100"
                >Cancel</button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-black text-white border-2 border-black text-xs font-black uppercase hover:bg-accent flex items-center gap-2"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Save_Config
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
