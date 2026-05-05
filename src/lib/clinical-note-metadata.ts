export type PatientDestination =
  | "alta"
  | "alta_retorno_ambulatorial"
  | "internacao"
  | "obito";

export interface ClinicalNoteMetadata {
  patientDestination: PatientDestination | null;
  encounterClosed: boolean;
  encounterClosedAt: string | null;
  plantaoRegistro: string | null;
}

const METADATA_PREFIX = "__invertexto_meta:";
const VALID_DESTINATIONS = new Set<PatientDestination>([
  "alta",
  "alta_retorno_ambulatorial",
  "internacao",
  "obito",
]);

type NoteLike = {
  hd_list?: string[] | null;
  patient_destination?: PatientDestination | null;
  encounter_closed?: boolean | null;
  encounter_closed_at?: string | null;
  plantao_registro?: string | null;
  plantao_duvidas?: string | null;
  plantao_reflexoes?: string | null;
};

export function getVisibleHdList(hdList: string[] | null | undefined): string[] {
  return (hdList || []).filter((item) => !item.startsWith(METADATA_PREFIX));
}

export function parseClinicalNoteMetadata(
  hdList: string[] | null | undefined,
): ClinicalNoteMetadata {
  const fallback: ClinicalNoteMetadata = {
    patientDestination: null,
    encounterClosed: false,
    encounterClosedAt: null,
    plantaoRegistro: null,
  };

  const rawMetadata = (hdList || [])
    .find((item) => item.startsWith(METADATA_PREFIX))
    ?.slice(METADATA_PREFIX.length);

  if (!rawMetadata) return fallback;

  try {
    const parsed = JSON.parse(rawMetadata) as Partial<ClinicalNoteMetadata>;
    const patientDestination = VALID_DESTINATIONS.has(parsed.patientDestination as PatientDestination)
      ? (parsed.patientDestination as PatientDestination)
      : null;

    return {
      patientDestination,
      encounterClosed: Boolean(parsed.encounterClosed),
      encounterClosedAt:
        typeof parsed.encounterClosedAt === "string" ? parsed.encounterClosedAt : null,
      plantaoRegistro:
        typeof parsed.plantaoRegistro === "string" ? parsed.plantaoRegistro : null,
    };
  } catch {
    return fallback;
  }
}

export function withClinicalNoteMetadata(
  hdList: string[] | null | undefined,
  metadata: ClinicalNoteMetadata,
): string[] {
  const visibleHdList = getVisibleHdList(hdList);
  const hasMetadata =
    Boolean(metadata.patientDestination) ||
    metadata.encounterClosed ||
    Boolean(metadata.encounterClosedAt) ||
    Boolean(metadata.plantaoRegistro);

  if (!hasMetadata) return visibleHdList;

  return [
    ...visibleHdList,
    `${METADATA_PREFIX}${JSON.stringify(metadata)}`,
  ];
}

export function getNotePatientDestination(note: NoteLike): PatientDestination | null {
  return note.patient_destination ?? parseClinicalNoteMetadata(note.hd_list).patientDestination;
}

export function isNoteEncounterClosed(note: NoteLike): boolean {
  return Boolean(note.encounter_closed || parseClinicalNoteMetadata(note.hd_list).encounterClosed);
}

export function getNoteEncounterClosedAt(note: NoteLike): string | null {
  return note.encounter_closed_at ?? parseClinicalNoteMetadata(note.hd_list).encounterClosedAt;
}

export function getNotePlantaoRegistro(note: NoteLike): string {
  return (
    note.plantao_registro ||
    [note.plantao_duvidas, note.plantao_reflexoes].filter(Boolean).join("\n\n") ||
    parseClinicalNoteMetadata(note.hd_list).plantaoRegistro ||
    ""
  );
}
