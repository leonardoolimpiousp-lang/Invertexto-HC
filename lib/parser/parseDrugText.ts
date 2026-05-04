import * as R from './regex'
import * as D from './dictionaries'

export interface RawDoseMention {
  value: number
  unit: string
  raw: string
}

export interface PartialDrugJSON {
  name_candidate: string | null
  brand_names_raw: string[]
  drug_class_hint: string | null
  disponivel_sus: boolean | null
  dose_mentions: RawDoseMention[]
  side_effects: string[]
  contraindications: string[]
  _parser_version: string
  _warnings: string[]
}

export function parseDrugText(rawText: string): PartialDrugJSON {
  const warnings: string[] = []
  const text = rawText.trim()
  const lines = text.split('\n').filter(l => l.trim())

  const found: RawDoseMention[] = []
  let m: RegExpExecArray | null

  // Extract dose mentions
  const re = new RegExp(R.DOSE_VALUE.source, 'gi')
  while ((m = re.exec(text)) !== null) {
    found.push({
      value: parseFloat(m[1].replace(',', '.')),
      unit: m[2],
      raw: m[0]
    })
  }

  // Extract side effects
  const sideEffects: string[] = []
  if (text.match(R.SIDE_EFFECT_MARKER)) {
    const match = text.match(/EA:\s*([^\n]+)/i)
    if (match) {
      sideEffects.push(...match[1].split(/[,;]/).map(s => s.trim()))
    }
  }

  // Extract contraindications
  const contraindications: string[] = []
  if (text.match(R.CONTRAINDICATION_MARKER)) {
    const match = text.match(/CI:\s*([^\n]+)/i)
    if (match) {
      contraindications.push(...match[1].split(/[,;/].map(c => c.trim())))
    }
  }

  // Extract drug name candidate from first line
  const nameMatch = lines[0]?.match(/^([A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]+)/)

  return {
    name_candidate: nameMatch?.[1] ?? null,
    brand_names_raw: [],
    drug_class_hint: null,
    disponivel_sus: null,
    dose_mentions: found,
    side_effects: sideEffects,
    contraindications,
    _parser_version: '1.0.0',
    _warnings: warnings
  }
}
