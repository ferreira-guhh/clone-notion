-- ============================================================
-- NOTION CLONE — Schema do Supabase
-- Execute este SQL no Supabase: SQL Editor → New Query → Run
-- ============================================================

-- Tabela de páginas
create table if not exists public.pages (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  title       text        not null default 'Sem título',
  content     text        not null default '',
  emoji       text        not null default '📄',
  parent_id   uuid        references public.pages(id) on delete cascade,
  position    integer     not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Índices para performance
create index if not exists pages_user_id_idx    on public.pages(user_id);
create index if not exists pages_parent_id_idx  on public.pages(parent_id);

-- Auto-atualizar updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_pages_updated on public.pages;
create trigger on_pages_updated
  before update on public.pages
  for each row execute function public.handle_updated_at();

-- ============================================================
-- Row Level Security (RLS) — cada usuário vê só suas páginas
-- ============================================================
alter table public.pages enable row level security;

-- Selecionar
create policy "Usuário vê suas páginas"
  on public.pages for select
  using (auth.uid() = user_id);

-- Inserir
create policy "Usuário cria suas páginas"
  on public.pages for insert
  with check (auth.uid() = user_id);

-- Atualizar
create policy "Usuário edita suas páginas"
  on public.pages for update
  using (auth.uid() = user_id);

-- Excluir
create policy "Usuário exclui suas páginas"
  on public.pages for delete
  using (auth.uid() = user_id);

-- ============================================================
-- Perfis de usuário (opcional, para nome/avatar no futuro)
-- ============================================================
create table if not exists public.profiles (
  id          uuid        primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Usuário vê seu perfil"
  on public.profiles for select using (auth.uid() = id);

create policy "Usuário edita seu perfil"
  on public.profiles for update using (auth.uid() = id);

-- Criar perfil automaticamente ao registrar
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
