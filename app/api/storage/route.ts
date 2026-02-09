import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const getStoragePath = () => path.join(process.cwd(), 'data/storage.json');

export async function GET() {
  try {
    // Vercel 优先读取 Supabase 数据
    const { data: agents } = await supabase.from('ops_agents').select('*');
    const { data: events } = await supabase.from('ops_events').select('*').order('created_at', { ascending: false }).limit(30);
    
    if (agents && events) {
      return NextResponse.json({
        agents: agents.map(a => ({
          id: a.id,
          name: a.name,
          role: a.role,
          status: a.status,
          affect: a.affect,
          lastAction: a.last_action,
          model: a.model
        })),
        events: events.reverse().map(e => ({
          id: e.id,
          timestamp: e.meta?.timestamp || 'unknown',
          agent: e.agent_id.toUpperCase(),
          content: e.content,
          color: e.meta?.color || 'text-green-400'
        }))
      });
    }

    // Fallback 到本地 (仅限本地开发环境)
    const filePath = getStoragePath();
    const fileContents = await fs.readFile(filePath, 'utf8');
    return NextResponse.json(JSON.parse(fileContents));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.type === 'MISSION') {
      // 在 Supabase 插入一个特殊的指令事件
      await supabase.from('ops_events').insert([{
        agent_id: 'minion', // 默认发给统筹官
        kind: 'mission',
        content: body.content,
        meta: { 
          is_new_mission: true, 
          timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
          color: 'text-accent' 
        }
      }]);
      return NextResponse.json({ success: true });
    }

    // 传统的本地写入 (在 Vercel 上会失效，但本地可用)
    try {
      const filePath = getStoragePath();
      const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
      Object.assign(data, body);
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch(e) {}

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
