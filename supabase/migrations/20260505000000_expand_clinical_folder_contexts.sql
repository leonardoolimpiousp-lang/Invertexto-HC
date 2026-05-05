-- Expand allowed clinical folder contexts to match current application UI
alter table clinical_folders
  drop constraint if exists clinical_folders_context_check;

alter table clinical_folders
  add constraint clinical_folders_context_check
  check (
    context in (
      'ps',
      'uti',
      'ambulatorial',
      'sala_de_emergencia',
      'cirurgia',
      'enfermaria'
    )
  );
