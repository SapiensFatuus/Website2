import { validateMisconceptionCatalog } from './editorialSchema.js'

const review = Object.freeze({
  status: 'draft',
  revision: 1,
  authoredBy: 'codex-ai-assisted-draft',
  updatedAt: '2026-07-24',
  reviewers: Object.freeze([]),
  history: Object.freeze([{ status: 'draft', date: '2026-07-24', actor: 'codex-ai-assisted-draft' }]),
})

const provenance = Object.freeze({
  kind: 'ai-generated',
  name: 'Study AI Helper original AP Chemistry draft',
  sourceIds: Object.freeze(['ap-chemistry-ced-fall-2024']),
  originalityNote: 'Independently written misconception diagnosis; no released-question or scoring-guide language was used.',
})

function record(id, title, incorrectIdea, correction, diagnosticCue, skillId, learningObjectiveId, sciencePracticeId) {
  return Object.freeze({
    id,
    schemaVersion: 1,
    title,
    incorrectIdea,
    correction,
    diagnosticCue,
    alignment: Object.freeze({
      frameworkId: 'ap-chemistry-fall-2024',
      subjectId: 'ap-chemistry',
      domainId: 'properties-substances-mixtures',
      skillIds: Object.freeze([skillId]),
      learningObjectiveIds: Object.freeze([learningObjectiveId]),
      sciencePracticeIds: Object.freeze([sciencePracticeId]),
    }),
    review,
    provenance,
  })
}

const misconceptions = [
  record('surface-area-dispersion', 'Ignoring molecular contact area', 'Molecules with the same formula always have identical dispersion attractions and boiling behavior.', 'Shape changes how closely molecules contact one another; a more extended shape can create stronger total dispersion attractions than a compact isomer.', 'Compare molecular surface contact before deciding that equal electron counts imply identical physical behavior.', 'intermolecular-interparticle-forces', '3.1.A', '4.D'),
  record('solid-conductivity-mobile-charge', 'Equating charged particles with conductivity', 'An ionic solid conducts electricity because it contains charged ions.', 'Electrical conduction requires mobile charge carriers; ions are fixed in an ionic solid but mobile in a melt or aqueous solution.', 'Ask whether the charged particles can move through the sample.', 'properties-solids', '3.2.A', '4.C'),
  record('phase-change-breaks-molecules', 'Breaking molecules during a phase change', 'Boiling a molecular substance breaks its covalent bonds into atoms.', 'A phase change alters particle spacing, motion, and intermolecular attractions while molecular identity remains unchanged.', 'Count atoms within each particle before and after the phase change.', 'solids-liquids-gases', '3.3.A', '3.C'),
  record('celsius-in-gas-law', 'Using Celsius in a gas relationship', 'Celsius temperature can be substituted directly into PV = nRT.', 'Gas relationships use absolute temperature because their proportionalities reference the zero of the kelvin scale.', 'Convert degrees Celsius to kelvin before substitution.', 'ideal-gas-law', '3.4.A', '5.C'),
  record('heavier-gas-has-more-ke', 'Assigning more kinetic energy to heavier gas particles', 'At the same temperature, heavier gas particles have greater average translational kinetic energy.', 'At the same temperature, gases have the same average translational kinetic energy; lighter particles have greater characteristic speed.', 'Separate the temperature-dependent energy comparison from the mass-dependent speed comparison.', 'kinetic-molecular-theory', '3.5.A', '4.A'),
  record('nonideal-attraction-direction', 'Reversing the pressure effect of attractions', 'Attractive forces make a real gas exert more pressure than an ideal gas under all conditions.', 'Attractions can reduce the force or frequency of wall collisions, producing a measured pressure below the ideal prediction when attractions dominate.', 'Follow a particle approaching the wall and consider the backward pull from other particles.', 'deviation-ideal-gas-law', '3.6.A', '6.E'),
  record('dilution-removes-solute', 'Removing solute during dilution', 'Adding solvent lowers concentration because solute particles disappear.', 'A physical dilution conserves solute amount while increasing total solution volume.', 'Calculate solute moles before and after dilution.', 'solutions-mixtures', '3.7.A', '5.F'),
  record('solution-particle-ratio-ignored', 'Ignoring dissociation stoichiometry', 'A particle diagram of dissolved MgCl2 should contain equal numbers of Mg2+ and Cl- ions.', 'Complete dissociation gives two chloride ions for every magnesium ion, preserving formula stoichiometry and charge balance.', 'Translate one formula unit into its dissolved-ion count before reading the diagram.', 'representations-solutions', '3.8.A', '3.C'),
  record('separation-without-property', 'Naming a separation method without a property', 'Any heterogeneous or homogeneous mixture can be separated by filtration.', 'A separation works only when it exploits a relevant property difference, such as particle size, volatility, solubility, or phase affinity.', 'Name the component property that the proposed apparatus actually distinguishes.', 'separation-solutions-mixtures', '3.9.A', '2.C'),
  record('stirring-increases-solubility', 'Confusing dissolution rate with solubility', 'Stirring always increases the equilibrium amount of solute that dissolves.', 'Stirring commonly speeds the approach to equilibrium but does not necessarily change equilibrium solubility at fixed conditions.', 'Distinguish how fast equilibrium is reached from how much is present at equilibrium.', 'solubility', '3.10.A', '4.D'),
  record('absorption-all-wavelengths', 'Treating absorption as wavelength independent', 'A species that absorbs light absorbs every wavelength equally.', 'Absorption depends on whether photon energy matches an allowed change, so absorbance generally varies with wavelength.', 'Connect the selected wavelength to the sample spectrum and transition energy.', 'spectroscopy-electromagnetic-spectrum', '3.11.A', '4.A'),
  record('intensity-changes-photon-energy', 'Changing photon energy with intensity', 'A more intense beam has more energetic photons at the same wavelength.', 'At fixed wavelength, each photon has the same energy; greater intensity means more photons arrive per time or area.', 'Use E = hc/lambda for one photon before discussing photon count.', 'properties-photons', '3.12.A', '5.F'),
  record('beer-lambert-calibration-transfer', 'Reusing calibration after changing wavelength', 'A Beer-Lambert calibration line remains valid when the measurement wavelength changes.', 'Molar absorptivity depends on wavelength, so standards and unknown must share the same wavelength or a new calibration is required.', 'Identify which experimental change alters epsilon in A = epsilon b c.', 'beer-lambert-law', '3.13.A', '2.E'),
]

const validation = validateMisconceptionCatalog(misconceptions)
if (!validation.valid) throw new Error(`Unit 3 misconception validation failed:\n- ${validation.errors.join('\n- ')}`)

export const apChemistryPropertiesMixturesMisconceptions = Object.freeze(misconceptions)
