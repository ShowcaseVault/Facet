## Database Schema (Supabase / PostgreSQL)

Facet uses **Supabase Postgres** as the database with **Row Level Security (RLS)** enabled.
GitHub remains the source of truth for repositories — only references and curation data are stored.

---

### `profiles`

Public-facing user profile linked to Supabase Auth.

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  github_username text unique not null,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamp with time zone default now()
);
```

---

### `collections`

Curated groups of repositories created by a user.

```sql
create table collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  description text,
  is_public boolean default true,
  position integer default 0,
  created_at timestamp with time zone default now()
);
```

---

### `collection_repos`

Many-to-many mapping between collections and GitHub repositories.

```sql
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
```

---

## Row Level Security (RLS)

RLS is enforced at the database level to ensure secure access independent of application logic.

### Enable RLS

```sql
alter table profiles enable row level security;
alter table collections enable row level security;
alter table collection_repos enable row level security;
```

---

### Public read access

```sql
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
```

---

### Owner-only write access

```sql
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
```

---

### Design Notes

* GitHub repositories are **not duplicated** in the database
* A repository can belong to **multiple collections**
* Public viewers do not require authentication
* Only authenticated owners can create or modify collections
* Authorization is enforced via **PostgreSQL RLS**, not application code
