create table if not exists users (
  id text primary key,
  name text not null,
  email text not null unique,
  password_hash text not null,
  role text not null default 'manager',
  avatar_url text,
  is_active integer not null default 1,
  created_at text not null
);

create table if not exists clients (
  id text primary key,
  name text not null,
  phone text not null,
  email text,
  notes text,
  created_at text not null
);

create table if not exists leads (
  id text primary key,
  client_id text not null references clients(id),
  source text not null default 'manual',
  status text not null default 'new',
  assigned_to text references users(id),
  value real,
  notes text,
  created_at text not null,
  updated_at text not null
);

create table if not exists tasks (
  id text primary key,
  lead_id text references leads(id),
  client_id text references clients(id),
  assigned_to text not null references users(id),
  title text not null,
  due_date text,
  status text not null default 'pending',
  created_at text not null
);
