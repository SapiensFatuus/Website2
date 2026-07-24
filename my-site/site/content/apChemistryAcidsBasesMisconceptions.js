import { validateMisconceptionCatalog } from './editorialSchema.js'

const review = Object.freeze({
  status: 'draft', revision: 1, authoredBy: 'codex-ai-assisted-draft', updatedAt: '2026-07-20', reviewers: Object.freeze([]),
  history: Object.freeze([{ status: 'draft', date: '2026-07-20', actor: 'codex-ai-assisted-draft' }]),
})

const provenance = Object.freeze({
  kind: 'ai-generated',
  name: 'Study AI Helper original AP Chemistry draft',
  sourceIds: Object.freeze(['ap-chemistry-ced-fall-2024']),
  originalityNote: 'Independently written misconception diagnosis; no released-question or scoring-guide language was used.',
})

function record(id, title, incorrectIdea, correction, diagnosticCue, skillId, learningObjectiveId, sciencePracticeId) {
  return Object.freeze({
    id, schemaVersion: 1, title, incorrectIdea, correction, diagnosticCue,
    alignment: Object.freeze({
      frameworkId: 'ap-chemistry-fall-2024',
      subjectId: 'ap-chemistry',
      domainId: 'acids-bases',
      skillIds: Object.freeze([skillId]),
      learningObjectiveIds: Object.freeze([learningObjectiveId]),
      sciencePracticeIds: Object.freeze([sciencePracticeId]),
    }),
    review,
    provenance,
  })
}

