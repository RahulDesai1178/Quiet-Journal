create extension if not exists pgcrypto;

create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text,
  content text not null check (char_length(trim(content)) > 0),
  analysis_emotions jsonb,
  analysis_note text,
  analysis_model text,
  analysis_created_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.journal_entries
  add column if not exists analysis_emotions jsonb,
  add column if not exists analysis_note text,
  add column if not exists analysis_model text,
  add column if not exists analysis_created_at timestamptz;

alter table public.journal_entries
  add column if not exists analysis_recommendations jsonb;

comment on table public.journal_entries is 'Private journal entries owned by Supabase-authenticated users.';

create index if not exists journal_entries_user_created_at_idx
  on public.journal_entries (user_id, created_at desc);

create index if not exists journal_entries_user_updated_at_idx
  on public.journal_entries (user_id, updated_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists journal_entries_set_updated_at on public.journal_entries;

create trigger journal_entries_set_updated_at
before update on public.journal_entries
for each row
execute function public.set_updated_at();

alter table public.journal_entries enable row level security;
alter table public.journal_entries force row level security;

drop policy if exists "Users can view their own journal entries" on public.journal_entries;
create policy "Users can view their own journal entries"
on public.journal_entries
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own journal entries" on public.journal_entries;
create policy "Users can insert their own journal entries"
on public.journal_entries
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own journal entries" on public.journal_entries;
create policy "Users can update their own journal entries"
on public.journal_entries
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own journal entries" on public.journal_entries;
create policy "Users can delete their own journal entries"
on public.journal_entries
for delete
to authenticated
using (auth.uid() = user_id);
