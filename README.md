# MoodMap

A mood and journal tracker with a GitHub-style contribution heatmap. Log your mood every day, write a few lines, and see a year of your days at a glance.

Built for the ProStackHub Frontend Development Internship (Task 4).

## What it does

- 12-month heatmap, color-coded by mood
- Click any day to log a mood (1–5), write a journal entry, and add tags
- Streak tracking (current + longest)
- Word cloud of your most-used journal words — done locally, no AI/API
- Search and filter past entries
- Insights page with mood averages, distribution, and top tags

Everything is stored in the browser with IndexedDB. No backend, no login, no data leaves your device.

## Stack

React + Vite (plain JavaScript, no TypeScript) · Tailwind CSS v4 · IndexedDB

## Why IndexedDB and not localStorage

Journal entries are structured data that grows over a year of daily use. IndexedDB handles that better than localStorage and lets me query by date range without loading everything into memory.

## Running it locally

```bash
git clone <your-repo-url>
cd ProStackHub_MoodMap
npm install
npm run dev
```

Opens at `[(https://moodmap-journal.netlify.app/)]`.

## Build

```bash
npm run build
```

## Project structure

```
src/
  components/     UI pieces (heatmap, journal editor, stat cards, etc.)
  components/pages/  Dashboard, Journal, Insights
  db/             IndexedDB setup
  services/       Journal CRUD + validation
  hooks/          useJournal — wires storage into React state
  utils/          date, heatmap grid, streaks, word frequency logic
  App.jsx         nav between the three pages (plain state, no router)
```

## Screenshots

_adding these once deployed_
