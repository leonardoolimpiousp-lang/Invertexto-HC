-- Add fields for doubts and reflections in Dúvidas no Plantão
alter table clinical_notes
  add column if not exists plantao_registro text,
  add column if not exists plantao_duvidas text,
  add column if not exists plantao_reflexoes text;
