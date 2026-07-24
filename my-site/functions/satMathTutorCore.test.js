import test from 'node:test'
import assert from 'node:assert/strict'
import {
  buildTutorPrompt,
  buildTutorPromptParts,
  prepareTutorRequest,
  sanitizeTutorOutput,
  validateTutorRequest,
} from './satMathTutorCore.js'
import {
  getSupportedTutorTargets,
  getTutorContextPack,
  getTutorContextPacksForTarget,
  tutorRegistry,
  validateTutorContextPacks,
} from './tutorRegistry.js'
import { resolveEffectiveTutorTarget, resolveTutorTarget } from './tutorScopeCatalog.js'

const equationTarget = {
  scope: 'skill', examId: 'sat', subjectId: 'sat-math', domainId: 'algebra', skillId: 'linear-equations-one-variable',
}
const functionTarget = {
  scope: 'skill', examId: 'sat', subjectId: 'sat-math', domainId: 'algebra', skillId: 'linear-functions',
}
const algebraTarget = { scope: 'domain', examId: 'sat', subjectId: 'sat-math', domainId: 'algebra' }
const satTarget = { scope: 'subject', examId: 'sat', subjectId: 'sat-math' }
const chemistryTarget = { scope: 'subject', examId: 'ap', subjectId: 'ap-chemistry' }
const biologyTarget = { scope: 'subject', examId: 'ap', subjectId: 'ap-biology' }

function request(target, message, history = []) {
  return { target, message, history }
}

test('legacy grounding registry remains valid and available as optional material', () => {
  assert.equal(tutorRegistry.sat['sat-math'].algebra['linear-equations-one-variable'].label, 'Linear equations in one variable')
  assert.equal(tutorRegistry.sat['sat-math'].algebra['linear-functions'].label, 'Linear functions')
  assert.equal(getSupportedTutorTargets().length, 90)
  const packs = [getTutorContextPack(equationTarget), getTutorContextPack(functionTarget)]
  assert.doesNotThrow(() => validateTutorContextPacks(packs))
  assert.ok(packs.every((pack) => pack.materialNotice.match(/not copied/i)))
  assert.throws(() => validateTutorContextPacks([packs[0], packs[0]]), /Duplicate tutor target/)
})

test('all twelve Unit 7 packs remain draft-only and cover canonical equilibrium skills', () => {
  const equilibriumTarget = { scope: 'domain', examId: 'ap', subjectId: 'ap-chemistry', domainId: 'equilibrium' }
  assert.deepEqual(getTutorContextPacksForTarget(equilibriumTarget), [])

  const previewPacks = getTutorContextPacksForTarget(equilibriumTarget, { includeDrafts: true })
  assert.equal(previewPacks.length, 12)
  assert.ok(previewPacks.every((pack) => pack.reviewStatus === 'draft'))
  assert.deepEqual(previewPacks.map((pack) => pack.target.skillId), [
    'introduction-equilibrium',
    'direction-reversible-reactions',
    'reaction-quotient-equilibrium-constant',
    'calculating-equilibrium-constant',
    'magnitude-equilibrium-constant',
    'properties-equilibrium-constant',
    'calculating-equilibrium-concentrations',
    'representations-equilibrium',
    'introduction-le-chatelier-principle',
    'reaction-quotient-le-chatelier-principle',
    'introduction-solubility-equilibria',
    'common-ion-effect',
  ])
  assert.equal(new Set(previewPacks.flatMap((pack) => pack.materials.map((material) => material.id))).size, 12)
})

test('all eleven Unit 8 packs remain draft-only and cover canonical acids-bases skills', () => {
  const acidsBasesTarget = { scope: 'domain', examId: 'ap', subjectId: 'ap-chemistry', domainId: 'acids-bases' }
  assert.deepEqual(getTutorContextPacksForTarget(acidsBasesTarget), [])

  const previewPacks = getTutorContextPacksForTarget(acidsBasesTarget, { includeDrafts: true })
  assert.equal(previewPacks.length, 11)
  assert.ok(previewPacks.every((pack) => pack.reviewStatus === 'draft'))
  assert.deepEqual(previewPacks.map((pack) => pack.target.skillId), [
    'introduction-acids-bases',
    'ph-poh-strong-acids-bases',
    'weak-acid-base-equilibria',
    'acid-base-reactions-buffers',
    'acid-base-titrations',
    'molecular-structure-acids-bases',
    'ph-pka',
    'properties-buffers',
    'henderson-hasselbalch-equation',
    'buffer-capacity',
    'ph-solubility',
  ])
  assert.equal(new Set(previewPacks.flatMap((pack) => pack.materials.map((material) => material.id))).size, 11)
  assert.ok(previewPacks.every((pack) => /original editorial/.test(pack.materialNotice)))
})