const misconceptions = [
  record('acid-means-negative-charge', 'Assigning acid-base role from charge', 'An acid must be negatively charged and a base must be positive.', 'Acid-base role follows proton donation or acceptance, not the sign of a species charge.', 'Track the transferred proton and identify the species before and after transfer.', 'introduction-acids-bases', '8.1.A', '5.B'),
  record('conjugate-pair-not-one-proton', 'Pairing species that are not conjugates', 'Any acid and base in the same equation form a conjugate pair.', 'Members of a conjugate pair differ by exactly one proton.', 'Compare formulas and charges for a one-H+, one-charge difference.', 'introduction-acids-bases', '8.1.A', '5.B'),
  record('ph-scale-linear', 'Treating pH as a linear scale', 'A one-unit pH change changes hydronium concentration by one unit.', 'Because pH is logarithmic, one pH unit corresponds to a tenfold hydronium-concentration ratio.', 'Convert both pH values to powers of ten before comparing.', 'ph-poh-strong-acids-bases', '8.2.A', '5.B'),
  record('strong-means-concentrated', 'Equating strength with concentration', 'A strong acid must be more concentrated than a weak acid.', 'Strength describes extent of ionization; concentration describes amount per volume.', 'Ask whether the claim concerns particles ionizing or particles present per volume.', 'weak-acid-base-equilibria', '8.3.A', '5.C'),
  record('weak-acid-complete-ionization', 'Completely ionizing a weak acid', 'The initial weak-acid concentration equals the equilibrium hydronium concentration.', 'A weak acid establishes an equilibrium, so hydronium must be determined from Ka and equilibrium composition.', 'Write an ICE table and locate initial versus equilibrium values.', 'weak-acid-base-equilibria', '8.3.A', '5.C'),
  record('skip-buffer-stoichiometry', 'Applying a buffer equation before reaction', 'Added strong acid can be inserted directly into the buffer ratio.', 'Strong acid or base reacts stoichiometrically with a buffer component before an equilibrium ratio is evaluated.', 'Update conjugate-pair moles using the neutralization equation first.', 'acid-base-reactions-buffers', '8.4.A', '5.F'),
  record('equivalence-always-seven', 'Making every equivalence point neutral', 'Every acid-base equivalence point has pH 7.', 'Equivalence is a stoichiometric condition; conjugate-species hydrolysis can make the solution acidic or basic.', 'Inventory the species present at equivalence and test its reaction with water.', 'acid-base-titrations', '8.5.A', '5.D'),
  record('indicator-creates-equivalence', 'Treating an indicator as the source of equivalence', 'An indicator makes a titration reach its equivalence point when its color changes.', 'Reaction stoichiometry determines equivalence; a suitable indicator only signals a nearby pH region through its own low-concentration acid-base equilibrium.', 'Separate the analyte-titrant mole relationship from the indicator color equilibrium.', 'acid-base-titrations', '8.5.A', '6.G'),
  record('more-oxygen-weaker-oxoacid', 'Reversing an oxoacid trend', 'Adding electron-withdrawing oxygen atoms makes an oxoacid weaker.', 'Additional oxygen atoms can stabilize the conjugate base through induction and charge delocalization, increasing acid strength within a comparable series.', 'Draw or describe how the negative charge is stabilized after proton loss.', 'molecular-structure-acids-bases', '8.6.A', '6.C'),
  record('inductive-effect-reversed', 'Reversing an electron-withdrawing substituent trend', 'An electron-withdrawing substituent destabilizes a nearby negatively charged conjugate base and weakens the acid.', 'An electron-withdrawing substituent can stabilize negative charge through the inductive effect, making proton loss more favorable and strengthening the acid within a comparable series.', 'Compare the conjugate bases and trace electron withdrawal through the sigma-bond framework.', 'molecular-structure-acids-bases', '8.6.A', '6.C'),
  record('ignore-bond-strength-acidity', 'Using bond polarity without bond strength', 'The most polar hydrogen bond always belongs to the strongest binary acid.', 'For related binary hydrides, proton transfer depends on the full energetic balance; a very strong H-X bond can oppose ionization even when that bond is highly polar.', 'Compare both bond polarity and the energy required to break the H-X bond.', 'molecular-structure-acids-bases', '8.6.A', '6.C'),
  record('stronger-acid-higher-pka', 'Reversing acid strength and pKa', 'A stronger acid has a larger pKa.', 'Because pKa = -log Ka, a stronger acid has larger Ka but smaller pKa.', 'Test the sign with two powers-of-ten Ka values.', 'ph-pka', '8.7.A', '2.D'),
  record('buffer-keeps-ph-fixed', 'Treating buffer pH as fixed', 'A buffer prevents any pH change.', 'A buffer reduces a pH change by consuming added strong acid or base, but its component ratio still changes.', 'Track the post-reaction conjugate-pair ratio.', 'properties-buffers', '8.8.A', '6.D'),
  record('henderson-ratio-reversed', 'Reversing the buffer ratio', 'Henderson-Hasselbalch uses weak acid divided by conjugate base.', 'The standard acid-buffer form uses conjugate base divided by weak acid.', 'Check that more conjugate base should raise pH above pKa.', 'henderson-hasselbalch-equation', '8.9.A', '5.F'),
  record('capacity-only-ratio', 'Using ratio alone for buffer capacity', 'Two buffers with the same conjugate ratio have the same capacity regardless of amount.', 'The ratio controls initial pH, while the amounts of both components strongly affect how much added reagent can be consumed.', 'Compare moles available to react with the same added amount.', 'buffer-capacity', '8.10.A', '6.G'),
  record('acid-dissolves-every-salt', 'Assuming acid raises every salt solubility', 'Lowering pH substantially increases the solubility of every ionic solid.', 'Acid has a strong effect only when it removes a dissolved ion through a favorable proton-transfer or coupled reaction.', 'Identify whether either dissolution ion appreciably reacts with hydronium.', 'ph-solubility', '8.11.A', '2.D'),
]

const validation = validateMisconceptionCatalog(misconceptions)
if (!validation.valid) throw new Error(`Misconception catalog validation failed:\n- ${validation.errors.join('\n- ')}`)

export const apChemistryAcidsBasesMisconceptions = Object.freeze(misconceptions)
