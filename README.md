# 🚀 Career Land API

**AI-powered career guidance backend** — built with [Hono](https://hono.dev), [Bun](https://bun.sh), and deployed on [Cloudflare Workers](https://workers.cloudflare.com).

Career Land API orchestrates an intelligent onboarding agent (powered by Google ADK / Gemini) that interviews users about their career goals, skills, and preferences, then generates a **personalised learning roadmap** as an interactive graph.

---

## ✨ Features

- **Google OAuth 2.0** — Secure sign-in via Google with JWT session tokens
- **AI Onboarding Agent** — Conversational, multi-turn agent that collects a complete user profile through structured questions
- **Roadmap Generation** — Converts the user profile into a graph-based career roadmap with nodes, edges, resources, and difficulty levels
- **Domain Classification** — Automatically maps free-text career domains (e.g. "Data Science", "UI/UX") into supported categories: `tech`, `business`, `academics`, `creative`, `sports`
- **MongoDB Persistence** — User accounts stored in MongoDB via Mongoose
- **Edge-first** — Runs on Cloudflare Workers with `nodejs_compat` for near-zero cold starts

---

## 🏗️ Architecture

```
src/
├── index.ts                 # App entrypoint — Hono app with CORS, logger, DB middleware
├── routes/
│   ├── index.ts             # /api router — mounts auth & onboarding sub-routes + /api/health
│   ├── auth.routes.ts       # /api/auth — Google OAuth flow + user session
│   └── onboarding.routes.ts # /api/onboarding — AI onboarding conversations
├── controller/
│   ├── auth.controller.ts   # Handles OAuth URL generation, callback, /me, logout
│   └── onboarding.controller.ts # Accepts queries (string or object), delegates to service
├── services/
│   ├── auth.service.ts      # Google token exchange, user upsert, JWT signing
│   └── onboarding.service.ts # Runs the ADK agent, parses responses, triggers roadmap gen
├── middleware/
│   └── auth.middleware.ts   # Bearer token verification + user hydration
├── lib/
│   ├── agent/
│   │   ├── google-adk.ts    # CareerLandAgent — session & agent management via Google ADK
│   │   ├── roadmap_gen.ts   # RoadmapGeneratorAgent — POST /v1/roadmaps
│   │   └── index.ts         # Barrel export
│   ├── database/
│   │   └── index.ts         # Mongoose connection (singleton per request)
│   ├── google/
│   │   └── index.ts         # GoogleAuth — OAuth2 client (googleapis)
│   └── utils/
│       └── jwt.ts           # JWT sign / verify helpers (Hono JWT)
└── types/
    ├── bindings.ts          # Cloudflare Worker env bindings
    ├── user.ts              # JWT payload interface
    ├── onboarding.ts        # Onboarding service params
    ├── career_land.ts       # ADK request/response types, agent response schema
    └── roadmap.ts           # Roadmap graph types (nodes, edges, resources)
```

---

## 📡 API Reference

### Health

| Method | Path           | Auth | Description      |
|--------|----------------|------|------------------|
| `GET`  | `/api/health`  | ✗    | Health check     |

### Authentication (`/api/auth`)

| Method | Path                       | Auth | Description                          |
|--------|----------------------------|------|--------------------------------------|
| `GET`  | `/api/auth/google`         | ✗    | Returns the Google OAuth consent URL |
| `GET`  | `/api/auth/google/callback` | ✗    | Exchanges auth code → JWT token      |
| `GET`  | `/api/auth/me`             | ✓    | Returns the authenticated user       |
| `POST` | `/api/auth/logout`         | ✓    | Logs the user out (client-side)      |

### Onboarding (`/api/onboarding`)

| Method | Path                | Auth | Description                                     |
|--------|---------------------|------|-------------------------------------------------|
| `POST` | `/api/onboarding`   | ✓    | Send a query to the AI onboarding agent         |

**Request body:**

```json
{
  "query": "I want to become a data scientist",
  "sessionId": "<optional — omit to start a new session>"
}
```

**Response** — either follow-up **questions** or a generated **roadmap graph**.

---

## ⚙️ Environment Variables

Create a `.dev.vars` file (for local development) with:

```env
DATABASE_URL=mongodb+srv://<user>:<password>@<cluster>/<db>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GOOGLE_REDIRECT_URI=http://localhost:8787/api/auth/google/callback
JWT_SECRET=<a-strong-random-secret>
FRONTEND_URL=http://localhost:3000
CAREER_LAND_API_URL=<google-adk-agent-url>
ROADMAP_GENERATOR_API_URL=<roadmap-service-url>
```

> [!IMPORTANT]
> Never commit `.dev.vars` — it is already in `.gitignore`.

---

## 🛠️ Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.2+
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) CLI (installed globally or via `npx`)
- A MongoDB instance (Atlas or local)
- Google Cloud OAuth 2.0 credentials
- Running instances of the **Career Land ADK Agent** and **Roadmap Generator** services

### Install

```bash
bun install
```

### Run locally

```bash
bun run dev        # starts wrangler dev server (default: http://localhost:8787)
```

### Deploy to Cloudflare

```bash
npx wrangler deploy
```

Set production secrets via:

```bash
npx wrangler secret put DATABASE_URL
npx wrangler secret put GOOGLE_CLIENT_ID
# ... repeat for each variable
```

---

## 🧰 Tech Stack

| Layer        | Technology                                     |
|--------------|------------------------------------------------|
| Runtime      | [Bun](https://bun.sh) + Cloudflare Workers     |
| Framework    | [Hono](https://hono.dev) v4                    |
| Database     | MongoDB ([Mongoose](https://mongoosejs.com) v9)|
| Auth         | Google OAuth 2.0 + JWT (HS256)                 |
| AI Agent     | Google ADK (Gemini)                            |
| HTTP Client  | [Axios](https://axios-http.com)                |
| Language     | TypeScript 5 (strict mode)                     |

---

## 📄 License

Private — all rights reserved.
