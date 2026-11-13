# QuantumLeap — Frontend (`QuantumDesk`)

Next.js 15 (App Router) client for **QuantumLeap**, the scientific publishing and collaboration platform: landing page, auth, posts with comments, dashboard, chat, notifications, user directory, and settings.

> **Product name:** the canonical name is **QuantumLeap**. This folder is still called `QuantumDesk` and the package is still named `quantum-relativity`; both are legacy names scheduled for migration in `TASK-06-01`. Do not introduce a third name.

The API lives in the sibling repository **`be-quantumLeap`** (separate repo, separate deployable). This frontend only documents itself; see [the backend README](../be-quantumLeap/README.md) for the server.

Planning documents for the whole remediation live in [`../tasks/`](../tasks/README.md) — start with the [audit report](../tasks/AUDIT-REPORT.md).

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js `^15.3.3`, App Router, Turbopack dev server |
| UI | React `^19.0.0`, Tailwind CSS `^4`, shadcn/ui (New York style, neutral), lucide-react icons |
| Motion / 3D | framer-motion, `@react-three/fiber` + `@react-three/drei` + three |
| Data | Hand-rolled fetch client in `src/lib/api.js` (TanStack Query is planned in `TASK-07-03`) |
| Realtime | `socket.io-client` (`src/lib/api.js`, `src/lib/socket.js`) |
| i18n | i18next + react-i18next |
| Auth token | JWT in `localStorage` under the key `token` (`jwt-decode` for claims) |

## Requirements

- Node.js **20, 22, or 24** (verified in [BASELINE-VERIFICATION.md](../tasks/BASELINE-VERIFICATION.md); CI currently also runs Node 18, which is EOL — see `TASK-13-01`)
- npm (the committed lockfile is `package-lock.json`; an untracked `pnpm-lock.yaml` also exists — package-manager decision in `TASK-01-03`)
- A running `be-quantumLeap` instance, defaulting to `http://localhost:7000`

## Getting started

```bash
cp .env.example .env      # then edit the values
npm ci                    # clean install from package-lock.json
npm run dev               # http://localhost:3000
```

Production check:

```bash
npm run build
npm start
```

## Scripts

| Script | Command | Notes |
|---|---|---|
| `npm run dev` | `next dev --turbopack` | Dev server on port 3000 |
| `npm run build` | `next build` | Verified passing; logs a non-fatal `sitemap.xml` error when the API base is unset (see below) |
| `npm start` | `next start` | Serves the production build |
| `npm run lint` | `next lint` | ESLint via `eslint-config-next` |
| `npm test` | `echo "No tests specified" && exit 0` | Placeholder — no tests exist yet (`TASK-12-02`) |

## Environment variables

Copy [`.env.example`](.env.example) to `.env`. All variables are `NEXT_PUBLIC_*`, so their **values are shipped to the browser** — never put secrets in them.

| Variable | Read by | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_BASE` | `src/lib/api.js`, `src/components/PostForm.jsx` | **Canonical** API base URL, no trailing slash (e.g. `http://localhost:7000`) |
| `NEXT_PUBLIC_BE_API_URL` | `src/app/sitemap.js` | Legacy alias — set it to the same value |
| `NEXT_PUBLIC_BASE_URL` | `src/lib/socket.js` | Legacy alias — set it to the same value |

The three names are a known inconsistency: the code keeps working only if all three hold the same value. Unifying them on `NEXT_PUBLIC_API_BASE` is `TASK-07-02`; this task documents the contract but does not rename anything.

**Known symptom if unset:** `npm run build` exits 0 but logs `Error: Dynamic server usage: Route /sitemap.xml couldn't be rendered statically…` because `NEXT_PUBLIC_BE_API_URL` is undefined (recorded in [BASELINE-VERIFICATION.md](../tasks/BASELINE-VERIFICATION.md), mapped to `TASK-01-02`/`TASK-09-02`).

## Project structure

```
QuantumDesk/
├── src/
│   ├── app/
│   │   ├── (public)/            # marketing, auth, public posts
│   │   │   ├── page.jsx         # landing page
│   │   │   ├── auth/            # login, registration
│   │   │   └── post/            # post list + [id] detail
│   │   ├── (dashboard)/dashboard/
│   │   │   └── (home)/          # home, chat, newposts, post, users, profile
│   │   ├── layout.jsx           # root layout, metadata (siteName: QuantumLeap)
│   │   ├── globals.css          # Tailwind 4 + design tokens
│   │   └── sitemap.js
│   ├── components/
│   │   ├── ui/                  # shadcn/ui primitives
│   │   ├── landing/             # Hero, Footer, Logo, …
│   │   ├── dashboard/, settings/, notifications/
│   │   └── PostForm.jsx
│   ├── context/                 # DashboardContext (session + realtime state)
│   ├── hooks/
│   └── lib/                     # api.js (fetch + socket client), socket.js, utils
├── public/                      # static assets
├── jsconfig.json                # `@/*` → `./src/*`
├── tsconfig.json                # allowJs; TypeScript migration in TASK-07-01
├── components.json              # shadcn/ui config
└── next.config.mjs              # images.domains: res.cloudinary.com, images.unsplash.com
```

## Talking to the backend

- REST calls go through `src/lib/api.js` → `safeFetch(path)`, which prefixes `NEXT_PUBLIC_API_BASE`, attaches `Authorization: Bearer <token>`, retries 502/503/504, and redirects to `/auth/login` on 401.
- Socket.IO connects with `auth: { token }` on path `/socket.io`.
- The backend defaults to **port 7000** and restricts CORS/Socket.IO origins to its `FRONTEND_URL`.

## Known limitations

- **No tests.** `npm test` is a placeholder (`TASK-12-02`).
- **Undeclared dependency:** `@radix-ui/react-visually-hidden` is imported by `MobileSidebar.jsx`/`MobileSidebarS.jsx` but is missing from `package.json`; npm's flat tree supplies it transitively (`TASK-01-03`, `TASK-10-02`).
- **Three API-base env names** instead of one (`TASK-07-02`).
- **Legacy product names** in folder/package names and in post-detail metadata (`QuantumDesk`, `quantum-relativity`) — `TASK-06-01`.
- **API contract drift:** several client calls target endpoints/methods the backend does not implement (registration field, comments, chat detail, avatar, notification read, settings). Inventory in [`../tasks/API-CONTRACT-INVENTORY.md`](../tasks/API-CONTRACT-INVENTORY.md); fixes in Phases 02 and 08.
- **CI** (`.github/workflows/node.js.yml`) runs Node 18/20/22 and executes no lint step (`TASK-13-01`).

## Related documentation

- [Tasks index](../tasks/README.md) · [Audit report](../tasks/AUDIT-REPORT.md) · [Architecture](../tasks/ARCHITECTURE.md) · [Design system](../tasks/DESIGN-SYSTEM.md) · [Roadmap](../tasks/IMPLEMENTATION-ROADMAP.md)
- [Backend README](../be-quantumLeap/README.md)
