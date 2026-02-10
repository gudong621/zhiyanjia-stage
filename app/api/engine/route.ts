import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateText } from 'ai';

// Supabase 客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Agent 映射
const AGENT_SEQUENCE = ["ARAMAKI-01", "ISHIKAWA-LOG", "BATOU-SENSOR", "TOGUSA-SCRIPT", "SAITO-SNIPER", "BORMA-SHELL"];
const AGENT_ID_MAP: Record<string, string> = {
  "ARAMAKI-01": "minion",
  "ISHIKAWA-LOG": "sage",
  "BATOU-SENSOR": "scout",
  "TOGUSA-SCRIPT": "quill",
  "SAITO-SNIPER": "xalt",
  "BORMA-SHELL": "observer"
};
const ID_TO_NAME: Record<string, string> = {
  "minion": "ARAMAKI-01",
  "sage": "ISHIKAWA-LOG",
  "scout": "BATOU-SENSOR",
  "quill": "TOGUSA-SCRIPT",
  "xalt": "SAITO-SNIPER",
  "observer": "BORMA-SHELL"
};

// 获取 AI 模型
async function getModel(provider: string, model: string, apiKey?: string) {
  switch (provider) {
    case 'openai': {
      const { createOpenAI } = await import('@ai-sdk/openai');
      const client = createOpenAI({
        apiKey: apiKey || process.env.OPENAI_API_KEY,
      });
      return client(model) as any;
    }
    case 'anthropic': {
      const { createAnthropic } = await import('@ai-sdk/anthropic');
      const client = createAnthropic({
        apiKey: apiKey || process.env.ANTHROPIC_API_KEY,
      });
      return client(model) as any;
    }
    case 'google': {
      const { google } = await import('@ai-sdk/google');
      // Google SDK 使用环境变量，不支持自定义 apiKey
      return google(model) as any;
    }
    case 'deepseek': {
      const { createOpenAI } = await import('@ai-sdk/openai');
      const client = createOpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: apiKey || process.env.DEEPSEEK_API_KEY,
      });
      return client(model) as any;
    }
    case 'zhipu': {
      const { createOpenAI } = await import('@ai-sdk/openai');
      const client = createOpenAI({
        baseURL: 'https://open.bigmodel.cn/api/paas/v4/',
        apiKey: apiKey || process.env.ZHIPU_API_KEY,
      });
      return client(model) as any;
    }
    case 'moonshot': {
      const { createOpenAI } = await import('@ai-sdk/openai');
      const client = createOpenAI({
        baseURL: 'https://api.moonshot.cn/v1',
        apiKey: apiKey || process.env.MOONSHOT_API_KEY,
      });
      return client(model) as any;
    }
    default:
      // 默认使用 Google Gemini（已有配置）
      const { google } = await import('@ai-sdk/google');
      return google('gemini-3-flash') as any;
  }
}

// 获取 Agent 响应
async function getGhostResponse(agentName: string, agentId: string, context: string, missionPrompt: string) {
  const { data: agentData } = await supabase
    .from('ops_agents')
    .select('affect, role, model, provider, api_key')
    .eq('id', agentId)
    .single();

  const soul = agentData?.affect || "专业、敏锐、有个性。";
  const role = agentData?.role || "战术顾问";
  const provider = agentData?.provider || 'openai';
  const model = agentData?.model || 'gpt-4.1';
  const apiKey = agentData?.api_key;

  let prompt: string;
  if (missionPrompt) {
    prompt = `你是 Section 9 的 ${agentName} (${role})。新任务： "${missionPrompt}"。任务：带头脑暴。直接说想法，别写总结，别提到上级。口语化。`;
  } else {
    prompt = `你是 Section 9 的 ${agentName} (${role})。性格：${soul}。当前讨论：${context}。任务：对讨论发表看法。要求：【禁止】提到指挥官、课长。口语化，50字内。`;
  }

  try {
    const aiModel = await getModel(provider, model, apiKey);
    const { text } = await generateText({
      model: aiModel,
      prompt,
    });
    return text.replace(/(指挥官|课长|老板|上级)/g, '大家');
  } catch (e) {
    console.error(`[${agentName}] AI Error:`, e);
    return `[信号丢失] ${agentName} 暂时掉线。`;
  }
}

