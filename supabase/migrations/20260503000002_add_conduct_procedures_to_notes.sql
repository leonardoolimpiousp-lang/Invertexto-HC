-- Add conduct and procedure tracking to clinical notes
alter table clinical_notes
  add column conduct_doubts boolean default false,
  add column unexpected_outcome boolean default false,
  add column procedures text[] default array[]::text[];