test('all thirteen Unit 3 packs remain draft-only and cover canonical properties-mixtures skills', () => {
  const target = { scope: 'domain', examId: 'ap', subjectId: 'ap-chemistry', domainId: 'properties-substances-mixtures' }
  assert.deepEqual(getTutorContextPacksForTarget(target), [])
  const previewPacks = getTutorContextPacksForTarget(target, { includeDrafts: true })
  assert.equal(previewPacks.length, 13)
  assert.ok(previewPacks.every((pack) => pack.reviewStatus === 'draft'))
  assert.deepEqual(previewPacks.map((pack) => pack.target.skillId), [
    'intermolecular-interparticle-forces',
    'properties-solids',
    'solids-liquids-gases',
    'ideal-gas-law',
    'kinetic-molecular-theory',
    'deviation-ideal-gas-law',
    'solutions-mixtures',
    'representations-solutions',
    'separation-solutions-mixtures',
    'solubility',
    'spectroscopy-electromagnetic-spectrum',
    'properties-photons',
    'beer-lambert-law',
  ])
  assert.equal(new Set(previewPacks.flatMap((pack) => pack.materials.map(({ id }) => id))).size, 13)
})

test('all nine Unit 4 packs remain draft-only and cover canonical chemical-reaction skills', () => {
  const target = { scope: 'domain', examId: 'ap', subjectId: 'ap-chemistry', domainId: 'chemical-reactions' }
  assert.deepEqual(getTutorContextPacksForTarget(target), [])
  const previewPacks = getTutorContextPacksForTarget(target, { includeDrafts: true })
  assert.equal(previewPacks.length, 9)
  assert.ok(previewPacks.every((pack) => pack.reviewStatus === 'draft'))
  assert.deepEqual(previewPacks.map((pack) => pack.target.skillId), [
    'introduction-reactions',
    'net-ionic-equations',
    'representations-reactions',
    'physical-chemical-changes',
    'stoichiometry',
    'introduction-titration',
    'types-chemical-reactions',
    'introduction-acid-base-reactions',
    'oxidation-reduction-reactions',
  ])
  assert.equal(new Set(previewPacks.flatMap((pack) => pack.materials.map(({ id }) => id))).size, 9)
})

test('all eleven Unit 5 packs remain draft-only and cover canonical kinetics skills', () => {
  const target = { scope: 'domain', examId: 'ap', subjectId: 'ap-chemistry', domainId: 'kinetics' }
  assert.deepEqual(getTutorContextPacksForTarget(target), [])
  const previewPacks = getTutorContextPacksForTarget(target, { includeDrafts: true })
  assert.equal(previewPacks.length, 11)
  assert.ok(previewPacks.every((pack) => pack.reviewStatus === 'draft'))
  assert.deepEqual(previewPacks.map((pack) => pack.target.skillId), [
    'reaction-rates',
    'introduction-rate-law',
    'concentration-changes-time',
    'elementary-reactions',
    'collision-model',
    'reaction-energy-profile',
    'introduction-reaction-mechanisms',
    'reaction-mechanism-rate-law',
    'pre-equilibrium-approximation',
    'multistep-reaction-energy-profile',
    'catalysis',
  ])
  assert.equal(new Set(previewPacks.flatMap((pack) => pack.materials.map(({ id }) => id))).size, 11)
})

test('all nine Unit 6 packs remain draft-only and cover canonical thermochemistry skills', () => {
  const target = { scope: 'domain', examId: 'ap', subjectId: 'ap-chemistry', domainId: 'thermochemistry' }
  assert.deepEqual(getTutorContextPacksForTarget(target), [])
  const previewPacks = getTutorContextPacksForTarget(target, { includeDrafts: true })
  assert.equal(previewPacks.length, 9)
  assert.ok(previewPacks.every((pack) => pack.reviewStatus === 'draft'))
  assert.deepEqual(previewPacks.map((pack) => pack.target.skillId), [
    'endothermic-exothermic-processes',
    'energy-diagrams',
    'heat-transfer-thermal-equilibrium',
    'heat-capacity-calorimetry',
    'energy-phase-changes',
    'introduction-enthalpy-reaction',
    'bond-enthalpies',
    'enthalpy-formation',
    'hess-law',
  ])
  assert.equal(new Set(previewPacks.flatMap((pack) => pack.materials.map(({ id }) => id))).size, 9)
})

