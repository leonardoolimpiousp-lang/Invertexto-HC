-- Formalize clinical note closure before publishing destination and doubts workflow
alter table clinical_notes
  add column if not exists encounter_closed boolean default false,
  add column if not exists encounter_closed_at timestamp with time zone;
