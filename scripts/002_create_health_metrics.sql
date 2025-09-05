-- Create health metrics table for storing vital signs and measurements
create table if not exists public.health_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  metric_type text not null check (metric_type in (
    'heart_rate', 'blood_pressure_systolic', 'blood_pressure_diastolic',
    'temperature', 'oxygen_saturation', 'blood_glucose', 'weight',
    'baby_heart_rate', 'baby_temperature', 'baby_breathing_rate'
  )),
  value numeric not null,
  unit text not null,
  recorded_at timestamp with time zone default timezone('utc'::text, now()) not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.health_metrics enable row level security;

-- RLS policies for health metrics
create policy "health_metrics_select_own"
  on public.health_metrics for select
  using (auth.uid() = user_id);

create policy "health_metrics_insert_own"
  on public.health_metrics for insert
  with check (auth.uid() = user_id);

create policy "health_metrics_update_own"
  on public.health_metrics for update
  using (auth.uid() = user_id);

create policy "health_metrics_delete_own"
  on public.health_metrics for delete
  using (auth.uid() = user_id);

-- Allow caretakers to view their patients' health metrics
create policy "caretakers_view_patient_metrics"
  on public.health_metrics for select
  using (
    exists (
      select 1 from public.caretaker_patients cp
      where cp.caretaker_id = auth.uid()
      and cp.patient_id = health_metrics.user_id
    )
  );

-- Allow caretakers to insert metrics for their patients
create policy "caretakers_insert_patient_metrics"
  on public.health_metrics for insert
  with check (
    exists (
      select 1 from public.caretaker_patients cp
      where cp.caretaker_id = auth.uid()
      and cp.patient_id = health_metrics.user_id
    )
  );

-- Create index for better query performance
create index if not exists health_metrics_user_id_recorded_at_idx 
  on public.health_metrics (user_id, recorded_at desc);
