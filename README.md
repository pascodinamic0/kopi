# Kopi — Desk d'impression (PWA)

Application mobile-first pour imprimeries et cybercafé-imprimeries de Kinshasa.

## Stack
- Next.js 16 + Tailwind 4 + Motion
- Dexie (IndexedDB) offline-first
- Supabase sync (optionnel) via `@supabase/supabase-js`
- PWA (manifest + service worker)

## Setup
```bash
npm install
cp .env.example .env.local   # add Supabase URL + anon key
npm run dev
```

## Supabase
1. Create a free project named **Kopi** (pause/delete another free project if at the 2-project limit).
2. Run `supabase/migrations/001_kopi_schema.sql` in the SQL editor.
3. Put `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.
4. Sync from Paramètres → Synchroniser.

## Deploy
```bash
npx netlify-cli@23 deploy --build --prod
# or: vercel --prod
```

## Images
License-safe Pexels photos in `public/img/` (see `public/img/CREDITS.txt`).
