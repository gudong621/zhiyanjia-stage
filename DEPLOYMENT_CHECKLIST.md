# 智研家 Stage - 云端化部署检查清单

**目标**: 将项目从本地 OpenClaw 驱动改造为完全云端运行（Supabase + Vercel）

---

## ✅ 代码改动（已完成）

- [x] `SCHEMA.sql` - 添加 `provider` 和 `api_key` 字段
- [x] `app/agents/page.tsx` - 添加 AI 提供商选择和 API Key 配置
- [x] `app/api/storage/route.ts` - 支持保存新配置字段
- [x] `app/api/engine/route.ts` - 新建云端 Ghost Engine
- [x] `package.json` - 添加 `@ai-sdk/openai` 和 `@ai-sdk/anthropic`
- [x] 依赖已安装

---

## 📋 部署步骤

### 第一步：Supabase 数据库迁移

去 Supabase 控制台 → SQL 编辑器，执行：

```sql
-- 添加新字段
ALTER TABLE ops_agents
  ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'openai',
  ADD COLUMN IF NOT EXISTS api_key TEXT;

-- 设置每个 Agent 的 provider（保持原有 model 不变）
UPDATE ops_agents SET provider = 'anthropic' WHERE id = 'minion';
UPDATE ops_agents SET provider = 'openai' WHERE id IN ('sage', 'observer');
UPDATE ops_agents SET provider = 'google' WHERE id IN ('scout', 'xalt');
UPDATE ops_agents SET provider = 'anthropic' WHERE id = 'quill';
```

**验证**: 查询 `SELECT id, name, model, provider FROM ops_agents;` 确认配置正确。

---

### 第二步：配置环境变量

#### 本地开发 (`.env.local`)

```bash
# 已有配置（保持不变）
NEXT_PUBLIC_SUPABASE_URL=*
NEXT_PUBLIC_SUPABASE_ANON_KEY=*
SUPABASE_SERVICE_ROLE_KEY=*
R2_ACCOUNT_ID=*
R2_ACCESS_KEY_ID=*
R2_SECRET_ACCESS_KEY=*
R2_ENDPOINT=*
R2_PUBLIC_BASE=*
R2_BUCKET=*
FAL_KEY=*
STRIPE_SECRET_KEY=*
STRIPE_WEBHOOK_SECRET=*
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=*
STRIPE_PRICE_ID_STARTER=*
STRIPE_PRICE_ID_PRO=*
STRIPE_PRICE_ID_ENTERPRISE=*
NEXT_PUBLIC_APP_URL=*
AI_GATEWAY_API_KEY=*
NEXT_PUBLIC_CREDITS_PER_IMAGE=6

# 新增：AI 提供商 API Key
OPENAI_API_KEY=sk-xxx                    # OpenAI（用于 sage, observer）
ANTHROPIC_API_KEY=sk-ant-xxx             # Anthropic（用于 minion, quill）
GOOGLE_GENERATIVE_AI_API_KEY=xxx         # Google（用于 scout, xalt）
DEEPSEEK_API_KEY=sk-xxx                  # DeepSeek（可选）
ZHIPU_API_KEY=xxx                        # 智谱（可选）
MOONSHOT_API_KEY=sk-xxx                  # 月之暗面（可选）
```

#### Vercel 环境变量

1. 访问 Vercel 项目 → Settings → Environment Variables
2. 添加上述新增的 API Key
3. **重要**: 确保包含 `SUPABASE_SERVICE_ROLE_KEY`（服务器端写入需要）

---

### 第三步：配置外部 Cron 服务

1. 访问 **https://cron-job.org**
2. 点击 "Create Cronjob"
3. 填写：
   - **Title**: Zhiyanjia Ghost Engine
   - **URL**: `https://zhiyanjia-stage.vercel.app/api/engine`
   - **Execution**: 每 15 秒（`*/15 * * * * *`）
4. 保存并启用

**替代方案**: 如果使用 Vercel Cron Jobs（Pro 版可用）
- 在项目根目录创建 `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/engine",
      "schedule": "*/1 * * * *"
    }
  ]
}
```
> 注意: Vercel Cron 最快 1 分钟，比 cron-job.org 的 15 秒慢

---

### 第四步：部署到 Vercel

```bash
# 提交代码
git add .
git commit -m "Cloud migration: AI provider configuration and engine API"
git push

# Vercel 会自动部署
```

---

### 第五步：测试

1. **测试引擎 API**:
   ```bash
   # 本地
   curl http://localhost:3000/api/engine

   # 云端
   curl https://zhiyanjia-stage.vercel.app/api/engine
   ```
   应该返回: `{"success": true, "agent": "ARAMAKI-01", "response": "..."}`

2. **测试 Agent 配置**:
   - 访问 `/agents` 页面
   - 编辑任意 Agent，确认能保存 provider 和 api_key

3. **测试完整流程**:
   - 访问 `/stage` 页面
   - 输入脑暴任务并提交
   - 等待 15-30 秒，观察 Agent 是否开始响应

---

## 🔧 故障排查

### Agent 没有响应？

1. **检查 Cron 日志**: cron-job.org 的执行历史
2. **检查 Vercel 日志**: 项目 → Deployment → Function Logs
3. **检查 API Key**: 确认环境变量已正确配置
4. **手动触发**: 直接访问 `/api/engine` 看是否有错误

### AI 调用失败？

1. **检查模型名称**: 确认 model 字段值与提供商支持的模型一致
2. **检查 API Key**: 在 `/agents` 页面配置 agent 专属 API Key，或使用系统默认
3. **查看 Vercel 日志**: 获取具体错误信息

### 数据库写入失败？

1. **确认使用 SERVICE_ROLE_KEY**: 服务器端写入需要 service role 权限
2. **检查 RLS 策略**: 确保允许 service role 写入

---

## 📊 改造前后对比

| 项目 | 改造前 | 改造后 |
|------|--------|--------|
| AI 调用 | 本地 OpenClaw CLI | 云端 AI SDK |
| Ghost Engine | 本地运行，需本地开机 | Vercel Edge Function，24/7 运行 |
| 触发方式 | 本地轮询（15秒） | 外部 Cron（15秒） |
| Agent 配置 | 只有 model 字段 | provider + model + api_key |
| 部署依赖 | 需要本地运行 Ghost Engine | 完全云端，无本地依赖 |

---

## 🎯 完成标志

当你看到以下情况时，说明部署成功：

- [ ] Cron-job.org 显示执行成功（绿色）
- [ ] Vercel Function Logs 无错误
- [ ] `/stage` 页面 Agent 正常响应
- [ ] `/gallery` 页面有生成的档案
- [ ] 本地 Ghost Engine (roundtable_engine.cjs) 可以关闭

---

**部署完成后，你可以关闭本地的 roundtable_engine.cjs 程序了！**