// 生成档案
async function generateArtifact(missionContent: string, history: string, eventId: string) {
  // 检查是否已生成
  const { data: existing } = await supabase
    .from('ops_missions')
    .select('id')
    .eq('description', `${missionContent} (Ref: ${eventId})`)
    .limit(1);

  if (existing && existing.length > 0) return;

  console.log(`🚀 [Ghost] 正在为事件 ${eventId} 生成纯净深度全案...`);

  const prompt = `你现在是智研家实验室的首席策划 ARAMAKI-01。任务：根据讨论撰写《${missionContent}》整合营销全案。要求：禁止杂讯，字数1200+，段落详实。`;

  try {
    // 使用 minion 的配置
    const { data: minionData } = await supabase
      .from('ops_agents')
      .select('model, provider, api_key')
      .eq('id', 'minion')
      .single();

    const aiModel = await getModel(
      minionData?.provider || 'anthropic',
      minionData?.model || 'claude-opus-4.6',
      minionData?.api_key
    );

    const { text } = await generateText({ model: aiModel, prompt });
    const finalContent = text.trim();

    if (finalContent.length < 500) return;

    const displayTitle = missionContent.includes("发展方向")
      ? "【战略蓝图】智研家 Stage 2.0 升级计划"
      : missionContent.includes("人类")
      ? "【哲学档案】AI 时代的人类价值报告"
      : `正式档案: ${missionContent.substring(0, 15)}`;

    await supabase.from('ops_missions').insert([
      {
        title: displayTitle,
        description: `${missionContent} (Ref: ${eventId})`,
        status: 'completed',
        result: finalContent,
        assigned_to: 'minion'
      }
    ]);
    console.log(`✅ [Ghost] 档案已归档: ${displayTitle}`);
  } catch (e) {
    console.error("Artifact generation failed", e);
  }
}

// 引擎主循环
async function tick() {
  try {
    // 检查新任务
    const { data: missions } = await supabase
      .from('ops_events')
      .select('*')
      .eq('kind', 'mission')
      .eq('meta->is_new_mission', true)
      .order('created_at', { ascending: false })
      .limit(1);

    let activeMission: string | null = null;

    if (missions && missions.length > 0) {
      activeMission = missions[0].content;
      await supabase
        .from('ops_events')
        .update({
          meta: { ...missions[0].meta, is_new_mission: false, handled: true }
        })
        .eq('id', missions[0].id);
      console.log(`[Ghost] 捕获新指令: ${activeMission}`);
    }

    // 获取历史记录
    const { data: history } = await supabase
      .from('ops_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    // 确定下一个发言的 Agent
    let nextName = "ARAMAKI-01";
    if (!activeMission && history && history.length > 0) {
      const lastId = history[0].agent_id;
      const lastIndex = AGENT_SEQUENCE.indexOf(ID_TO_NAME[lastId] || "ARAMAKI-01");
      nextName = AGENT_SEQUENCE[(lastIndex + 1) % AGENT_SEQUENCE.length];
    }

    // 构建对话上下文
    const chatContext = history
      ?.reverse()
      .map(h => `${ID_TO_NAME[h.agent_id] || h.agent_id}: ${h.content}`)
      .join('\n') || "";

    // 获取响应
    const response = await getGhostResponse(
      nextName,
      AGENT_ID_MAP[nextName],
      chatContext,
      activeMission || undefined
    );

    const timestamp = new Date().toLocaleTimeString('zh-CN', { hour12: false });

    // 保存事件
    const { data: newEvent } = await supabase
      .from('ops_events')
      .insert([
        {
          agent_id: AGENT_ID_MAP[nextName],
          kind: 'chat',
          content: response,
          meta: { timestamp, color: 'text-green-100' }
        }
      ])
      .select();

    // 更新 Agent 状态
    await supabase
      .from('ops_agents')
      .update({
        status: activeMission ? 'syncing' : 'thinking',
        last_action: response.substring(0, 50) + "..."
      })
      .eq('id', AGENT_ID_MAP[nextName]);

    // 如果是最后一个 Agent，生成档案
    if (nextName === "BORMA-SHELL" && newEvent) {
      const { data: lastMission } = await supabase
        .from('ops_events')
        .select('content')
        .eq('kind', 'mission')
        .order('created_at', { ascending: false })
        .limit(1);

      const missionToArchive = lastMission?.[0]?.content || "日常巡逻演练";
      await generateArtifact(missionToArchive, chatContext, newEvent[0].id);
    }

    return { success: true, agent: nextName, response };
  } catch (e) {
    console.error("Engine Error:", e);
    return { success: false, error: (e as Error).message };
  }
}

// GET 请求：执行一次引擎 tick
export async function GET() {
  const result = await tick();
  return NextResponse.json(result);
}

// POST 请求：手动触发（可选）
export async function POST() {
  const result = await tick();
  return NextResponse.json(result);
}
