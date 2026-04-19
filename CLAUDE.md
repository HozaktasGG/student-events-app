# Eventra — Student Event Discovery Platform

Eventra is a web app where university students can discover, create, and join campus events.

## Tech Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **UI**: React 19, TypeScript, Tailwind CSS v4
- **Backend**: Supabase (Auth, PostgreSQL database, Storage)
- **Deployment**: Vercel

## File Structure

```
student-events-app/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page (event feed)
│   ├── globals.css
│   ├── login/page.tsx          # Login page
│   ├── signup/page.tsx         # Signup page
│   ├── create-event/page.tsx   # Create event form
│   ├── profile/page.tsx        # User profile page
│   ├── settings/page.tsx       # Settings page (WIP)
│   └── events/
│       ├── page.tsx            # Events list page (WIP)
│       └── [id]/page.tsx       # Event detail page (WIP)
├── components/
│   ├── EventCard.tsx           # Event card component
│   └── EventModal.tsx          # Event detail modal
├── lib/
│   ├── supabase.ts             # Supabase client
│   └── useAuth.ts              # Auth hook
├── data/                       # Static/mock data
└── public/
```

## Pages Status

### Completed
- `/login` — Email/password login with Supabase Auth
- `/signup` — New user registration
- `/` (home) — Event feed/discovery page
- `/create-event` — Event creation form with image upload
- `/profile` — User profile view
- **EventModal** — Modal overlay for quick event preview

### In Progress / Incomplete
- `/events` — Full events list page (WIP)
- `/settings` — User settings page (WIP)
- `/events/[id]` — Full event detail page (WIP)
- **Join event system** — Logic for joining/leaving events not yet implemented

## Supabase Schema

### Tables

**`profiles`**
- Mirrors `auth.users`, stores display name, avatar, university info, etc.
- Auto-created on signup via trigger or client-side logic.

**`events`**
- Stores event data: title, description, date, location, category, image URL, etc.
- `created_by` (UUID) → references `auth.users(id)`

### Storage

- **`event-images`** bucket — stores uploaded cover images for events. Public bucket, images referenced by URL in the `events` table.

## Key Notes

- Auth is handled entirely by Supabase; protected routes redirect to `/login` if no session.
- Event images are uploaded to the `event-images` Supabase Storage bucket and the public URL is saved to the `events` table.
- The app uses the Next.js App Router (not Pages Router). All pages are server/client components under `app/`.
- Tailwind v4 is configured via PostCSS (`postcss.config.mjs`), not a `tailwind.config.js` file.
