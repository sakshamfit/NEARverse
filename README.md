# Nearverse

A social media app that connects people based on location and skills.

## Features

- User authentication (email/password) via Supabase
- Profile setup with name, skills, bio, and location
- Discover nearby users within a customizable radius
- See shared skills and distance to other users
- Simple, minimalistic UI built with React and Tailwind CSS

## Tech Stack

- React 19
- Vite
- TypeScript
- Tailwind CSS
- Supabase (for auth and database)
- React Router

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up Supabase:
   - Create a project at [supabase.com](https://supabase.com)
   - Copy the URL and anon key to a `.env` file:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_anon_key
     ```
   - Run the SQL schema (see below)
4. Start the development server: `npm run dev`

## Database Schema

```sql
create table profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  skills text[],
  bio text,
  latitude decimal,
  longitude decimal,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table publications enable row level security;

create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);
```

## Environment Variables

Create a `.env` file in the root directory with:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## License

MIT