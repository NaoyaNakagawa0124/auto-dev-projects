# 学ERP — Summary

## What Was Built

A C# console app that treats studying like enterprise resource management. Subjects are "departments," exams are "client projects," study time is "billable hours," and your brain is the "employee" with fatigue tracking. Features a full ERP-style dashboard with KPIs, financial reports, knowledge inventory decay, and an ROI-based analysis of study effectiveness. Late-night studying earns 1.5x overtime pay.

## Features

- **Department Management** — Add subjects with priority levels, track knowledge stock per department
- **Time Tracking** — Log study hours as billable time; late-night = 1.5x overtime multiplier
- **Project Management** — Register exams with deadlines and difficulty; track urgency status
- **Grading System** — S/A/B/C/D grades based on knowledge vs. required level
- **Employee (Brain) Management** — Energy, focus, morale tracking with condition labels
- **Knowledge Decay** — Daily decay based on priority (high-priority subjects decay faster)
- **Financial Reports** — ROI analysis, knowledge portfolio, time distribution
- **Corporate Humor** — Full ERP jargon applied to student life

## Tech Stack

- C# / Mono 6.14
- ANSI terminal colors
- Makefile build system

## Potential Next Steps

- Save/load company state to JSON
- Multiple employees (study groups)
- Weekly board meeting summaries
- Achievement badges (e.g., "100 billable hours")
