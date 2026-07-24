import { validateMisconceptionCatalog } from './editorialSchema.js'

const UPDATED_AT = '2026-07-24'
const review = Object.freeze({
  status: 'draft', revision: 1, authoredBy: 'codex-ai-assisted-draft', updatedAt: UPDATED_AT,
  reviewers: Object.freeze([]), history: Object.freeze([{ status: 'draft', date: UPDATED_AT, actor: 'codex-ai-assisted-draft' }]),
})
const provenance = Object.freeze({
  kind: 'ai-generated', name: 'Study AI Helper original AP Chemistry draft',
  sourceIds: Object.freeze(['ap-chemistry-ced-fall-2024']),
  originalityNote: 'Independently written misconception diagnosis; no released-question or scoring-guide language was used.',
})
function record(id, title, incorrectIdea, correction, diagnosticCue, skillId, learningObjectiveId, sciencePracticeId) {
  return Object.freeze({
    id, schemaVersion: 1, title, incorrectIdea, correction, diagnosticCue,
    alignment: Object.freeze({
      frameworkId: 'ap-chemistry-fall-2024', subjectId: 'ap-chemistry', domainId: 'atomic-structure-properties',
      skillIds: Object.freeze([skillId]), learningObjectiveIds: Object.freeze([learningObjectiveId]),
      sciencePracticeIds: Object.freeze([sciencePracticeId]),
    }),
    review, provenance,
  })
}
const misconceptions = [
  record('atomic-structure-molar-mass-particles', 'Using molar mass as particles per mole', 'Molar mass directly converts particles to grams without moles.', 'Use Avogadro constant between particles and moles, and molar mass between moles and grams.', 'Write particles <-> moles <-> mass as two distinct conversions.', 'moles-molar-mass', '1.1.A', '5.B'),
  record('atomic-structure-mass-spectrum-peak-height-mass', 'Treating peak height as isotope mass', 'The tallest mass-spectrum peak represents the heaviest isotope.', 'Horizontal position gives isotope mass-to-charge value; relative peak intensity gives abundance.', 'Read axis meaning before interpreting any peak.', 'mass-spectra-elements', '1.2.A', '5.D'),
  record('atomic-structure-empirical-mass-ratio', 'Using gram ratios as subscripts', 'Empirical-formula subscripts are the measured mass ratios.', 'Convert each elemental mass to moles, then divide by the smallest mole amount and obtain whole-number ratios.', 'Do not assign subscripts until every mass is converted to moles.', 'elemental-composition-pure-substances', '1.3.A', '2.A'),
  record('atomic-structure-mixture-percent-unweighted', 'Averaging mixture percentages without mass weighting', 'The overall percent composition is the simple average of component percentages.', 'Weight each component contribution by its amount or solve a mass balance.', 'Track component mass and analyte mass in the same table.', 'composition-mixtures', '1.4.A', '5.A'),
  record('atomic-structure-electrons-fill-by-shell-only', 'Filling orbitals by shell number alone', 'All orbitals with lower principal shell fill before any higher-shell orbital.', 'Electron configurations follow orbital energy order, Pauli exclusion, and Hund filling; energy order is not simply shell number.', 'Use the accepted orbital filling sequence and count total electrons.', 'atomic-structure-electron-configuration', '1.5.A', '1.A'),
  record('atomic-structure-pes-intensity-binding', 'Confusing PES intensity and binding energy', 'A taller PES peak means those electrons have greater binding energy.', 'Peak position gives binding energy; peak intensity or area reflects the relative electron count in that subshell.', 'Interpret horizontal position and vertical magnitude separately.', 'photoelectron-spectroscopy', '1.6.A', '4.B'),
  record('atomic-structure-periodic-trend-distance-only', 'Explaining trends with distance alone', 'Atomic radius and ionization energy depend only on the number of occupied shells.', 'Effective nuclear charge, shielding, and electron-shell distance together explain periodic trends.', 'Compare same-period effective charge separately from new-shell effects.', 'periodic-trends', '1.7.A', '4.A'),
  record('atomic-structure-ionic-formula-unbalanced', 'Writing ionic formulas without charge balance', 'Ionic subscripts copy the number of valence electrons.', 'Choose the smallest whole-number ion ratio whose total positive and negative charges sum to zero.', 'Write ion charges first and verify net charge zero.', 'valence-electrons-ionic-compounds', '1.8.A', '4.C'),
]
const validation = validateMisconceptionCatalog(misconceptions)
if (!validation.valid) throw new Error(`Unit 1 misconception validation failed:\n- ${validation.errors.join('\n- ')}`)
export const apChemistryAtomicStructurePropertiesMisconceptions = Object.freeze(misconceptions)
