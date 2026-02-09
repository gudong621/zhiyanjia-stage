/**
 * 智研家 Stage 核心统筹脚本 (Orchestrator)
 * 负责在 OpenClaw 后台驱动子 Agent 进行协作。
 */

import { sessions_spawn, sessions_send, message } from 'openclaw/tools';

const AGENTS = ['minion', 'sage', 'scout', 'quill', 'xalt', 'observer'];

async function startRoundtable(topic) {
    console.log(`[Stage] 开启圆桌会议: ${topic}`);
    
    // 1. 唤醒 Minion 引导讨论
    const minionSession = await sessions_spawn({
        label: 'minion-task',
        task: `你是智研家的首席统筹官 Minion。今天的讨论主题是：${topic}。请先开场，并点名老夫子或星探发言。`
    });

    // 2. 模拟圆桌流转 (简化版)
    // 实际运行中这里会根据 Supabase 的任务队列进行流转
}

// 示例：每 4 小时触发一次自动脑暴
// cron("0 */4 * * *", () => startRoundtable("如何利用 AI 提升桌游的沉浸式教育体验？"));
