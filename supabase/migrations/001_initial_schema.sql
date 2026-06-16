-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- 1. Pharmacies
create table public.pharmacies (
  id            uuid default gen_random_uuid() primary key,
  name          text not null,
  slug          text not null unique,
  address       text not null,
  city          text not null,
  voivodeship   text not null,
  latitude      numeric(10, 8) not null,
  longitude     numeric(11, 8) not null,
  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null
);

-- 2. Strains
create table public.strains (
  id                 uuid default gen_random_uuid() primary key,
  producer           text not null,
  name               text not null,
  thc_pct            numeric(4, 2) not null,
  cbd_pct            numeric(4, 2) not null,
  lineage            text check (lineage in ('Sativa-dominant', 'Indica-dominant', 'Balanced')),
  dominant_terpenes  text[] default '{}'::text[],
  created_at         timestamptz default now() not null
);

-- 3. Inventory (many-to-many with realtime tracking)
create table public.inventory (
  id           uuid default gen_random_uuid() primary key,
  pharmacy_id  uuid references public.pharmacies(id) on delete cascade not null,
  strain_id    uuid references public.strains(id) on delete cascade not null,
  stock_level  integer not null default 0,
  price_per_gram numeric(6, 2) not null,
  batch_number text,
  expiry_date  date not null,
  updated_at   timestamptz default now() not null,
  constraint unique_pharmacy_strain_batch unique (pharmacy_id, strain_id, batch_number)
);

-- 4. Patient documents (Police Mode)
create table public.patient_documents (
  id                uuid default gen_random_uuid() primary key,
  user_id           text not null, -- Clerk User ID
  prescription_code varchar(4) not null,
  patient_pesel     varchar(11) not null,
  invoice_url       text,
  created_at        timestamptz default now() not null,
  updated_at        timestamptz default now() not null
);

-- RLS: patient_documents — own records only
alter table public.patient_documents enable row level security;
create policy "Users can only operate on their own documents"
  on public.patient_documents for all
  using (auth.uid()::text = user_id);

-- RLS: public read for lookups
alter table public.pharmacies enable row level security;
alter table public.strains     enable row level security;
alter table public.inventory   enable row level security;
create policy "Public Read Access for Pharmacies" on public.pharmacies for select using (true);
create policy "Public Read Access for Strains"    on public.strains     for select using (true);
create policy "Public Read Access for Inventory"  on public.inventory   for select using (true);

-- Enable Realtime on inventory
alter publication supabase_realtime add table public.inventory;

-- Seed pharmacies
insert into public.pharmacies (name, slug, address, city, voivodeship, latitude, longitude) values
  ('Apteka Centrum',   'apteka-centrum',    'ul. Marszałkowska 45', 'Warszawa', 'mazowieckie', 52.22977, 21.01178),
  ('Apteka Pod Różą',  'apteka-pod-roza',   'ul. Floriańska 12',    'Kraków',   'małopolskie',  50.06143, 19.93658),
  ('Apteka Zdrowie',   'apteka-zdrowie',    'ul. Długa 88',         'Gdańsk',   'pomorskie',    54.35202, 18.64664);

-- Seed strains
insert into public.strains (producer, name, thc_pct, cbd_pct, lineage) values
  ('Aurora Cannabis', 'Aurora 22/1',         22, 1,  'Sativa-dominant'),
  ('Canopy Growth',   'Canopy Growth 20/1',  20, 1,  'Indica-dominant'),
  ('Tilray',          'Tilray 18/1',         18, 1,  'Balanced'),
  ('Bedrocan',        'Bedrocan 22/0',       22, 0,  'Sativa-dominant'),
  ('Canopy Growth',   'Spectrum Orange 10/10', 10, 10, 'Balanced');
