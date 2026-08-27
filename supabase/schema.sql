-- ════════════════════════════════════════════════════════════════════
-- RAJPUT PALACE — Supabase schema
-- Copy-paste this entire file into the Supabase SQL Editor and run it.
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE where possible.
-- ════════════════════════════════════════════════════════════════════

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────
-- rooms
-- ─────────────────────────────────────────────
create table if not exists public.rooms (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  slug              text not null unique,
  description       text not null default '',
  short_description text not null default '',
  price             numeric(10, 2),              -- null / 0 => "Price on request"
  max_guests        integer not null default 2,
  bed_type          text not null default '',
  amenities         text[] not null default '{}',
  featured_image    text,
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists rooms_is_active_idx on public.rooms (is_active);
create index if not exists rooms_slug_idx on public.rooms (slug);

-- ─────────────────────────────────────────────
-- room_images
-- ─────────────────────────────────────────────
create table if not exists public.room_images (
  id         uuid primary key default gen_random_uuid(),
  room_id    uuid not null references public.rooms (id) on delete cascade,
  image_url  text not null,
  alt_text   text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists room_images_room_id_idx on public.room_images (room_id);

-- ─────────────────────────────────────────────
-- booking_inquiries
-- ─────────────────────────────────────────────
create table if not exists public.booking_inquiries (
  id               uuid primary key default gen_random_uuid(),
  guest_name       text not null,
  phone            text not null,
  email            text not null default '',
  check_in         date not null,
  check_out        date not null,
  guests           integer not null default 1,
  rooms_requested  integer not null default 1,
  room_type        text not null default '',
  special_request  text,
  status           text not null default 'new'
                     check (status in ('new', 'contacted', 'confirmed', 'cancelled')),
  created_at       timestamptz not null default now(),
  constraint booking_dates_valid check (check_out > check_in)
);

create index if not exists booking_inquiries_status_idx on public.booking_inquiries (status);
create index if not exists booking_inquiries_created_at_idx on public.booking_inquiries (created_at desc);

-- ─────────────────────────────────────────────
-- hotel_settings (single row of hotel-wide config)
-- ─────────────────────────────────────────────
create table if not exists public.hotel_settings (
  id               uuid primary key default gen_random_uuid(),
  hotel_name       text not null default 'Rajput Palace',
  address          text not null default 'Near Sabji Mandi, Sapt Sagar Colony, Ayodhya, Uttar Pradesh, India',
  phone            text,
  whatsapp         text,
  email            text,
  google_maps_url  text,
  description      text,
  hero_image       text,
  updated_at       timestamptz not null default now()
);

-- Safe to re-run even if the table already existed without this column.
alter table public.hotel_settings add column if not exists hero_image text;

-- ─────────────────────────────────────────────
-- gallery
-- ─────────────────────────────────────────────
create table if not exists public.gallery (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  image_url  text not null,
  category   text not null
               check (category in ('Hotel', 'Rooms', 'Exterior', 'Interiors', 'Amenities', 'Nearby Ayodhya')),
  alt_text   text not null default '',
  sort_order integer not null default 0,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists gallery_is_active_idx on public.gallery (is_active);
create index if not exists gallery_category_idx on public.gallery (category);

-- ─────────────────────────────────────────────
-- testimonials (optional — only populate with real, verifiable reviews)
-- ─────────────────────────────────────────────
create table if not exists public.testimonials (
  id         uuid primary key default gen_random_uuid(),
  guest_name text not null,
  quote      text not null,
  location   text,
  is_active  boolean not null default false,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- updated_at auto-touch trigger for rooms / hotel_settings
-- ─────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists rooms_set_updated_at on public.rooms;
create trigger rooms_set_updated_at
  before update on public.rooms
  for each row execute function public.set_updated_at();

drop trigger if exists hotel_settings_set_updated_at on public.hotel_settings;
create trigger hotel_settings_set_updated_at
  before update on public.hotel_settings
  for each row execute function public.set_updated_at();

-- ════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- Public (anon) users may READ active rooms/room_images/gallery/
-- hotel_settings/testimonials, and INSERT booking inquiries only.
-- Nothing else is permitted to the anon role. All writes to rooms,
-- gallery, hotel_settings, room_images and updates/deletes on
-- booking_inquiries must go through an authenticated admin role that
-- you configure later (e.g. Supabase Auth + a service-role admin route).
-- ════════════════════════════════════════════════════════════════════

alter table public.rooms enable row level security;
alter table public.room_images enable row level security;
alter table public.booking_inquiries enable row level security;
alter table public.hotel_settings enable row level security;
alter table public.gallery enable row level security;
alter table public.testimonials enable row level security;

-- rooms: public can read active rooms only
drop policy if exists "Public can read active rooms" on public.rooms;
create policy "Public can read active rooms"
  on public.rooms for select
  using (is_active = true);

-- room_images: public can read images belonging to active rooms
drop policy if exists "Public can read images of active rooms" on public.room_images;
create policy "Public can read images of active rooms"
  on public.room_images for select
  using (
    exists (
      select 1 from public.rooms
      where rooms.id = room_images.room_id
        and rooms.is_active = true
    )
  );

-- gallery: public can read active items only
drop policy if exists "Public can read active gallery items" on public.gallery;
create policy "Public can read active gallery items"
  on public.gallery for select
  using (is_active = true);

-- hotel_settings: public can read (no sensitive data stored here)
drop policy if exists "Public can read hotel settings" on public.hotel_settings;
create policy "Public can read hotel settings"
  on public.hotel_settings for select
  using (true);

-- testimonials: public can read active/approved testimonials only
drop policy if exists "Public can read active testimonials" on public.testimonials;
create policy "Public can read active testimonials"
  on public.testimonials for select
  using (is_active = true);

-- booking_inquiries: public can INSERT only — never read, update, or delete.
drop policy if exists "Public can submit booking inquiries" on public.booking_inquiries;
create policy "Public can submit booking inquiries"
  on public.booking_inquiries for insert
  with check (true);

-- No select/update/delete policies are created for booking_inquiries for
-- the anon/public role, so those operations are denied by default under RLS.
-- Admin access to bookings should go through a service-role-only backend
-- route (never exposed to the browser) once an admin dashboard is built.

-- ─────────────────────────────────────────────
-- Seed: a single hotel_settings row (safe to run once)
-- ─────────────────────────────────────────────
insert into public.hotel_settings (hotel_name, address, description)
select
  'Rajput Palace',
  'Near Sabji Mandi, Sapt Sagar Colony, Ayodhya, Uttar Pradesh, India',
  'A premium and comfortable stay in Ayodhya for pilgrims, families, couples, tourists and business travellers.'
where not exists (select 1 from public.hotel_settings);

