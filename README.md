# Micdrop

Local development setup for the Micdrop Next.js app.

## Prerequisites
- Node.js 18.18+ or 20+
- pnpm 10.15.0 (recommended)
  - Install: `corepack enable && corepack prepare pnpm@10.15.0 --activate`

## Environment Variables
This app uses Supabase for auth. Create a `.env.local` file using the template below:

1) Copy the example file
```
cp .env.example .env.local
```
2) Fill in values from your Supabase project settings
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Install & Run
```
pnpm install
pnpm dev
```
App runs at http://localhost:3000

## Supabase OAuth (Google)
If you plan to use the Google login flow in development:
- In Supabase Dashboard → Authentication → Providers → Google: enable the provider
- Add redirect URL: `http://localhost:3000/auth/callback`
- In Project Settings → URL Configuration: ensure `http://localhost:3000` is allowed

## Useful Scripts
- `pnpm dev`: start dev server
- `pnpm build`: production build
- `pnpm start`: run production build
- `pnpm type-check`: TypeScript check
- `pnpm lint`: Next.js lint
- `pnpm clean`: remove `.next` and `node_modules`

## Notes
- Protected routes: `/dashboard`, `/practice`, `/feedback`, `/performance`, `/personas` require auth.
- Without valid Supabase env vars, auth-related pages will not work.
