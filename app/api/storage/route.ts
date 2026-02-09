import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

const getStoragePath = () => path.join(process.cwd(), 'data/storage.json');

export async function GET() {
  try {
    const filePath = getStoragePath();
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const filePath = getStoragePath();
    const data = JSON.parse(await fs.readFile(filePath, 'utf8'));

    if (body.type === 'MISSION') {
      // 插入一条真实任务
      const newEvent = {
        id: `mission-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
        agent: "COMMANDER",
        content: `[NEW_MISSION_RECEIVED] 指令载入：${body.content}`,
        color: "text-accent"
      };
      data.events.push(newEvent);
      // 同时写入一个待办标志位，让我的后台脚本能捕捉到
      data.pendingMission = body.content;
    } else {
      // 普通更新
      Object.assign(data, body);
    }

    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