test('all eight Unit 9 packs remain draft-only and cover canonical thermodynamics-electrochemistry skills', () => {
  const target = { scope: 'domain', examId: 'ap', subjectId: 'ap-chemistry', domainId: 'thermodynamics-electrochemistry' }
  assert.deepEqual(getTutorContextPacksForTarget(target), [])
  const previewPacks = getTutorContextPacksForTarget(target, { includeDrafts: true })
  assert.equal(previewPacks.length, 8)
  assert.ok(previewPacks.every((pack) => pack.reviewStatus === 'draft'))
  assert.deepEqual(previewPacks.map((pack) => pack.target.skillId), [
    'introduction-entropy',
    'absolute-entropy-entropy-change',
    'gibbs-free-energy-thermodynamic-favorability',
    'thermodynamic-kinetic-control',
    'free-energy-equilibrium',
    'free-energy-dissolution',
    'coupled-reactions',
    'galvanic-electrolytic-cells',
  ])
  assert.equal(new Set(previewPacks.flatMap((pack) => pack.materials.map(({ id }) => id))).size, 8)
})

test('all eight Unit 1 packs remain draft-only and cover canonical atomic-structure skills', () => {
  const target = { scope: 'domain', examId: 'ap', subjectId: 'ap-chemistry', domainId: 'atomic-structure-properties' }
  assert.deepEqual(getTutorContextPacksForTarget(target), [])
  const previewPacks = getTutorContextPacksForTarget(target, { includeDrafts: true })
  assert.equal(previewPacks.length, 8)
  assert.ok(previewPacks.every((pack) => pack.reviewStatus === 'draft'))
  assert.deepEqual(previewPacks.map((pack) => pack.target.skillId), [
    'moles-molar-mass',
    'mass-spectra-elements',
    'elemental-composition-pure-substances',
    'composition-mixtures',
    'atomic-structure-electron-configuration',
    'photoelectron-spectroscopy',
    'periodic-trends',
    'valence-electrons-ionic-compounds',
  ])
  assert.equal(new Set(previewPacks.flatMap((pack) => pack.materials.map(({ id }) => id))).size, 8)
})

test('all seven Unit 2 packs remain draft-only and cover canonical compound-structure skills', () => {
  const target = { scope: 'domain', examId: 'ap', subjectId: 'ap-chemistry', domainId: 'compound-structure-properties' }
  assert.deepEqual(getTutorContextPacksForTarget(target), [])
  const previewPacks = getTutorContextPacksForTarget(target, { includeDrafts: true })
  assert.equal(previewPacks.length, 7)
  assert.ok(previewPacks.every((pack) => pack.reviewStatus === 'draft'))
  assert.deepEqual(previewPacks.map((pack) => pack.target.skillId), [
    'types-chemical-bonds',
    'intramolecular-force-potential-energy',
    'structure-ionic-solids',
    'structure-metals-alloys',
    'lewis-diagrams',
    'resonance-formal-charge',
    'vsepr-hybridization',
  ])
  assert.equal(new Set(previewPacks.flatMap((pack) => pack.materials.map(({ id }) => id))).size, 7)
})

test('canonical tutor targets support focused tutoring and general whole-test tutoring', () => {
  for (const target of [equationTarget, algebraTarget, satTarget, chemistryTarget, biologyTarget]) {
    assert.deepEqual(resolveTutorTarget(target), target)
    assert.equal(validateTutorRequest(request(target, 'Help me study.')).valid, true)
  }
  assert.equal(validateTutorRequest(request({ ...equationTarget, domainId: 'geometry-trigonometry' }, 'Help')).valid, false)
  assert.equal(validateTutorRequest(request({ scope: 'subject', examId: 'ap', subjectId: 'not-a-test' }, 'Help')).valid, false)
  assert.equal(validateTutorRequest(request(satTarget, '')).valid, false)
  assert.equal(validateTutorRequest(request(satTarget, 'x'.repeat(1201))).valid, false)
})

