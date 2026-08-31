# MoodMap — Architecture

## Overview

MoodMap is a React-based mood and journal tracking application. Users can record their daily mood, write journal entries, add tags, and view their mood history through a 12-month GitHub-style heatmap.

The application is client-side and uses IndexedDB to persist journal data in the browser.

## Tech Stack

- React
- JavaScript
- Vite
- Tailwind CSS
- IndexedDB

## Project Structure

```text
src/
├── components/   # UI components and pages
├── db/           # IndexedDB setup and database operations
├── hooks/        # Custom React hooks
├── services/     # Journal CRUD and validation
├── utils/        # Date, heatmap, streak and word processing logic
└── App.jsx       # Main application and navigation