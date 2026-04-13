-- =====================================================
--  BODA MATCH · A&A · 26/09/2026
--  Ejecutá esto en Supabase → SQL Editor → New query
-- =====================================================

-- 1. Tabla de perfiles
create table if not exists profiles (
  id           uuid default gen_random_uuid() primary key,
  nombre       text not null,
  edad         int  not null check (edad between 18 and 80),
  ciudad       text,
  signo        text,
  genero       text check (genero in ('M','F')),
  como_conoce  text,
  hobbies      text[]  default '{}',
  bebida       text,
  instagram    text,
  whatsapp     text,
  bio          text,
  foto         text,
  badges       text[]  default '{}',
  is_fake      boolean default false,
  created_at   timestamptz default now()
);

-- 2. Tabla de likes
create table if not exists likes (
  id          uuid default gen_random_uuid() primary key,
  from_user   uuid references profiles(id) on delete cascade,
  to_user     uuid,              -- puede ser fake (no FK)
  type        text default 'right' check (type in ('right','left','superlike')),
  created_at  timestamptz default now(),
  unique (from_user, to_user)
);

-- 3. Row Level Security  ─────────────────────────────
alter table profiles enable row level security;
alter table likes    enable row level security;

-- Cualquiera con el link puede leer y crear perfiles
create policy "profiles_select" on profiles for select using (true);
create policy "profiles_insert" on profiles for insert with check (true);

-- Cualquiera puede dar like
create policy "likes_select" on likes for select using (true);
create policy "likes_insert" on likes for insert with check (true);

-- 4. Storage bucket para fotos de perfil  ────────────
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict do nothing;

create policy "photos_select" on storage.objects
  for select using (bucket_id = 'photos');

create policy "photos_insert" on storage.objects
  for insert with check (bucket_id = 'photos');

-- ✅ ¡Listo! Copiá la URL y la anon key desde Settings → API