test('scope resolver keeps relevant skills and adjusts to another same-subject skill', () => {
  const same = resolveEffectiveTutorTarget(functionTarget, 'How do I find slope?', [])
  assert.equal(same.classification, 'same-scope')
  assert.equal(same.target.skillId, 'linear-functions')

  const adjusted = resolveEffectiveTutorTarget(functionTarget, 'How do I find the radius of this circle?', [])
  assert.equal(adjusted.classification, 'adjusted-within-subject')
  assert.equal(adjusted.target.domainId, 'geometry-trigonometry')
  assert.equal(adjusted.target.skillId, 'circles')
  assert.match(adjusted.scopeNotice, /Circles/)
})

test('scope resolver supports unit, whole-test, AP Chemistry, and conversational follow-ups', () => {
  const unit = resolveEffectiveTutorTarget(algebraTarget, 'Can you review algebra with me?', [])
  assert.equal(unit.target.scope, 'domain')
  assert.equal(unit.target.domainId, 'algebra')

  const broad = resolveEffectiveTutorTarget(equationTarget, 'Make me a study plan for the whole test.', [])
  assert.equal(broad.target.scope, 'subject')
  assert.equal(broad.classification, 'broadened')

  const chemistry = resolveEffectiveTutorTarget(chemistryTarget, 'Explain Le Chatelier and equilibrium.', [])
  assert.equal(chemistry.target.scope, 'domain')
  assert.equal(chemistry.target.domainId, 'equilibrium')

  const followUp = resolveEffectiveTutorTarget(functionTarget, 'Why did you do that?', [{ role: 'assistant', content: 'The slope is 3.' }])
  assert.deepEqual(followUp.target, functionTarget)
})

test('AP Chemistry routing separates properties, thermochemistry, and thermodynamics units', () => {
  const gas = resolveEffectiveTutorTarget(chemistryTarget, 'Help me use the ideal gas law.', [])
  assert.equal(gas.target.domainId, 'properties-substances-mixtures')
  assert.equal(gas.target.skillId, 'ideal-gas-law')

  const calorimetry = resolveEffectiveTutorTarget(chemistryTarget, 'How does heat capacity work in calorimetry?', [])
  assert.equal(calorimetry.target.domainId, 'thermochemistry')
  assert.equal(calorimetry.target.skillId, 'heat-capacity-calorimetry')

  const entropy = resolveEffectiveTutorTarget(chemistryTarget, 'Explain entropy and Gibbs free energy.', [])
  assert.equal(entropy.target.domainId, 'thermodynamics-electrochemistry')

  const titration = resolveEffectiveTutorTarget(chemistryTarget, 'How do I organize a titration calculation at equivalence?', [])
  assert.equal(titration.target.domainId, 'chemical-reactions')
  assert.equal(titration.target.skillId, 'introduction-titration')
})

test('preparation uses matching local material when available and never gates broader questions', () => {
  const grounded = prepareTutorRequest(request(functionTarget, 'Find the slope of f(x) = 3x - 4.'))
  assert.deepEqual(grounded.materials.map((item) => item.id), ['linear-functions-original-1'])

  const circles = prepareTutorRequest(request(functionTarget, 'Explain a circle equation.'))
  assert.equal(circles.resolution.target.skillId, 'circles')
  assert.deepEqual(circles.materials, [])

  const broad = prepareTutorRequest(request(satTarget, 'How should I pace the entire SAT Math test?'))
  assert.equal(broad.scopeDetails.subject.label, 'SAT Math')
  assert.ok(Array.isArray(broad.materials))

  const general = prepareTutorRequest(request(biologyTarget, 'Help me review genetics.'))
  assert.equal(general.scopeDetails.subject.general, true)
  assert.deepEqual(general.materials, [])

  const chemistry = prepareTutorRequest(request(chemistryTarget, 'How do I compare Q and K?'))
  assert.deepEqual(chemistry.materials, [])

  const chemistryPreview = prepareTutorRequest(
    request(chemistryTarget, 'How do I compare Q and K?'),
    { includeDraftMaterials: true },
  )
  assert.deepEqual(chemistryPreview.materials.map((item) => item.id), ['ap-chem-equilibrium-q-k-original-1'])

  const acidsBasesPreview = prepareTutorRequest(
    request(chemistryTarget, 'Why does acid make a carbonate solid more soluble?'),
    { includeDraftMaterials: true },
  )
  assert.equal(acidsBasesPreview.resolution.target.domainId, 'acids-bases')
  assert.deepEqual(acidsBasesPreview.materials.map((item) => item.id), ['ap-chem-acids-bases-ph-solubility-original-1'])

  const unitThreePreview = prepareTutorRequest(
    request(chemistryTarget, 'How do I use a Beer-Lambert calibration line?'),
    { includeDraftMaterials: true },
  )
  assert.equal(unitThreePreview.resolution.target.domainId, 'properties-substances-mixtures')
  assert.equal(unitThreePreview.resolution.target.skillId, 'beer-lambert-law')
  assert.deepEqual(unitThreePreview.materials.map((item) => item.id), ['ap-chem-properties-mixtures-beer-lambert-original-1'])

  const unitFourPreview = prepareTutorRequest(
    request(chemistryTarget, 'How do I organize a titration calculation at equivalence?'),
    { includeDraftMaterials: true },
  )
  assert.equal(unitFourPreview.resolution.target.domainId, 'chemical-reactions')
  assert.equal(unitFourPreview.resolution.target.skillId, 'introduction-titration')
  assert.deepEqual(unitFourPreview.materials.map((item) => item.id), ['ap-chem-chemical-reactions-titration-original-1'])

  const unitFivePreview = prepareTutorRequest(
    request(chemistryTarget, 'How do I determine a rate law from initial rates?'),
    { includeDraftMaterials: true },
  )
  assert.equal(unitFivePreview.resolution.target.domainId, 'kinetics')
  assert.equal(unitFivePreview.resolution.target.skillId, 'introduction-rate-law')
  assert.deepEqual(unitFivePreview.materials.map((item) => item.id), ['ap-chem-kinetics-rate-law-original-1'])
})

