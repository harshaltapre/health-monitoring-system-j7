-- Create caretaker-patient relationship table
create table if not exists public.caretaker_patients (
  id uuid primary key default gen_random_uuid(),
  caretaker_id uuid not null references auth.users(id) on delete cascade,
  patient_id uuid not null references auth.users(id) on delete cascade,
  relationship_type text not null check (relationship_type in (
    'family_member', 'healthcare_provider', 'nurse', 'doctor', 'guardian'
  )),
  permissions text[] not null default array['view_metrics', 'add_metrics'],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(caretaker_id, patient_id)
);

-- Enable RLS
alter table public.caretaker_patients enable row level security;

-- RLS policies for caretaker-patient relationships
create policy "caretakers_view_own_relationships"
  on public.caretaker_patients for select
  using (auth.uid() = caretaker_id);

create policy "patients_view_own_caretakers"
  on public.caretaker_patients for select
  using (auth.uid() = patient_id);

create policy "caretakers_manage_relationships"
  on public.caretaker_patients for all
  using (auth.uid() = caretaker_id);
