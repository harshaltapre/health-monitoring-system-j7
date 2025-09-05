-- Create baby monitoring sessions table for specialized monitoring
create table if not exists public.baby_monitoring_sessions (
  id uuid primary key default gen_random_uuid(),
  baby_id uuid not null references auth.users(id) on delete cascade,
  caretaker_id uuid not null references auth.users(id) on delete cascade,
  session_name text not null,
  monitoring_frequency_seconds integer not null default 30,
  alert_thresholds jsonb not null default '{
    "heart_rate_min": 100,
    "heart_rate_max": 160,
    "temperature_min": 36.1,
    "temperature_max": 37.2,
    "breathing_rate_min": 30,
    "breathing_rate_max": 60
  }'::jsonb,
  is_active boolean not null default true,
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  ended_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.baby_monitoring_sessions enable row level security;

-- RLS policies for baby monitoring sessions
create policy "caretakers_manage_baby_sessions"
  on public.baby_monitoring_sessions for all
  using (auth.uid() = caretaker_id);

create policy "parents_view_baby_sessions"
  on public.baby_monitoring_sessions for select
  using (
    auth.uid() = baby_id or
    exists (
      select 1 from public.caretaker_patients cp
      where cp.caretaker_id = auth.uid()
      and cp.patient_id = baby_monitoring_sessions.baby_id
    )
  );