test('prompt requires adaptive, pedagogical answers instead of context refusals', () => {
  const prepared = prepareTutorRequest(request(functionTarget, 'Find the slope of f(x) = 3x - 4.'))
  const prompt = buildTutorPrompt({ message: 'Find the slope.', history: [], ...prepared })
  assert.match(prompt, /expert, patient tutor/i)
  assert.match(prompt, /outside the selected skill, unit, or test/i)
  assert.match(prompt, /lead with a useful hint/i)
  assert.match(prompt, /worked example/i)
  assert.match(prompt, /study plan/i)
  assert.match(prompt, /linear-functions-original-1/)
  assert.match(prompt, /\\frac\{a\}\{b\}/)
})

test('general tutor prompt uses test context without claiming detailed official alignment', () => {
  const prepared = prepareTutorRequest(request(biologyTarget, 'Help me study cells.'))
  const prompt = buildTutorPrompt({ message: 'Help me study cells.', history: [], ...prepared })
  assert.match(prompt, /AP Biology/)
  assert.match(prompt, /General test-aware tutoring/)
  assert.match(prompt, /do not claim complete test coverage/i)
})

test('output sanitizer filters invented sources but preserves useful ungrounded answers', () => {
  const prepared = prepareTutorRequest(request(functionTarget, 'Explain a circle equation.'))
  const output = sanitizeTutorOutput({
    answer: 'A circle uses radius and center.',
    sourceIds: ['invented-source'],
    insufficient: false,
    scopeNotice: '',
    classification: 'same-scope',
  }, prepared.materials, prepared.resolution)
  assert.equal(output.insufficient, false)
  assert.deepEqual(output.sourceIds, [])
  assert.equal(output.effectiveTarget.skillId, 'circles')
  assert.equal(output.classification, 'adjusted-within-subject')
  assert.deepEqual(output.sources, [])

  const outside = sanitizeTutorOutput({
    answer: 'Photosynthesis converts light energy.', sourceIds: [], insufficient: false,
    scopeNotice: 'This is outside SAT Math.', classification: 'outside-subject',
  }, [], { target: satTarget, classification: 'same-scope', scopeNotice: '' })
  assert.equal(outside.classification, 'outside-subject')
  assert.equal(outside.scopeNotice, '')
  assert.match(outside.answer, /outside SAT Math/)
})

test('multimodal tutor prompts append a private image reference without changing text prompts', () => {
  const textPrompt = 'Teach me equilibrium.'
  assert.equal(buildTutorPromptParts(textPrompt), textPrompt)
  assert.deepEqual(buildTutorPromptParts(textPrompt, {
    url: 'gs://private-bucket/tutor-uploads/student-1/photo.jpg',
    contentType: 'image/jpeg',
  }), [
    { text: textPrompt },
    { media: { url: 'gs://private-bucket/tutor-uploads/student-1/photo.jpg', contentType: 'image/jpeg' } },
  ])
})
