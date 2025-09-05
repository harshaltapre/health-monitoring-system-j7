-- Add ECG metric type and API key storage
alter table public.health_metrics 
drop constraint if exists health_metrics_metric_type_check;

alter table public.health_metrics 
add constraint health_metrics_metric_type_check 
check (metric_type in (
  'heart_rate', 'blood_pressure_systolic', 'blood_pressure_diastolic',
  'temperature', 'oxygen_saturation', 'blood_glucose', 'weight',
  'baby_heart_rate', 'baby_temperature', 'baby_breathing_rate',
  'ecg', 'ecg_realtime'
));

-- Add API keys table for device integration
create table if not exists public.api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  key_name text not null,
  api_key text not null,
  device_type text not null check (device_type in ('esp32', 'thingspeak', 'custom')),
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for API keys
alter table public.api_keys enable row level security;

-- RLS policies for API keys
create policy "api_keys_select_own"
  on public.api_keys for select
  using (auth.uid() = user_id);

create policy "api_keys_insert_own"
  on public.api_keys for insert
  with check (auth.uid() = user_id);

create policy "api_keys_update_own"
  on public.api_keys for update
  using (auth.uid() = user_id);

create policy "api_keys_delete_own"
  on public.api_keys for delete
  using (auth.uid() = user_id);

-- Create index for API keys
create index if not exists api_keys_user_id_idx on public.api_keys (user_id);
