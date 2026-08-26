# Rajput Palace — Hotel Website

A production-ready website for **Rajput Palace**, Ayodhya, Uttar Pradesh, built with
Next.js (App Router) + TypeScript + Tailwind CSS, backed by Supabase (free tier), and
ready to deploy on Vercel.

The site works out of the box with tasteful demo content even before Supabase is
connected, then automatically switches to live data once it is.

---

## 1. Install dependencies

```bash
npm install
```

## 2. Configure Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. In your Supabase project, open **SQL Editor** and run the entire contents of
   [`supabase/schema.sql`](./supabase/schema.sql). This creates all tables, indexes,
   Row Level Security policies, and seeds one `hotel_settings` row.
3. (Recommended) Create a **Storage bucket** named `hotel-images` (public) for room and
   gallery photos, then paste the resulting public URLs into `rooms.featured_image`,
   `room_images.image_url`, and `gallery.image_url`.
4. Copy your Project URL and `anon` public API key from **Project Settings → API**.

## 3. Add environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | For live data | From Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | For live data | Public anon key only — never the service role key |
| `NEXT_PUBLIC_HOTEL_PHONE` | Once available | Enables the "Call Now" buttons |
| `NEXT_PUBLIC_HOTEL_WHATSAPP` | Once available | Digits + country code, no `+`, e.g. `919876543210` |
| `NEXT_PUBLIC_HOTEL_EMAIL` | Once available | Enables the contact email link |
| `NEXT_PUBLIC_GOOGLE_MAPS_URL` | Optional | A specific Maps share link; otherwise built automatically from the address (no paid API key needed) |
| `NEXT_PUBLIC_SITE_URL` | For deployment | Your production domain, used in SEO/sitemap |
| `SUPABASE_SERVICE_ROLE_KEY` | For the admin panel | Secret key from Supabase → Project Settings → API. Never exposed to the browser. |
| `ADMIN_PASSWORD` | For the admin panel | The password used to sign in at `/admin/login`. |
| `ADMIN_SESSION_SECRET` | For the admin panel | Any long random string (e.g. `openssl rand -hex 32`), used to sign the login session cookie. |

**Never commit `.env.local` or a service role key to GitHub.**

## 4. Run locally

```bash
npm run dev
```

Visit `http://localhost:3000`.

## 5. Build for production

```bash
npm run build
npm start
```

## 6. Push to GitHub

```bash
git init
git add .
git commit -m "Initial Rajput Palace website"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

`.env.local` and secrets are already excluded via `.gitignore`.

## 7. Import into Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import your GitHub repository.
2. Framework preset: **Next.js** (auto-detected). No custom server required.

## 8. Add Vercel environment variables

In your Vercel project → **Settings → Environment Variables**, add every variable from
`.env.example` with real values (same as your `.env.local`).

## 9. Deploy

Click **Deploy**. Vercel builds and hosts the site on its free tier.

---

## Project structure

```
src/
  app/                 Routes (App Router) — pages, layout, sitemap, robots, API route
  components/
    layout/            Header, Footer, mobile sticky CTA bar
    ui/                Buttons, image fallback, loading/empty states, section heading
    home/              Hero, highlights, rooms preview, Ayodhya experience, testimonials
    rooms/             Room card/grid/gallery
    amenities/         Amenity grid
    gallery/           Gallery grid + lightbox
    location/          Location section + embedded map
    contact/           Contact section
    booking/           Booking inquiry form
  lib/
    supabase/          Browser + server Supabase clients (anon key only)
    types.ts           Shared TypeScript types matching the SQL schema
    demo-data.ts       Clearly-marked placeholder content (no invented prices/reviews)
    data.ts            Data access layer — Supabase first, demo fallback
    hotel-config.ts    All contact/config values, environment-driven
supabase/
  schema.sql           Full copy-paste-ready schema + RLS policies
