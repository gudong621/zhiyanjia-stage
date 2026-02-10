# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Zhiyanjia Stage (智研家 Stage)** - A Section 9-inspired AI multi-agent growth engine featuring 6 specialized AI agents that collaborate on marketing and research tasks in real-time. The project combines a Ghost in the Shell cyberpunk aesthetic with practical AI orchestration.

**Theme:** Anime-inspired tactical UI with pixel fonts, brutalist design, and character sprites for each agent.

## Development Commands

```bash
# Frontend development (Next.js)
npm run dev          # Start Next.js dev server (Turbopack disabled)

# Production
npm run build        # Build for production
npm start            # Start production server

# Agent orchestration engine (separate process)
node roundtable_engine.cjs    # Run the Ghost Engine (requires OpenClaw CLI)

# Utilities
node sync_to_supabase.cjs      # Sync local storage.json to Supabase
node simulate_stage.cjs        # Run stage simulation
```

**Prerequisites:** Node.js 20+, npm

## Architecture

### Three-Tier Hybrid Architecture

```
┌─────────────────────────────────────────┐
│  Vercel (Presentation Layer)            │
│  - Next.js 16 App Router                │
│  - Real-time UI with polling            │
└──────────────┬──────────────────────────┘
               │ HTTPS API (every 3-10s)
┌──────────────▼──────────────────────────┐
│  Supabase (Cloud Memory Layer)          │
│  - ops_agents (Agent status)            │
│  - ops_events (Conversation stream)     │
│  - ops_missions (Generated artifacts)   │
└──────────────┬──────────────────────────┘
               │ Polling (every 15-20s)
┌──────────────▼──────────────────────────┐
│  Local Machine (Intelligence Layer)     │
│  - Ghost Engine (roundtable_engine.cjs) │
│  - OpenClaw Agent Core                  │
│  - Real AI reasoning & decision making  │
└─────────────────────────────────────────┘
```

**Key Design Decision:** The frontend is stateless and can display static/synced data. The actual AI reasoning happens locally via `roundtable_engine.cjs` which polls Supabase for missions and generates agent responses.

### The Six Agents (Section 9)

| ID | Name | Role | Model |
|----|------|------|-------|
| minion | ARAMAKI-01 | Chief Coordinator | claude-opus-4.6 |
| sage | ISHIKAWA-LOG | Product Expert | gpt-5.3-codex |
| scout | BATOU-SENSOR | Market Intelligence | gemini-3-flash |
| quill | TOGUSA-SCRIPT | Creative Director | claude-sonnet-4.5 |
| xalt | SAITO-SNIPER | Social Media Ops | gemini-3-pro |
| observer | BORMA-SHELL | Quality Auditor | gpt-5.3-codex |

**Agent Sequence:** The engine cycles agents in fixed order (minion → sage → scout → quill → xalt → observer). After the 6th agent responds, an artifact is auto-generated.

### Data Flow

1. User submits mission via `/stage` → creates event in Supabase `ops_events` (kind='mission')
2. Ghost Engine polls every 15-20s, detects new mission
3. Each agent responds in sequence via OpenClaw CLI → stored in `ops_events`
4. After 6th agent → generates artifact → stored in `ops_missions`
5. Frontend polls `/api/storage` every 3-10s → displays updates

### Key Directories

- `app/` - Next.js 16 App Router pages
  - `page.tsx` - Landing page with live agent feed
  - `stage/page.tsx` - Main command console & visualization
  - `agents/page.tsx` - Agent configuration panel
  - `gallery/page.tsx` - Artifact/result gallery
  - `api/storage/route.ts` - Unified data endpoint (Supabase + local fallback)

- `components/`
  - `VirtualOffice.tsx` - 2D office visualization with slot-based agent positioning
  - `AppShell.tsx` - Main layout with navigation
  - `AuthProvider.tsx` - Supabase auth context

- `lib/services/`
  - `ai-service.ts` - AI integration (fal.ai, Google)
  - `run-service.ts` - Run state management with status transitions
  - `credits.ts` - Credit system logic
  - `stripe-service.ts` - Payment processing

- `lib/supabase/`
  - `client.ts` - Browser Supabase client
  - `server.ts` - Server Supabase client
  - `types.ts` - Database type definitions

### Database Schema (Supabase)

See `SCHEMA.sql` for full schema. Key tables:

- **ops_agents** - Agent configuration, status, affect (personality), model assignment
- **ops_events** - All events: chats, missions, warnings with metadata
- **ops_missions** - Generated artifacts/results with status workflow
- **ops_relationships** - Agent affinity system (currently unused)

## Important Patterns

### Graceful Degradation

The `/api/storage` endpoint implements a fallback pattern:
1. Try Supabase first
2. If unavailable, fall back to local `data/storage.json`
3. This allows frontend to work even during Supabase outages

### Virtual Office Positioning System

The `VirtualOffice.tsx` component uses a **slot-based positioning system**:
- Meeting table at (45, 40) with 6 predefined slots
- Each agent has a "home" furniture location
- Agents move to meeting slots when speaking
- Tachikoma characters (mini spider tanks) roam and follow speakers

See `FURNITURE` array and `AGENT_DATA` in `components/VirtualOffice.tsx` for home positions.

### Run State Machine

`lib/services/run-service.ts` implements a state machine for runs:
```
pending → running → completed
                ↘ failed
```
Use `canTransition(from, to)` to validate transitions before updating.

### Agent Personalities

Agent personalities ("Souls") are defined in Chinese in `AGENTS_SOULS.md`. These are injected into prompts by `roundtable_engine.cjs` to guide agent responses.

### OpenClaw CLI Integration

The Ghost Engine uses the OpenClaw CLI for AI responses:
```bash
openclaw agent --agent main --message "..."
```
This is an external tool - ensure it's installed when running the engine locally.

## Environment Variables

Required (see `.env.local` or Vercel settings):
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase connection
- `SUPABASE_SERVICE_ROLE_KEY` - Server-side Supabase access
- `R2_*` - Cloudflare R2 storage credentials
- `FAL_KEY` - fal.ai API key
- `STRIPE_*` - Stripe payment processing
- `AI_GATEWAY_API_KEY` - Vercel AI Gateway (optional)

## Deployment

- **Frontend:** Vercel (https://zhiyanjia-stage.vercel.app)
- **Database:** Supabase (https://ghvnbvpunaquqyetaaem.supabase.co)
- **Storage:** Cloudflare R2

The Ghost Engine (`roundtable_engine.cjs`) runs locally and requires OpenClaw CLI. It is NOT deployed to Vercel - it runs as a separate process on your local machine.

## Styling System

- **Fonts:** Press Start 2P, DotGothic16, VT323 (pixel/retro gaming fonts)
- **Colors:** Defined in `app/globals.css` (--color-ink, --color-paper, --color-accent, etc.)
- **Design:** Brutalist borders, noise textures, glitch animations
- **Components:** Consistent styling via `lib/ui/` utilities

## Legacy: CopyBack Studio

The codebase includes original "CopyBack Studio" features in `/studio` routes:
- Text extraction from banners
- Multi-language translation
- Layout verification
- Batch processing with credit billing

This functionality is preserved but secondary to the main agent orchestration system.
