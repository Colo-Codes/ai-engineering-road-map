# AI Engineering Roadmap

An interactive study roadmap for moving from software engineering into applied AI engineering.

## What it includes

- 13 progressive modules, from Python foundations to an AI engineering capstone
- Module assessments, lesson learning outcomes and exercises
- Required, recommended, technical and further sources for every lesson
- Three-state progress tracking: not started, in progress and complete
- Progress and project state persisted in SQLite
- Per-module status filtering
- Build milestone view with the job-application checkpoint
- Read-only database administration panel for inspecting catalog and saved state
- Responsive navigation for desktop and mobile

## Run locally

Requires Node.js 22 or newer. The SQLite dependency includes native binaries for macOS, Linux, and Windows on both x64 and arm64; `npm install` automatically uses the correct one for the current machine.

```bash
npm install
npm run dev
```

Do not copy or commit `node_modules` between machines. Each contributor should run `npm install` in their own checkout.

## Verify

```bash
npm run lint
npm run build
```

After editing `docs/ai-engineering-roadmap.md`, rebuild the versioned catalogue with:

```bash
npm run sync:roadmap
```

## Technology

- Vite
- React
- TypeScript
- SQLite via `better-sqlite3`
- Lucide icons
- CSS with no component framework

The versioned `data/roadmap.seed.sqlite` database contains the clean roadmap catalogue. It includes modules, lessons, goals, categorised sources, milestones, books and chapters.

On first run, the app copies the seed to the ignored `data/roadmap.sqlite` runtime database. Later catalogue updates are synchronised without replacing progress, local book settings or custom projects.

The Vite local server exposes the runtime database through `/api/*`; both `npm run dev` and `npm run preview` use that API.

On the first run after upgrading, legacy progress and book settings are imported from browser storage into SQLite and the old browser-storage entries are removed.