```

## How the demo-data fallback works

Every data-fetching function in `src/lib/data.ts` tries Supabase first (only when env
vars are set) and falls back to `src/lib/demo-data.ts` if Supabase isn't configured yet,
a table is empty, or a query fails. This means:

- The site never shows a blank or broken page while you're still setting things up.
- Nothing in the demo data invents real facts: room prices are `null` (shown as
  "Price on request"), there are no testimonials, and gallery/room images are left
  empty so the site shows an elegant placeholder instead of stock photography.

## Images

There is no stock photography in this project by design (the brief asked to avoid
random copyrighted images). Every image slot renders `<ImageFallback />`, which shows a
premium placeholder until you provide a real photo URL (ideally hosted in Supabase
Storage). Just fill in `featured_image` / `image_url` fields and photos will appear
automatically, with lazy loading and a graceful fallback if a URL ever breaks.

---

## Environment variables — full list

See [`.env.example`](./.env.example) for the definitive list with comments.

## Admin panel (`/admin`)

A password-protected admin panel is included for day-to-day content management,
backed by Supabase (using the service role key, server-side only):

- **`/admin/login`** — sign in with `ADMIN_PASSWORD`.
- **`/admin`** — dashboard overview (booking count, rooms, gallery, testimonials).
- **`/admin/bookings`** — view every booking enquiry and update its status
  (new / contacted / confirmed / cancelled), or delete one.
- **`/admin/rooms`** — add, edit, hide, or delete room types.
- **`/admin/gallery`** — add, edit, hide, or delete gallery photos.
- **`/admin/testimonials`** — add, edit, or delete guest testimonials (only ever
  add real, verifiable reviews).
- **`/admin/settings`** — edit the hotel's stored contact details in Supabase.

To enable it, set `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`, and
`ADMIN_SESSION_SECRET` in your environment variables (locally in `.env.local`,
and in Vercel → Project Settings → Environment Variables for production), then
redeploy. Until these are set, `/admin` routes will show a clear
"not configured" message instead of crashing.

The admin panel uses a single shared password (no individual user accounts) —
appropriate for one or two people managing the site. It is fully separate from
guest-facing Supabase access: guests only ever use the public `anon` key
(read active content, submit booking enquiries); the admin panel is the only
part of the app that uses the more powerful service role key, and only from
server-side route handlers that are themselves gated by the login cookie.

## Demo data to replace before launch

- `src/lib/demo-data.ts` — 3 demo rooms (Deluxe, Super Deluxe, Family), demo gallery
  entries, and the amenities candidate list. Replace by populating the corresponding
  Supabase tables (`rooms`, `gallery`); the site will pick them up automatically.
- All demo images are empty placeholders — add real photo URLs once available.

## Hotel information still required from the owner

- [ ] Phone number
- [ ] WhatsApp number
- [ ] Email address
- [ ] Confirmed list of amenities actually available
- [ ] Real room names, descriptions, bed types, capacities, and (if desired) prices
- [ ] Real photography for rooms, exterior, interiors, and gallery
- [ ] Any real, verifiable guest testimonials (optional — never fabricated)
- [ ] A specific Google Maps share link, if different from the auto-generated one

## Final production checklist

**UI** — Desktop, mobile, tablet all verified responsive from 320px up, no horizontal
overflow, tap targets sized for mobile.

**Functional** — Navigation, all room pages, booking form (validation, loading,
success, error, duplicate-submit protection), Supabase connection, WhatsApp/Call CTAs,
gallery + lightbox, and image fallbacks all tested.

**Technical** — `npx tsc --noEmit` passes with no errors. `npm run lint` passes with no
errors. `npm run build` completes successfully. No secrets committed. `.gitignore`
correctly excludes `.env*` (except `.env.example`).

**SEO** — Per-page metadata, Open Graph/Twitter tags, canonical URLs, `sitemap.xml`,
`robots.txt`, and Hotel JSON-LD structured data are all in place. No fabricated
ratings, review counts, or star classifications are included anywhere.

**Performance** — Images are lazy-loaded, sections are code-split by route
automatically via the App Router, and the site avoids unnecessary dependencies.

**Accessibility** — Semantic HTML, labeled form fields, visible focus states, and
keyboard-operable navigation (including the mobile drawer and gallery lightbox).
