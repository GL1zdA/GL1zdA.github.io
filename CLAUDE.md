# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static HTML/CSS/JS personal GitHub Pages site documenting computer hardware history. No build system, no frameworks, no package manager — files are deployed as-is.

## Local development

Open files directly in a browser, or serve locally:

```sh
python3 -m http.server 8080
```

## Architecture

The site has two main areas:

### Computer Timelines (`/computer-timeline/`)

Interactive horizontal timelines built on the bundled SIMILE Timeline 2.3.0 library (`/js/timeline_2.3.0/`). Each timeline page loads JSON event data from `/computer-timeline/data/` and configures timeline bands via `ComputerTimeline.builder()` in `/computer-timeline/js/app.js`.

Adding a new timeline entry means editing the appropriate JSON file in `/computer-timeline/data/` (organized by category: CPU, GPU, systems, audio, software, etc.). Each event has a start date, title, description, and optional color/icon.

### Reference Tables (`/reference/`)

HTML tables with inline JavaScript data arrays. The table rendering and filtering is handled by `enhancedTable()` from `/js/common161/common161.js`.

### Shared utilities (`/js/common161/common161.js`)

Custom IIFE module providing table enhancement, flag/icon helpers, CSV parsing, and query-like iterators. Used across both the timeline and reference sections.

## Key conventions

- JavaScript follows ES5-era module pattern (IIFEs, no `import`/`export`)
- Data files are JSON under `/computer-timeline/data/`; reference data lives as JS arrays inside the HTML files themselves
- `/resources/famfamfam/` contains icon sets (country flags, silk icons) referenced by the common161 helpers
