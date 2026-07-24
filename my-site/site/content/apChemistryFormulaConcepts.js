const definitions = [
  { id: 'atomic-quantities-and-structure', label: 'Atomic quantities and structure', domainIds: ['atomic-structure-properties'] },
  { id: 'bonding-and-molecular-structure', label: 'Bonding and molecular structure', domainIds: ['compound-structure-properties'] },
  { id: 'intermolecular-forces-and-mixtures', label: 'Intermolecular forces and mixtures', domainIds: ['properties-substances-mixtures'] },
  { id: 'stoichiometry-and-reactions', label: 'Stoichiometry and reactions', domainIds: ['chemical-reactions'] },
  { id: 'rates-and-rate-laws', label: 'Rates and rate laws', domainIds: ['kinetics'] },
  { id: 'energy-and-enthalpy', label: 'Energy and enthalpy', domainIds: ['thermochemistry'] },
  { id: 'composition-and-direction', label: 'Composition and direction', domainIds: ['equilibrium'] },
  { id: 'reaction-transformation', label: 'Transforming reactions', domainIds: ['equilibrium'] },
  { id: 'solubility', label: 'Solubility equilibria', domainIds: ['equilibrium'] },
  { id: 'equilibrium-modeling', label: 'Equilibrium modeling', domainIds: ['equilibrium', 'acids-bases'] },
  { id: 'concentration-and-volume', label: 'Concentration and volume', domainIds: ['equilibrium', 'acids-bases'] },
  { id: 'acid-base-equilibria', label: 'Acid-base equilibria', domainIds: ['acids-bases'] },
  { id: 'buffers-and-titrations', label: 'Buffers and titrations', domainIds: ['acids-bases'] },
  { id: 'entropy-and-free-energy', label: 'Entropy and free energy', domainIds: ['thermodynamics-electrochemistry'] },
  { id: 'electrochemistry', label: 'Electrochemistry', domainIds: ['thermodynamics-electrochemistry'] },
]

export const apChemistryFormulaConceptGroups = Object.freeze(definitions.map((definition) => Object.freeze({
  ...definition,
  domainIds: Object.freeze([...definition.domainIds]),
})))

const byId = new Map(apChemistryFormulaConceptGroups.map((definition) => [definition.id, definition]))

export function getApChemistryFormulaConceptGroup(id) {
  return byId.get(id) || null
}
