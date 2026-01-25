create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  github_username text unique not null,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamp with time zone default now()
);

create table collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  description text,
  is_public boolean default true,
  position integer default 0,
  created_at timestamp with time zone default now()
);

create table collection_repos (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid references collections(id) on delete cascade,
  owner text not null,
  repo_name text not null,
  full_name text not null,
  note text,
  position integer default 0,
  created_at timestamp with time zone default now(),
  unique (collection_id, full_name)
);

alter table profiles enable row level security;
alter table collections enable row level security;
alter table collection_repos enable row level security;
create policy "Public profiles are viewable"
on profiles for select
using (true);

create policy "Public collections are viewable"
on collections for select
using (is_public = true);

create policy "Public collection repos are viewable"
on collection_repos for select
using (
  exists (
    select 1 from collections
    where collections.id = collection_repos.collection_id
      and collections.is_public = true
  )
);

create policy "Users can manage their profile"
on profiles for all
using (auth.uid() = id);

create policy "Users manage their collections"
on collections for all
using (auth.uid() = user_id);

create policy "Users manage collection repos"
on collection_repos for all
using (
  exists (
    select 1 from collections
    where collections.id = collection_repos.collection_id
      and collections.user_id = auth.uid()
  )
);