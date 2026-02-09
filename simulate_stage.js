const fs = require('fs');
const path = require('path');

const STORAGE_PATH = path.join(__dirname, 'data/storage.json');

const DIALOGUE_POOL = [
  { agent: "ISHIKAWA-LOG", content: "提取完毕。MewYork 迷局的底层逻辑是典型的‘雪崩效应’测试。警察方的追捕路径与炸弹客的逃脱概率呈现非线性相关。", color: "text-blue-400" },
  { agent: "BATOU-SENSOR", content: "监测到推特上有关于‘桌游与反乌托邦’的讨论在升温。我们可以给《炸弹狂魔》打上‘硬核博弈’的标签。", color: "text-gray-400" },
  { agent: "TOGUSA-SCRIPT", content: "正在同步情感协议。营销文案将重点描绘‘在被封锁的 MewYork，谁才是最终的猎手’这种张力感。", color: "text-green-400" },
  { agent: "SAITO-SNIPER", content: "流量频段对准成功。预备发起一波小红书 KOL 联名狙击，命中率预计 85%。", color: "text-red-400" },
  { agent: "BORMA-SHELL", content: "合规性审计中。所有文案已通过品牌安全过滤。防火墙状态：GREEN。", color: "text-orange-400" },
  { agent: "ARAMAKI-01", content: "Section 9 所有人，按计划执行。我们要让全世界都知道，智研家不仅在卖桌游，更是在提供思维的武器。", color: "text-purple-400" }
];

function updateStage() {
  try {
    const data = JSON.parse(fs.readFileSync(STORAGE_PATH, 'utf8'));
    const nextDialogue = DIALOGUE_POOL[data.events.length % DIALOGUE_POOL.length];
    
    const timestamp = new Date().toLocaleTimeString('zh-CN', { hour12: false });
    const newEvent = {
      id: Date.now().toString(),
      timestamp,
      agent: nextDialogue.agent,
      content: nextDialogue.content,
      color: nextDialogue.color
    };

    data.events.push(newEvent);
    // Keep last 20 events
    if (data.events.length > 20) data.events.shift();

    // Update agent status randomly
    const agentToUpdate = data.agents[Math.floor(Math.random() * data.agents.length)];
    if (agentToUpdate) {
      agentToUpdate.status = ["thinking", "syncing", "diving", "scanning", "writing"][Math.floor(Math.random() * 5)];
      agentToUpdate.lastAction = nextDialogue.content.substring(0, 30) + "...";
    }

    fs.writeFileSync(STORAGE_PATH, JSON.stringify(data, null, 2));
    console.log(`[Stage] 已注入新信号: @${nextDialogue.agent}`);
  } catch (error) {
    console.error("Simulation failed", error);
  }
}

console.log("Section 9 Stage 模拟引擎已启动...");
setInterval(updateStage, 5000);
