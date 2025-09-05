-- Create alerts table for health monitoring notifications
create table if not exists public.health_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  alert_type text not null check (alert_type in (
    'critical_vitals', 'medication_reminder', 'appointment_reminder',
    'baby_vitals_alert', 'system_notification'
  )),
  severity text not null check (severity in ('low', 'medium', 'high', 'critical')) default 'medium',
  title text not null,
  message text not null,
  is_read boolean not null default false,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone
);

-- Enable RLS
alter table public.health_alerts enable row level security;

-- RLS policies for health alerts
create policy "alerts_select_own"
  on public.health_alerts for select
  using (auth.uid() = user_id);

create policy "alerts_update_own"
  on public.health_alerts for update
  using (auth.uid() = user_id);

-- Allow caretakers to view alerts for their patients
create policy "caretakers_view_patient_alerts"
  on public.health_alerts for select
  using (
    exists (
      select 1 from public.caretaker_patients cp
      where cp.caretaker_id = auth.uid()
      and cp.patient_id = health_alerts.user_id
    )
  );

-- Create index for better query performance
create index if not exists health_alerts_user_id_created_at_idx 
  on public.health_alerts (user_id, created_at desc);
