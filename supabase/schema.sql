-- ============================================================
-- Invertexto-HC · schema inicial
-- Aplicar no SQL Editor do Supabase, em ordem.
-- ============================================================

-- ---------- Tabela: profiles ----------
-- Cadastro lightweight (sem senha). Identidade do usuário é o slug.
create table if not exists public.profiles (
  slug          text primary key,
  full_name     text not null,
  level         text not null check (level in ('medico','residente','interno')),
  hospital      text not null,
  created_at    timestamptz not null default now()
);

create index if not exists profiles_created_at_idx on public.profiles(created_at desc);

-- ---------- Tabela: notes ----------
-- Conteúdo do notepad. 1:1 com profile.
create table if not exists public.notes (
  slug          text primary key references public.profiles(slug) on delete cascade,
  content       text not null default '',
  updated_at    timestamptz not null default now()
);

-- trigger para manter updated_at sincronizado
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists notes_touch_updated_at on public.notes;
create trigger notes_touch_updated_at
  before update on public.notes
  for each row execute function public.touch_updated_at();

-- ---------- Tabela: access_log ----------
-- Telemetria anônima para observabilidade e rate-limit (fase 2).
create table if not exists public.access_log (
  id            uuid primary key default gen_random_uuid(),
  slug          text,
  event         text not null,
  created_at    timestamptz not null default now()
);

create index if not exists access_log_slug_idx on public.access_log(slug, created_at desc);

-- ---------- RLS ----------
alter table public.profiles enable row level security;
alter table public.notes    enable row level security;
alter table public.access_log enable row level security;

-- profiles
drop policy if exists "profiles_read"   on public.profiles;
drop policy if exists "profiles_insert" on public.profiles;
create policy "profiles_read"   on public.profiles for select using (true);
create policy "profiles_insert" on public.profiles for insert with check (true);

-- notes
drop policy if exists "notes_read"   on public.notes;
drop policy if exists "notes_insert" on public.notes;
drop policy if exists "notes_update" on public.notes;
create policy "notes_read"   on public.notes for select using (true);
create policy "notes_insert" on public.notes for insert with check (true);
create policy "notes_update" on public.notes for update using (true) with check (true);

-- access_log: insert público, leitura apenas via service_role
drop policy if exists "access_log_insert" on public.access_log;
create policy "access_log_insert" on public.access_log for insert with check (true);

-- ============================================================
-- Aviso de segurança (R1 do PRD):
-- RLS aberta é compatível com o MVP "URL pública + slug aleatório".
-- Antes de go-live público, adicionar:
--   1. Edge Function de rate-limit por IP no insert/update de notes.
--   2. Slug com entropia >= 12 chars como default no client.
--   3. Disclaimer LGPD obrigatório antes da primeira escrita.
-- ============================================================
