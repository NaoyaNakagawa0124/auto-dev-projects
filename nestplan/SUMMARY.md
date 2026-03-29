# NestPlan — Build Summary

## What Was Built

A Python Textual TUI app that helps long-distance couples plan their future shared home. Organize renovation/DIY projects room by room, set budgets, vote on priorities with a star system, track progress, and keep everything synced via exportable JSON files.

## Core Features

1. **Room Manager** — Add rooms with preset icons (kitchen, bedroom, etc.) or custom names. Sidebar navigation with project counts.

2. **Project Management** — Create projects with name, description, budget, and partner assignment. Status workflow: Planned -> In Progress -> Done.

3. **Priority Voting** — Each partner votes 1-5 stars on every project. Combined score determines display order. Beautiful star-picker modal.

4. **Budget Dashboard** — Real-time budget tracking: total/spent/remaining, per-room and per-partner breakdowns with formatted currency.

5. **Auto-Save & Export** — Auto-saves to JSON on every change. Export for sharing with your partner.

6. **Setup Flow** — First-time onboarding: name your plan and enter both partner names.

## Tech Decisions

- **Textual** — Modern Python TUI framework with rich widgets, CSS styling, async support
- **No database** — JSON file persistence for portability (share via email/cloud)
- **Two-partner model** — Purpose-built for couples, not generic project management
- **Star voting** — Simple 1-5 scale, visual and intuitive in terminal
- **Auto-save** — No data loss, saves on every interaction

## Stats

- **102 tests** passing across 3 test suites (models, storage, budget)
- **12 Python files**
- **~1,494 LOC**
- **Build time**: ~5 minutes

## Potential Next Steps

1. **Sync via cloud** — Use a shared Dropbox/Google Drive folder for real-time sync between partners
2. **Photo attachments** — Link inspiration images to projects
3. **Timeline view** — Gantt-style view of project schedule
4. **Cost comparison** — Compare prices from different stores/contractors
5. **Move-in countdown** — Date-based planning with milestone tracking
