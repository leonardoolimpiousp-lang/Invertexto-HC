-- Clinical folders and notes tables
-- Stores user's prontuários organized by context and specialty

create table if not exists clinical_folders (
  id uuid default gen_random_uuid() primary key,
  slug text not null,
  context text not null check (context in ('ps', 'uti', 'ambulatorial')),
  specialty text check (specialty in ('cirurgia', 'clinica_medica', 'pediatria', 'ginecologia', 'obstetricia')),
  sub_specialty text,
  label text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),

  constraint fk_profile foreign key (slug) references profiles(slug) on delete cascade,
  constraint unique_folder_label unique(slug, label)
);

create table if not exists clinical_notes (
  id uuid default gen_random_uuid() primary key,
  folder_id uuid not null,
  content text default '',
  hd_list text[] default array[]::text[],
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),

  constraint fk_folder foreign key (folder_id) references clinical_folders(id) on delete cascade
);

-- Indexes for common queries
create index idx_clinical_folders_slug on clinical_folders(slug);
create index idx_clinical_folders_context on clinical_folders(context);
create index idx_clinical_notes_folder_id on clinical_notes(folder_id);
create index idx_clinical_notes_created_at on clinical_notes(created_at desc);

-- RLS policies
alter table clinical_folders enable row level security;
alter table clinical_notes enable row level security;

create policy "Users can view own folders" on clinical_folders
  for select using (true);

create policy "Users can insert own folders" on clinical_folders
  for insert with check (true);

create policy "Users can update own folders" on clinical_folders
  for update using (true);

create policy "Users can delete own folders" on clinical_folders
  for delete using (true);

create policy "Users can view own notes" on clinical_notes
  for select using (true);

create policy "Users can insert own notes" on clinical_notes
  for insert with check (true);

create policy "Users can update own notes" on clinical_notes
  for update using (true);

create policy "Users can delete own notes" on clinical_notes
  for delete using (true);
