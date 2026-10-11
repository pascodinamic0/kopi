-- Kopi print-shop schema (Kinshasa)
-- Apply in Supabase SQL editor or: supabase db push

create extension if not exists "pgcrypto";

create table if not exists public.users (
  id text primary key,
  name text not null,
  role text not null check (role in ('super_admin','owner','staff')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  synced_at timestamptz default now()
);

create table if not exists public.clients (
  id text primary key,
  "fullName" text not null,
  phone text,
  "debtFC" numeric not null default 0,
  "createdAt" bigint,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  synced_at timestamptz default now()
);

create table if not exists public.jobs (
  id text primary key,
  ref text not null,
  "clientId" text references public.clients(id) on delete set null,
  "clientName" text,
  items jsonb not null default '[]'::jsonb,
  "totalFC" numeric not null default 0,
  "paidFC" numeric not null default 0,
  status text not null check (status in ('recu','en_cours','pret','livre')),
  "createdAt" bigint,
  "updatedAt" bigint,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  synced_at timestamptz default now()
);

create table if not exists public.payments (
  id text primary key,
  "jobId" text references public.jobs(id) on delete cascade,
  "clientId" text references public.clients(id) on delete set null,
  method text not null check (method in ('cash','mpesa','airtel','orange')),
  "amountFC" numeric not null default 0,
  "createdAt" bigint,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  synced_at timestamptz default now()
);

create table if not exists public.consumables (
  id text primary key,
  name text not null,
  unit text not null,
  stock numeric not null default 0,
  "minStock" numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  synced_at timestamptz default now()
);

create table if not exists public.settings (
  id text primary key,
  "shopName" text not null default '',
  commune text,
  "fxRateUsd" numeric not null default 2800,
  mode text not null default 'demo' check (mode in ('demo','production')),
  "demoBanner" boolean not null default true,
  "mobileMoney" jsonb not null default '{}'::jsonb,
  services jsonb not null default '[]'::jsonb,
  "createdAt" bigint,
  "updatedAt" bigint,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  synced_at timestamptz default now()
);

create index if not exists jobs_status_idx on public.jobs(status);
create index if not exists jobs_created_idx on public.jobs("createdAt" desc);
create index if not exists payments_job_idx on public.payments("jobId");
create index if not exists payments_created_idx on public.payments("createdAt" desc);

alter table public.users enable row level security;
alter table public.clients enable row level security;
alter table public.jobs enable row level security;
alter table public.payments enable row level security;
alter table public.consumables enable row level security;
alter table public.settings enable row level security;

-- Open policies for anon key MVP (tighten with auth later)
do $$ begin
  create policy "kopi_users_all" on public.users for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "kopi_clients_all" on public.clients for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "kopi_jobs_all" on public.jobs for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "kopi_payments_all" on public.payments for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "kopi_consumables_all" on public.consumables for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "kopi_settings_all" on public.settings for all using (true) with check (true);
exception when duplicate_object then null; end $$;
