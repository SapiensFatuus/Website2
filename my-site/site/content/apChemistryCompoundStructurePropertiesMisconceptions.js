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
      frameworkId: 'ap-chemistry-fall-2024', subjectId: 'ap-chemistry', domainId: 'compound-structure-properties',
      skillIds: Object.freeze([skillId]), learningObjectiveIds: Object.freeze([learningObjectiveId]),
      sciencePracticeIds: Object.freeze([sciencePracticeId]),
    }),
    review, provenance,
  })
}
const misconceptions = [
  record('compound-structure-bond-type-binary', 'Treating bond type as a strict binary', 'Every bond is either fully ionic or perfectly nonpolar covalent.', 'Bonding lies on a continuum of electron sharing; electronegativity and particle structure support the most useful model.', 'Compare electron-density distribution and bulk structure, not a single memorized cutoff.', 'types-chemical-bonds', '2.1.A', '6.A'),
  record('compound-structure-minimum-zero-force', 'Placing the bond-energy minimum at zero force and zero attraction', 'At the equilibrium bond length, no attractive or repulsive forces exist.', 'At the potential-energy minimum, attractive and repulsive forces balance so the net force is zero.', 'Distinguish zero net force from absence of individual forces.', 'intramolecular-force-potential-energy', '2.2.A', '3.A'),
  record('compound-structure-ionic-molecules', 'Treating ionic solids as discrete molecules', 'An ionic solid consists of separate neutral molecules.', 'An ionic solid is an extended lattice of oppositely charged ions; its formula gives the simplest charge-neutral ratio.', 'Describe repeating coordination rather than molecular units.', 'structure-ionic-solids', '2.3.A', '4.C'),
  record('compound-structure-metal-fixed-bonds', 'Modeling metals as localized pairs only', 'Each metal atom forms fixed two-electron bonds to only one neighbor.', 'Metallic bonding uses delocalized valence electrons shared across many metal centers, supporting conductivity and malleability.', 'Connect mobile electrons and nondirectional bonding to observed properties.', 'structure-metals-alloys', '2.4.A', '4.C'),
  record('compound-structure-lewis-electron-count', 'Ignoring total valence-electron count', 'A Lewis diagram is correct if every atom has an octet, regardless of total electrons.', 'Count all valence electrons, place bonds and lone pairs, and verify both total count and appropriate octets or exceptions.', 'Audit total electrons before accepting the diagram.', 'lewis-diagrams', '2.5.A', '3.B'),
  record('compound-structure-resonance-switching', 'Treating resonance structures as alternating molecules', 'A molecule rapidly switches between separate resonance structures.', 'Resonance drawings are contributors to one delocalized electron distribution; the actual structure is a hybrid.', 'Discuss equivalent bond lengths and delocalization rather than switching.', 'resonance-formal-charge', '2.6.A', '6.C'),
  record('compound-structure-vsepr-lone-pairs-invisible', 'Ignoring lone pairs in geometry', 'Only bonded atoms count as electron domains and determine shape.', 'Bonding regions and lone pairs both repel; electron-domain geometry includes all domains while molecular geometry names atom positions.', 'Count domains before naming electron and molecular geometry.', 'vsepr-hybridization', '2.7.A', '6.C'),
]
const validation = validateMisconceptionCatalog(misconceptions)
if (!validation.valid) throw new Error(`Unit 2 misconception validation failed:\n- ${validation.errors.join('\n- ')}`)
export const apChemistryCompoundStructurePropertiesMisconceptions = Object.freeze(misconceptions)
