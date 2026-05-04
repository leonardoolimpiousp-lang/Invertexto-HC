-- Add title to notes and parent_id to folders
alter table clinical_notes add column if not exists title text;
alter table clinical_folders add column if not exists parent_id uuid references clinical_folders(id) on delete cascade;

-- Update check constraint for context if needed (it already includes 'ambulatorial')
