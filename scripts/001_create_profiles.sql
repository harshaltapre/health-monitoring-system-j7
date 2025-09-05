-- Create user profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null check (role in ('patient', 'caretaker')) default 'patient',
  phone text,
  date_of_birth date,
  emergency_contact_name text,
  emergency_contact_phone text,
  medical_conditions text[],
  medications text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- RLS policies for profiles
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

create policy "profiles_delete_own"
  on public.profiles for delete
  using (auth.uid() = id);

-- Allow caretakers to view their patients' profiles
create policy "caretakers_view_patients"
  on public.profiles for select
  using (
    exists (
      select 1 from public.caretaker_patients cp
      where cp.caretaker_id = auth.uid()
      and cp.patient_id = profiles.id
    )
  );
