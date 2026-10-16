# Strict Project Guidelines for AI Coding Assistants

## 1. Backend & Logic Protection (CRITICAL)
- NEVER modify, delete, or rewrite any backend logic, Supabase database queries, data schemas, or core TypeScript utility functions unless explicitly requested.
- Keep all existing state variables, useEffect hooks, real-time channels (`supabase.channel`), date parsing functions, and database interaction logic 100% untouched.

## 2. Visual & Styling Scope Only
- You are strictly allowed to modify Tailwind CSS classes, layout wrappers, glassmorphism card designs, colors, fonts, and UI components for visual styling and design polish.
- Maintain the established dark luxury aesthetic (#121212 background, amber/gold accents, border-white/10).

## 3. Structural Integrity
- Do not alter core component architecture or break existing data flows between public pages and the admin panel.