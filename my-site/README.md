# Firebase deployment for this site

This project is now set up to use Firebase as its primary hosting path, with a small Firebase Functions backend for the live visitor tracker.

## Adaptive AI tutor

Every catalog test has a whole-test tutor. SAT Math and AP Chemistry add specialized test-aware behavior, while other tests use their catalog title and summary for broad explanations, walkthroughs, and study planning. SAT Math unit and skill links generate a focused opening question and submit it automatically.

The tutor adjusts its internal focus automatically as the student moves between units and skills. Students never manage scope or see grounding metadata. Questions outside the selected test still receive a helpful answer with a brief test-boundary note.

The browser defaults to safe local mock mode. No tutor, tracker, or homework-image request leaves the browser. Firebase Authentication remains available so its UI can be tested after the provider and local domain are configured:

```bash
copy .env.example .env.local
npm run dev
```

Open any test and choose **Ask the [test] Tutor** for whole-test tutoring. SAT Math also exposes secondary **Teach me this unit** and **Teach me this skill** actions.

### Configure Vertex AI Gemini and deploy

The tutor uses Vertex AI with the Cloud Function's service account. No Gemini API key or browser credential is used.

1. Upgrade the Firebase project to Blaze and enable the Vertex AI API.
2. Grant `roles/aiplatform.user` to the default compute service account (`PROJECT_NUMBER-compute@developer.gserviceaccount.com`).
3. Install and deploy the backend:

   ```bash
   npm ci --prefix functions
   npm run deploy:storage
   npm run deploy:backend
   ```

4. Set `VITE_CHAT_MODE=firebase` in `.env.production`, then build and deploy Hosting:

   ```bash
   npm run deploy:hosting
   ```

The exported `satMathTutor` callable remains in `us-central1` for SAT deployment compatibility. AP Chemistry uses the new `studyTutor` callable, which accepts the same canonical target, message, and history fields plus an optional private Storage attachment path. The backend retains effective-target and classification fields for compatibility; AP Chemistry answers can additionally show the labels of approved original study materials that support the answer.

### AP Chemistry homework-photo analysis

AP Chemistry text tutoring remains available to guests. Homework-photo analysis requires Google sign-in and accepts one JPEG, PNG, or WebP image up to 5 MB. The browser uploads it privately to `tutor-uploads/{uid}/{random-id}`; `studyTutor` validates ownership and metadata, passes the temporary `gs://` reference to Gemini, then deletes the file whether generation succeeds or fails.

Successful photo analyses are limited to 10 per signed-in user per UTC day. Firestore retains only the daily counter and short-lived request reservations, never the image or chat text. The Storage rules deny browser reads, cross-user access, and all paths other than valid private tutor-image uploads.

### Add another tutor course or grounding pack

Tutor targets are allow-listed independently in `functions/tutorScopeCatalog.js` and `site/chat/tutorScopes.js`. General tests need matching canonical test metadata in both catalogs. Specialized tests can additionally define unit and skill metadata, followed by scope-resolution and URL tests.

Optional server-only grounding packs live under `functions/tutorContextPacks/` and are registered in `functions/tutorRegistry.js`. They must use original material and globally unique source IDs. Adding a pack enriches answers but does not change tutor availability or require editing the callable flow.

## Canonical question catalog

SAT Math questions live in `site/questions/catalog/satMathQuestions.js`. Each record explicitly defines its stable ID, canonical taxonomy target, renderer, answer data, explanation, provenance, publication status, schema version, revision, and optional tags. SAT classification is never inferred from a filename, display label, or question ID.

A canonical record has this shape:

```js
{
  id: 'stable-kebab-case-id',
  taxonomy: {
    version: 1,
    examId: 'sat',
    subjectId: 'sat-math',
    domainId: 'algebra',
    skillId: 'linear-equations-one-variable',
    questionTypeId: 'multiple-choice',
    answeringMethodId: 'select-option',
  },
  renderer: 'multiple-choice',
  prompt: 'Original question prompt',
  answer: {
    kind: 'selected-response',
    options: [
      { id: 'a', text: 'Correct answer' },
      { id: 'b', text: 'Distractor' },
    ],
    correctOptionId: 'a',
  },
  explanation: 'Original explanation',
  source: {
    kind: 'editorial',
    name: 'Study Website',
    externalId: null,
    license: null,
  },
  content: { status: 'published', version: 1, revision: 1 },
  tags: ['example-tag'],
}
```

### Provenance rules

- `official` is reserved for permitted official material and requires an external source ID.
- `editorial` identifies original, human-authored material.
- `ai-generated` identifies AI-generated material and must remain distinguishable from official or editorial content.
- `third-party` requires explicit license metadata. Do not add copied commercial questions without verified permission.
- External source IDs must be unique within their source kind and source name.

### Add and validate a question

1. Add the complete canonical record to the appropriate catalog module. Do not add a separate classification lookup.
2. Use taxonomy IDs from `site/taxonomy/contentTaxonomy.js` and choose the matching question type, answering method, renderer, and answer shape.
3. Record truthful provenance and increment the revision when changing published content.
4. Run `npm run catalog:validate` and `npm test`.

Catalog validation rejects duplicate or unstable IDs, invalid taxonomy references, mismatched renderers and answer methods, malformed answer data, missing explanations, incomplete provenance, duplicate external IDs, and invalid content metadata or tags. Validation runs automatically before both `npm test` and `npm run build`, so invalid content blocks deployment builds.

Run `npm run catalog:coverage` for deterministic counts by exam, subject, domain, skill, question type, source kind, learning objective, science practice, response format, difficulty, and review status. It also lists skills with no questions and skills below the default minimum of five. Use `npm run catalog:coverage -- --minimum=10` to choose another positive threshold.

AP Chemistry now uses the shared canonical taxonomy for its nine current units and 88 CED topics. Its four prototype questions remain isolated behind `site/questions/legacy/apChemistryAdapter.js` until they can be reviewed and replaced; they are not part of the canonical question catalog.

## AP Chemistry framework and sources

The AP Chemistry foundation is versioned as `ap-chemistry-fall-2024`. `site/taxonomy/apChemistryFramework.js` contains the nine-unit framework, topic and learning-objective identifiers, original summaries, weightings, and six science-practice categories. `site/taxonomy/apChemistrySources.js` records the authoritative public sources, usage boundaries, access dates, and annual review dates.

College Board documents are link-only or metadata-only unless a source record explicitly documents redistribution permission. Do not copy secure AP Classroom questions or reproduce released questions, scoring language, diagrams, student responses, or the official reference booklet by default.

Before each school year:

1. Check the AP course and exam change log and confirm the active CED.
2. Review the current exam page, reference information, and released-FRQ archive.
3. Update access dates, annual review dates, versions, and notes in the source registry.
4. If the framework changed, add a new framework version and migrate content deliberately instead of silently changing existing identifiers.
5. Run `npm run test:site`, `npm run test:functions`, `npm run catalog:validate`, and `npm run catalog:coverage`.

Legacy unit URLs are resolved centrally. `atomic-structure`, `bonding`, `reactions`, and `applications` map to their current unit IDs. The ambiguous legacy `thermodynamics` unit broadens to the AP Chemistry course instead of selecting Unit 6 or Unit 9 incorrectly.

### Unit 7 editorial preview

The Unit 7 pilot bank contains five original lessons, six formula/reference entries, 35 discrete MCQs, five original stimulus sets with 16 linked MCQs, eight short FRQs, three long FRQs, point-level rubrics, and a misconception catalog. All local Phase 2 draft volume and topic-coverage targets are now met. All 62 scored items are truthfully `draft`, AI-assisted, and unreviewed; quantity completion is not educator approval or launch readiness. Public practice still exposes only published canonical records plus the isolated legacy adapter.

Set `VITE_EDITORIAL_PREVIEW=true` only in a Vite development environment to exercise the lesson, formula, stimulus, MCQ, and FRQ renderers. Draft lesson and formula URLs fail with a clear review-pending page when preview is not enabled. Production builds ignore this flag.

The preview also exposes three validated, locked draft assessment blueprints: an untimed six-question diagnostic, a disjoint 15-minute six-question reassessment over the same six skill areas, and a 45-minute checkpoint containing 20 selected-response questions plus the short and long FRQs. Testing-mode feedback is withheld until submission. The selected responses are scored automatically; both FRQs remain point-by-point student self-review. These product-defined previews are neither official AP sections nor AP-score predictions, and their timing has not been pilot-calibrated.

The fixed checkpoint is versioned and deliberately remains a stable 22-item form while the larger practice bank grows. The original line graph has a responsive visual rendering, a written description, and an expandable exact-data table; the four table-based sets cover quotient comparison, opposing rates, solubility trials, and reaction-constant transformations. The bank now reaches the 35-discrete-MCQ, five-stimulus-set, eight-short-FRQ, and three-long-FRQ targets. Every question, distractor, rubric, and numerical result remains subject to chemistry-educator review.

Every Unit 7 FRQ also has beginning, developing, and strong original sample responses mapped to its draft rubric. They load only after an FRQ is submitted and the self-review is opened; each is labeled unreviewed and non-official. Draft questions, resources, exemplars, learning summaries, Firestore, and Storage are route-split so they do not inflate the initial home-page bundle.

Diagnostic results feed topic-specific lesson/practice recommendations and error-pattern remediation. The signed-in Unit 7 progress page uses canonical topic IDs and private mastery snapshots, distinguishes early data from stronger evidence, and recommends the next lesson/practice target without predicting an AP score. Self-review totals only the draft rubric points the student selects and is explicitly labeled as neither automated scoring nor an official AP score. Manually reviewed FRQs are excluded from automatic percentages and mastery records instead of being falsely counted as incorrect. The Unit 7 formula center supports search, concept and exam-availability filtering, print-friendly output, direct external links to the official periodic table and equations/constants pages, and topic-level practice links. Every Unit 7 question declares the formula entries or named prior knowledge it expects. Bundle validation rejects missing formula links and prevents a published question from depending on a draft formula. Availability labels were visually checked against the official 2026 reference information and describe whether the relationship is provided, partly provided, or not separately provided; the companion does not reproduce the official sheet.

When both editorial preview and the Firestore emulator are enabled, the progress page derives a separate-form reassessment readiness state from the latest emulator-only practice timestamp. It waits at least 48 hours before enabling the link and explicitly labels the result as one retention check, not proof of mastery. This is a deterministic local preview, not a notification service: it does not send reminders, schedule calendar events, or write draft timing data to live Firestore.

Draft and in-review question sessions never write to live account history. Preview persistence is enabled only when `VITE_USE_FIRESTORE_EMULATOR=true` (or the unified emulator flag is set), so editorial testing cannot contaminate production mastery records.

Functions include a deterministic tutor-evaluation fixture set for chemistry correctness, pedagogy, hallucination, scope, source citation, image privacy, answer leakage, formula use, and prompt injection. Unit 8 adds explicit buffer-capacity reasoning and draft-source citation cases. These fixtures are regression gates; they do not substitute for running blinded evaluations against the deployed model or for chemistry-educator review.

The AP Chemistry tutor context layer contains one original draft teaching card for each of the 12 Unit 7 topics. All 12 packs are excluded from production grounding. A local Functions emulator can opt in by setting `TUTOR_EDITORIAL_PREVIEW=true`; the registry additionally requires the emulator environment and never treats the flag as approval.

The development-only route `/editorial.html?test=ap-chemistry&unit=equilibrium` exposes a read-only review queue when `VITE_EDITORIAL_PREVIEW=true`. It derives its totals directly from the canonical Unit 7 question, resource, and FRQ-exemplar catalogs, supports search and format filters, and displays all eight mandatory review gates as pending for every draft. It cannot approve, publish, or persist review decisions. Similarity warnings compare first-party drafts only; they are not a comparison against released exams or supplied source PDFs.

Reviewers can generate separate local decision templates with `npm run catalog:review-template -- --unit=equilibrium --reviewer=reviewer-id --output=review-packets/reviewer-id.json`, complete all eight gates, and validate one or two packets with `npm run catalog:review-validate -- --unit=equilibrium packet.json [second-packet.json]`. Packet schema version 2 includes questions, supporting resources, and each FRQ's three-level exemplar set as separately revisioned, hash-bound records. The unit argument selects a canonical single-unit content bundle and will support later units without a second workflow. Packet output is restricted to new `.json` files in the ignored `review-packets/` directory, preventing accidental overwrite and shell-redirection corruption. Packets reject author self-approval and stale records and require two distinct approving reviewers before reporting an item eligible for transition. Validation is intentionally non-mutating: it does not update source status or publish anything. Reviewer notes and identifiers may be private.

Released-exam analysis has a separate local intake boundary. `npm run catalog:metadata-template -- --year=2026 --question=FRQ-1 --recorded-by=metadata-reviewer --output=metadata-intake/file.json` creates an incomplete template, and `npm run catalog:metadata-validate -- metadata-intake/file.json` accepts only the exact factual metadata schema. Unknown fields, prose-like category values, and protected prompt/rubric/answer/diagram fields are rejected. The ignored intake file is never imported or published automatically.

The released-exam metadata boundary, content briefs, review checklist, audit trail, and internal-draft similarity workflow are documented in [the AP Chemistry editorial pipeline](docs/AP_CHEMISTRY_EDITORIAL_PIPELINE.md). Raw supplied PDFs and protected extracts do not belong in this repository or permanent tutor context.

### Unit 8 Acids and Bases starter expansion

The first post-pilot unit now has six original formula companions, five original lessons spanning all 11 canonical Unit 8 topics, 16 misconception records, all 35 planned discrete MCQs, five original four-question stimulus sets covering titration, buffer capacity, weak-acid dilution, structure-strength trends, and indicator equilibrium, all eight planned short FRQs, and all three planned long FRQs with point-level rubrics. Every FRQ has beginning, developing, and strong original sample responses tied to increasing amounts of rubric evidence; they load lazily only inside post-submission self-review. Draft exemplar lookup is independently editorial-preview gated, so later publication of a linked question cannot expose an unapproved sample. The questions span proton transfer, strong neutralization, weak acid and base equilibrium, buffer capacity, structural acidity, titration data, indicator choice, and pH-coupled solubility. Direct tests enumerate every answer key and independently reproduce the numerical results. Every item and sample response is still AI-assisted, `draft`, unreviewed, non-official, and excluded from public practice.

The resource pages, formula filters, editorial dashboard, reviewer packets, and readiness command are unit-aware. Run `npm run catalog:readiness -- --unit=acids-bases` for the current Unit 8 deficits. All local question-format, topic-coverage, and FRQ-exemplar coverage targets are now met. The tutor registry also contains one independently written draft teaching card for each of the 11 Unit 8 topics. Production retrieval excludes every card; only a Functions emulator with `TUTOR_EDITORIAL_PREVIEW=true` may use them. The unit is not launch-ready: approved production grounding, two-reviewer approval of all 104 question/resource/exemplar records, formula-specific review, accessibility verification, timing calibration, and pilot evidence are still required.

Unit 8 also uses the shared AP Chemistry assessment registry and learning-loop engine. Its editorial preview contains a locked untimed six-question diagnostic, a disjoint 15-minute reassessment over the same six canonical topics, and a 45-minute checkpoint with 20 automatically scored selected responses plus two rubric-self-reviewed FRQs spanning all 11 topics. Results produce canonical lesson/practice links and misconception-specific next steps. The same emulator-only 48-hour reassessment rule used by Unit 7 applies without writing draft results to live progress. These forms are original, fixed draft products—not official AP sections, validated mastery measures, or AP-score predictions—and still require chemistry review and timing calibration.

### Unit 3 Properties of Substances and Mixtures starter slice

The next rollout unit now has six original formula companions, five substantial lessons covering all 13 canonical Unit 3 topics, and 13 misconception records. Its scored set contains all 35 planned discrete MCQs; five original four-question stimulus sets covering Beer-Lambert calibration, rigid-vessel gas behavior, sand-salt separation, an absorption scan, and molecular-liquid properties; all eight planned four-point short FRQs; and all three planned seven-point long FRQs. The short FRQs span collected gases, intermolecular properties, solid types, gas mixtures, nonideal gases, solution preparation, chromatography, and spectrophotometry. The long FRQs integrate spectrophotometric analysis, a volatile-liquid gas experiment, and separation-plus-composition analysis. Every Unit 3 topic has scored coverage. All 11 FRQs have point-level rubrics plus beginning, developing, and strong original sample responses. Formula availability was visually reverified against the linked 2026 exam reference information on 2026-07-24; the repository records availability metadata and independently written explanations, not a reproduction of the official sheet.

Direct tests enumerate all 55 selected-response keys and independently reproduce the stimulus, formula, lesson, and FRQ calculations. The shared resource catalog, routes, formula center, editorial dashboard, coverage report, readiness report, schema-v2 reviewer packet CLI, and tutor registry all recognize Unit 3 without a unit-specific UI list. The tutor has one independently written draft teaching card for each of the 13 topics; production retrieval excludes all of them, and only a Functions emulator with `TUTOR_EDITORIAL_PREVIEW=true` can opt into them. Evaluation fixtures specifically check Beer-Lambert calibration-plus-dilution reasoning and reject invented Unit 3 citations.

Unit 3 now also uses the shared AP Chemistry assessment and learning-loop engine. Its editorial preview contains a locked untimed six-question diagnostic, a disjoint 15-minute reassessment over the same six canonical topics, and a 45-minute checkpoint with 20 automatically scored selected responses plus two rubric-self-reviewed FRQs spanning all 13 topics. Results create canonical lesson/practice links and Unit 3 misconception corrections. The emulator-only 48-hour reassessment rule applies without writing draft results to live progress. These fixed forms are original, draft, unreviewed, not pilot-calibrated, and neither official AP sections nor AP-score predictions.

All 66 questions, 27 supporting resources, 11 FRQ exemplar sets, 13 misconceptions, 13 tutor cards, and three assessment blueprints remain AI-assisted, `draft`, unreviewed, non-official, and unavailable in public study mode. Every local content-volume, topic-coverage, fixed-assessment, and learning-loop integration gate now passes: 35/35 discrete MCQs, 5/5 stimulus sets, 8/8 short FRQs, 3/3 long FRQs, 13/13 question topics, 13/13 lesson topics, 66/66 question references, and 11/11 FRQ-exemplar coverage. Automated accessibility contracts and rendered browser checks now cover question-change focus, non-chattering timers, truthful FRQ instructions, semantic formula tables, narrow-screen overflow, visible study-control focus, reduced-motion behavior, and normal-text contrast for primary question actions and score labels; manual keyboard, screen-reader, zoom, full-page contrast, and assistive-technology evaluation still remains. The readiness report separately requires privacy-safe aggregate pilot evidence and two-reviewer timing-calibration approval for all three fixed forms. The [pilot evidence workflow](docs/AP_CHEMISTRY_PILOT_EVIDENCE.md) forbids student-level identifiers and raw responses and deliberately does not invent an automatic sample-size or timing threshold. The unit is not launch-ready: all 104 question/resource/exemplar records still require two independent reviewers, all six formula entries require formula-specific review, and manual accessibility evaluation, timing calibration, pilot evidence, and production approval remain.

### Unit 4 Chemical Reactions thin starter slice

Unit 4 now has an original, deliberately small vertical skeleton covering all nine canonical topics: three formula companions, two substantial lessons, nine misconception records, 18 discrete MCQs, a four-question titration stimulus set, a four-question carbonate gas-evolution stimulus set, one short precipitation FRQ, one long metal-displacement FRQ, point-level rubrics, and three-level response exemplars for both FRQs. Nine draft tutor cards cover the same topics. The shared catalogs, resource routes, formula center, editorial queue, reviewer-packet CLI, coverage report, launch-readiness report, and tutor registry discover the bundle through canonical taxonomy data; no Unit 4 browser-side list was added.

Unit 4 also uses the shared assessment and learning-loop engine. Its editorial preview contains a locked untimed six-question diagnostic, a disjoint 15-minute reassessment over the same six skill areas, and a 40-minute checkpoint with 16 automatically scored selected responses plus two rubric-self-reviewed FRQs spanning all nine topics. Results create canonical lesson/practice links and Unit 4 misconception corrections. These fixed forms are original, draft, unreviewed, not pilot-calibrated, and neither official AP sections nor AP-score predictions.

Direct tests enumerate all 26 selected-response keys and independently reproduce the titration, carbonate gas-evolution, combustion, diprotic-acid, precipitation, limiting-reactant, solution-composition, redox, and error-propagation calculations. Tutor routing uses word-aware keyword boundaries, preventing “equivalence” from being misrouted to “valence electrons,” and an evaluation fixture checks that equivalence is treated as a mole-ratio condition rather than an equal-volume rule. All 28 questions, nine resources, two exemplar sets, nine misconceptions, nine tutor cards, and three assessment blueprints remain AI-assisted, `draft`, unreviewed, non-official, unavailable in public practice, and excluded from production tutor grounding. Run `npm run catalog:readiness -- --unit=chemical-reactions` to see the truthful remaining deficits: 17 more discrete MCQs, three more stimulus sets, seven more short FRQs, two more long FRQs, human review, accessibility work, timing calibration, pilot evidence, and production approval.

### Unit 5 Kinetics thin starter slice

Unit 5 now has an original thin vertical skeleton spanning all 11 canonical topics: three formula companions, two substantial lessons, 11 misconception records, 20 discrete MCQs, one four-question initial-rates stimulus set, one four-question concentration-time stimulus set, one short first-order FRQ, one long mechanism-and-energy-profile FRQ, point-level rubrics, and three-level response exemplars for both FRQs. Eleven draft tutor cards cover the same topics. The shared catalogs, resource routes, formula center, editorial queue, reviewer-packet CLI, coverage report, launch-readiness report, and tutor registry discover the bundle through canonical taxonomy data; no Unit 5 browser-side list was added.

Unit 5 also uses the shared assessment and learning-loop engine. Its editorial preview contains a locked untimed six-question diagnostic, a disjoint 15-minute reassessment over the same six skill areas, and a 45-minute checkpoint with 18 automatically scored selected responses plus two rubric-self-reviewed FRQs spanning all 11 topics. Results create canonical lesson/practice links and Unit 5 misconception corrections. These fixed forms are original, draft, unreviewed, not pilot-calibrated, and neither official AP sections nor AP-score predictions.

Direct tests enumerate all 28 selected-response keys and independently reproduce the initial-rate, normalized-rate, rate-constant-unit, first-order, half-life, concentration-time, instantaneous-rate, stoichiometric-rate, fast-equilibrium, and activation-energy calculations. Tutor evaluation fixtures require correct rate-law reasoning and reject unapproved citations. All 30 questions, nine resources, two exemplar sets, 11 misconceptions, 11 tutor cards, and three assessment blueprints remain AI-assisted, `draft`, unreviewed, non-official, unavailable in public practice, and excluded from production tutor grounding. Run `npm run catalog:readiness -- --unit=kinetics` to see the truthful remaining deficits: 15 more discrete MCQs, three more stimulus sets, seven more short FRQs, two more long FRQs, human review, accessibility work, timing calibration, pilot evidence, and production approval.

### Unit 6 Thermochemistry thin starter slice

Unit 6 now has an original thin vertical skeleton covering all nine canonical topics: three formula companions, two substantial lessons, nine misconception records, 18 discrete MCQs, a four-question calibrated-calorimetry stimulus set, a four-question heating-curve stimulus set, one short calorimetry FRQ, one long formation-enthalpy/Hess-law FRQ, point-level rubrics, and three-level response exemplars for both FRQs. Nine draft tutor cards cover the same topics. Shared catalogs, formula and lesson routes, editorial review queues, reviewer packets, coverage reports, readiness reports, and tutor routing discover the bundle from canonical taxonomy data.

Unit 6 also uses the shared assessment and learning-loop engine. Its editorial preview contains a locked untimed six-question diagnostic, a disjoint 15-minute reassessment over the same six skill areas, and a 40-minute checkpoint with 16 automatically scored selected responses plus two rubric-self-reviewed FRQs spanning all nine topics. Results create canonical lesson/practice links and Unit 6 misconception corrections. These fixed forms are original, draft, unreviewed, not pilot-calibrated, and neither official AP sections nor AP-score predictions.

Direct tests enumerate all 26 selected-response keys and independently reproduce the heat-capacity, heating-curve, phase-change, thermal-equilibrium, calorimeter-sign, molar-enthalpy, energy-diagram, bond-enthalpy, formation-enthalpy, Hess-law, and reaction-scaling calculations. Tutor evaluation fixtures specifically reject same-sign reaction/calorimeter reasoning and invented citations. All 28 questions, nine resources, two exemplar sets, nine misconceptions, nine tutor cards, and three assessment blueprints remain AI-assisted, `draft`, unreviewed, non-official, unavailable in public practice, and excluded from production tutor grounding. Run `npm run catalog:readiness -- --unit=thermochemistry` to see the truthful remaining deficits: 17 more discrete MCQs, three more stimulus sets, seven more short FRQs, two more long FRQs, human review, accessibility work, timing calibration, pilot evidence, and production approval.

### Unit 9 Thermodynamics and Electrochemistry thin starter slice

Unit 9 now has an original thin vertical skeleton covering all eight canonical topics: three formula companions, two substantial lessons, eight misconception records, 20 discrete MCQs, one four-question galvanic-cell stimulus set, one four-question temperature/favorability stimulus set, one short electrochemical-cell FRQ, one long entropy/free-energy/coupling FRQ, point-level rubrics, and three-level response exemplars for both FRQs. Eight draft tutor cards cover the same topics. Shared catalogs, formula and lesson routes, editorial review queues, reviewer packets, coverage reports, readiness reports, and tutor routing discover the bundle from canonical taxonomy data.

Unit 9 also uses the shared assessment and learning-loop engine. Its editorial preview contains a locked untimed six-question diagnostic, a disjoint 15-minute reassessment over the same six skill areas, and a 45-minute checkpoint with 18 automatically scored selected responses plus two rubric-self-reviewed FRQs spanning all eight topics. Results create canonical lesson/practice links and Unit 9 misconception corrections. These fixed forms are original, draft, unreviewed, not pilot-calibrated, and neither official AP sections nor AP-score predictions.

Direct tests enumerate all 28 selected-response keys and independently reproduce reaction-entropy, Gibbs-energy, threshold-temperature, equilibrium-constant, coupled-reaction, cell-potential, electrochemical free-energy, current, and electron-stoichiometry calculations. Tutor evaluation fixtures require energy-unit conversion, reject rate claims based only on favorability, and reject invented citations. All 30 questions, nine resources, two exemplar sets, eight misconceptions, eight tutor cards, and three assessment blueprints remain AI-assisted, `draft`, unreviewed, non-official, unavailable in public practice, and excluded from production tutor grounding. Run `npm run catalog:readiness -- --unit=thermodynamics-electrochemistry` to see the truthful remaining deficits: 15 more discrete MCQs, three more stimulus sets, seven more short FRQs, two more long FRQs, human review, accessibility work, timing calibration, pilot evidence, and production approval.

### Unit 1 Atomic Structure and Properties thin starter slice

Unit 1 now has an original thin vertical skeleton covering all eight canonical topics: four formula/reference companions, two substantial lessons, eight misconception records, 20 discrete MCQs, a four-question isotope-spectrum stimulus set, a four-question PES stimulus set, one short empirical-composition FRQ, one long isotope/electron-structure evidence FRQ, point-level rubrics, and three-level response exemplars for both FRQs. Eight draft tutor cards cover the same topics. Shared catalogs, resource routes, formula filters, editorial review queues, reviewer packets, coverage reports, readiness reports, and tutor routing discover the bundle from canonical taxonomy data.

Unit 1 also uses the shared assessment and learning-loop engine. Its editorial preview contains a locked untimed six-question diagnostic, a disjoint 15-minute reassessment over the same six skill areas, and a 45-minute checkpoint with 18 automatically scored selected responses plus two rubric-self-reviewed FRQs spanning all eight topics. Results create canonical lesson/practice links and Unit 1 misconception corrections. These fixed forms are original, draft, unreviewed, not pilot-calibrated, and neither official AP sections nor AP-score predictions.

Direct tests enumerate all 28 selected-response keys and independently reproduce mole-particle, weighted-isotope, mixture-composition, empirical-formula, mass-percent, PES electron-count, and ionic-charge calculations. Tutor evaluation fixtures require correct peak-position/intensity distinctions and weighted averaging while rejecting invented citations. All 30 questions, ten resources, two exemplar sets, eight misconceptions, eight tutor cards, and three assessment blueprints remain AI-assisted, `draft`, unreviewed, non-official, unavailable in public practice, and excluded from production tutor grounding. Run `npm run catalog:readiness -- --unit=atomic-structure-properties` to see the truthful remaining deficits: 15 more discrete MCQs, three more stimulus sets, seven more short FRQs, two more long FRQs, human review, accessibility work, timing calibration, pilot evidence, and production approval.

### Unit 2 Compound Structure and Properties thin starter slice

Unit 2 now has an original thin vertical skeleton covering all seven canonical topics: three formula/reference companions, two substantial lessons, seven misconception records, 20 discrete MCQs, a four-question carbonate-structure stimulus set, a four-question bond-potential stimulus set, one short potential-energy-curve FRQ, one long Lewis-structure/resonance/VSEPR FRQ, point-level rubrics, and three-level response exemplars for both FRQs. Seven draft tutor cards cover the same topics. Shared catalogs, resource routes, formula filters, editorial review queues, reviewer packets, coverage reports, readiness reports, and tutor routing discover the bundle from canonical taxonomy data.

Unit 2 also uses the shared assessment and learning-loop engine. Its editorial preview contains a locked untimed seven-question diagnostic, a disjoint 18-minute reassessment over the same seven canonical topics, and a 40-minute checkpoint with 18 automatically scored selected responses plus two rubric-self-reviewed FRQs. Results create canonical lesson/practice links and Unit 2 misconception corrections. These fixed forms are original, draft, unreviewed, not pilot-calibrated, and neither official AP sections nor AP-score predictions.

Direct tests enumerate all 28 selected-response keys and independently verify formal-charge, average-bond-order, Coulombic-potential, electron-count, lattice-charge, bond-potential, and molecular-geometry reasoning. Tutor evaluation fixtures require resonance-hybrid reasoning and reject invented citations. All 30 questions, nine resources, two exemplar sets, seven misconceptions, seven tutor cards, and three assessment blueprints remain AI-assisted, `draft`, unreviewed, non-official, unavailable in public practice, and excluded from production tutor grounding. Run `npm run catalog:readiness -- --unit=compound-structure-properties` to see the truthful remaining deficits: 15 more discrete MCQs, three more stimulus sets, seven more short FRQs, two more long FRQs, human review, accessibility work, timing calibration, pilot evidence, and production approval.

## Skill catalog search

The SAT Math topic browser indexes every skill from the shared taxonomy through `site/catalog/skillSearch.js`. Search never duplicates taxonomy records and does not create per-skill pages.

Skill aliases and tags are declarative entries in `skillSearchMetadata` inside `site/taxonomy/contentTaxonomy.js`. Add normalized, student-friendly alternatives there when introducing or renaming a skill; UI components should not contain search-specific skill checks.

Results are ranked deterministically in this order:

1. Exact skill label.
2. Exact alias.
3. Skill-label prefix.
4. Other skill-label match.
5. Alias, tag, canonical ID, exam, subject, or domain match.
6. Domain or skill description match.

Search ignores case, repeated whitespace, accents, and common punctuation. All results retain canonical exam, subject, domain, and skill IDs and use the shared URL helpers.

Practice availability is derived from published canonical questions through `getPublishedQuestionCount`; tutor availability comes from declarative tutor capability metadata. Skills with no published questions show a non-interactive “Practice unavailable” status rather than opening an empty practice setup.

The `q` parameter stores search state, for example `/topics.html?topic=sat-math&q=slope`. Refreshing and sharing that URL restores the search. Selecting a result keeps `q` alongside its canonical domain and skill target, so browser back and forward navigation restore both the broad results and selected skill.

Run `npm test` for search ranking, normalization, canonical URL, immutability, and availability tests. Browser verification should cover URL restoration, back/forward navigation, native disclosure controls, unavailable actions, and desktop/mobile overflow behavior.

### Local development modes

The environment contract is centralized in `site/environment.js`:

- Default `mock`: local tutor responses, zeroed development visitor counters, and in-memory photo previews. A selected photo is never uploaded or analyzed.
- Emulator suite: set `VITE_USE_FIREBASE_EMULATORS=true` to connect Auth (`9099`), Firestore (`8080`), Functions (`5001`), and Storage (`9199`). Vite proxies `/api` to the local `api` Function.
- Deployed Firebase: set `VITE_CHAT_MODE=firebase` without emulator flags. This uses the deployed callable, Storage bucket, Firestore, and Hosting `/api` rewrite.

Copy `.env.example` to `.env.local`; never commit `.env.local` or an App Check debug token.

### Try Gemini locally with emulators

For local Vertex AI calls, install the Google Cloud CLI and authenticate Application Default Credentials:

```bash
gcloud auth application-default login --project website2-c8d1e
```

Then set these in `.env.local`:

```text
VITE_CHAT_MODE=firebase
VITE_USE_FIREBASE_EMULATORS=true
```

Then run the Functions emulator and Vite in separate terminals:

```bash
npx firebase-tools emulators:start --only auth,firestore,functions,storage
npm run dev
```

The Firebase emulators require Java. If only the Functions emulator is available, use `VITE_CHAT_MODE=firebase` with `VITE_USE_FUNCTIONS_EMULATOR=true`; do not attach photos unless Storage is also pointed at an emulator or you intentionally want the deployed temporary-upload workflow.

### Enable App Check enforcement

The client initializes reCAPTCHA Enterprise App Check when `VITE_RECAPTCHA_ENTERPRISE_SITE_KEY` is present, and callable requests automatically carry its token. For local development only, `VITE_APPCHECK_DEBUG_TOKEN=true` prints a token that must be registered in the Firebase App Check console; a previously registered token can be supplied instead. Debug-token configuration is ignored in production builds.

To enforce App Check:

1. Register the web app with App Check in Firebase Console using reCAPTCHA Enterprise.
2. Put the public site key in `VITE_RECAPTCHA_ENTERPRISE_SITE_KEY` and redeploy Hosting.
3. Verify valid requests in App Check metrics.
4. `studyTutor` already enforces App Check. Set `VITE_RECAPTCHA_ENTERPRISE_SITE_KEY`, deploy Hosting, then deploy Functions and confirm valid App Check traffic before enabling enforcement on `satMathTutor`.

`studyTutor` App Check enforcement is already `true`. The legacy `satMathTutor` callable intentionally remains `false` during this compatibility increment; enable it only after valid SAT tutor traffic is confirmed with App Check. Vertex AI authentication remains server-side either way.

The app already includes:

- Firebase Hosting for the built Vite app in `dist/`
- Firebase Functions for backend API routes under `/api/*`
- Firebase Analytics for page visits and event tracking
- Firestore-backed visitor tracking handled by the backend

## Accounts and learning records

Phase 4 adds a client-side Firebase Authentication and Firestore foundation for persistent learning history without making practice depend on login.

### Supported sign-in methods

- Google sign-in through Firebase Authentication popup flow.

### Guest versus signed-in behavior

- Guests can browse SAT Math topics, search skills, open direct skill URLs, and complete practice without signing in.
- In-progress practice sessions stay in `localStorage` on the current device so a refresh or accidental navigation can be resumed.
- Guest learning history is temporary. It is not written to permanent Firestore user records.
- Signed-in users keep the same public browsing and practice flow, and completed practice sessions are saved to Firestore for cross-device history.
- If Firestore persistence fails, practice results still remain visible and the page offers a retry without destroying the completed session.

### Firestore data model

Learning records are stored under `users/{uid}`:

```text
users/{uid}
  profile document
  attempts/{attemptId}
  sessions/{sessionId}
  mastery/{skillId}
```

`users/{uid}`

- Stores account metadata owned by the authenticated user.
- Current fields: `schemaVersion`, `uid`, `email`, `displayName`, `photoURL`, `authProviderIds`, `createdAt`, `lastSeenAt`.

`users/{uid}/attempts/{attemptId}`

- Append-friendly per-question records for submitted answers only.
- Current fields: `schemaVersion`, `uid`, `attemptId`, `sessionId`, `examId`, `subjectId`, `domainId`, `skillId`, `questionId`, `mode`, `source`, `isCorrect`, `answer`, `answeredAt`, `durationSeconds`.
- Canonical question text is not duplicated into attempt documents.

`users/{uid}/sessions/{sessionId}`

- Completed practice or testing session summaries.
- Current fields: `schemaVersion`, `uid`, `sessionId`, `examId`, `subjectId`, `domainIds`, `skillIds`, `mode`, `questionCount`, `attemptedCount`, `correctCount`, `accuracyPercent`, `completionState`, `startedAt`, `completedAt`, `timerMinutes`, `filterDomainIds`, `filterSkillIds`.

`users/{uid}/mastery/{skillId}`

- Derived per-skill snapshots that can evolve without rewriting immutable attempt records.
- Current fields: `schemaVersion`, `uid`, `skillId`, `attemptCount`, `correctCount`, `recentResults`, `recentAccuracyPercent`, `lastPracticedAt`, `updatedAt`, `metricSummary`.

### Schema versions

- `LEARNING_RECORD_SCHEMA_VERSION = 1`
- Practice-session local storage remains `study-ai-question-session-v1`

### Idempotency

- Each practice session receives a stable client-generated `session.id`.
- Each attempt document ID is deterministic: `{sessionId}__{questionId}`.
- Firestore persistence treats the session document as the write marker. If `users/{uid}/sessions/{sessionId}` already exists, the write is treated as an idempotent duplicate and mastery counts are not incremented again.
- Attempt and completed-session documents can be created and deleted by their owner, but cannot be updated in place. Mastery snapshots remain updateable derived records.

### Initial progress and mastery metric

- `accuracyPercent` on session summaries is the percent correct across answered attempts in that completed session.
- `recentAccuracyPercent` on mastery snapshots is the percent correct across the latest recorded attempts stored in `recentResults` for that skill.
- This is an initial progress signal, not a scientifically validated mastery estimate.

### Security assumptions

- Firestore rules allow reads and writes only when `request.auth.uid` matches the `users/{uid}` path owner.
- Unauthenticated users cannot read or write private learning records.
- Clients cannot write mismatched `uid`, `sessionId`, `attemptId`, or `skillId` values into protected paths.
- Non-user collections, including tracker documents, remain unavailable to direct client reads and writes.

### Commands

Run these from `my-site`:

```bash
npm run catalog:validate
npm run catalog:coverage
npm run test:site
npm run test:functions
npm run test:rules
npm run lint
npm run build
git diff --check
```

`npm test` runs the catalog validation, site tests, Functions tests, and Firestore rules tests together.

### Emulator setup

- `npm run test:rules` uses `firebase emulators:exec --only firestore "node --test site/learning/firestore.rules.test.js"`.
- The Firestore emulator requires a local Java runtime. Set `JAVA_HOME` and add its `bin` directory to `PATH`, or otherwise make `java` available before running the emulator.
- Optional local Firestore client testing can use `VITE_USE_FIRESTORE_EMULATOR=true`, which connects the browser client to `127.0.0.1:8080`.

### Firebase Console steps

1. In Firebase Authentication, enable Google as a sign-in provider.
2. Select a project support email for the Google provider.
3. In Authentication settings, authorize `website2-c8d1e.web.app`, `website2-c8d1e.firebaseapp.com`, and `localhost` for local development. Add a custom production domain only when it is actually connected.
4. In Firestore Database, create the database if it does not already exist.
5. Deploy updated Firestore rules when you are ready with `npm run deploy:firestore`.

### Known limitations and likely Phase 5 follow-ups

- The current release saves completed practice sessions, not mid-session cross-device sync.
- Tutor conversation persistence is intentionally deferred; no server-only tutor context is written to Firestore.
- Mastery uses a simple rolling recent-accuracy metric and should be replaced with a richer progress model in a later phase.
- Anonymous-auth upgrade flows are not implemented yet, but the data model is compatible with adding them later.

## Project files

- `site/firebase.js` initializes Firebase and Analytics
- `site/firebaseTracker.js` calls the backend tracker API
- `site/App.jsx` starts the tracker and logs topic selection events
- `functions/index.js` serves the backend API and writes tracker data to Firestore
- `firebase.json` configures Hosting and SPA rewrites
- `.firebaserc` points deployments at `website2-c8d1e`
- `firestore.rules` and `firestore.indexes.json` hold Firestore config

## Firebase checklist

1. Open the Firebase project `website2-c8d1e`.
2. In `Project settings`, confirm the web app config matches `site/firebase.js`.
3. In `Analytics`, make sure Google Analytics is enabled for measurement ID `G-T02FEBDSQ8`.
4. In `Firestore Database`, create the database if it does not exist yet.
5. In `Hosting`, connect your custom domain if you want Firebase to serve the production domain.
6. In `Billing`, make sure the project is on a plan that supports Cloud Functions if deployment prompts for it.

## Deploy

### One-time Firebase and GitHub Actions prerequisites

1. Create the default Firebase Storage bucket in `us-central1`, initially in production mode; repository Storage rules replace the deny-all setup during deployment.
2. Grant `github-firebase-deploy@website2-c8d1e.iam.gserviceaccount.com` both **Firebase Admin** and **Cloud Functions Admin** at the project level.
3. On `website2-c8d1e@appspot.gserviceaccount.com` specifically, grant that GitHub deployment principal **Service Account User** so it can deploy Functions using the runtime identity. Avoid project-wide Owner access.
4. Keep the service-account JSON only in the GitHub Actions secret `FIREBASE_SERVICE_ACCOUNT`. The workflow ignores temporary `gha-creds-*.json` files.
5. Deploy Storage rules and Functions before switching the production client to `VITE_CHAT_MODE=firebase`; then deploy Hosting.

Run these from the `my-site` folder:

```bash
npm ci
npm ci --prefix functions
npm run deploy:hosting
```

That command builds the app and deploys Hosting to the default Firebase project in `.firebaserc`.

To deploy the backend:

```bash
npm run deploy:backend
```

If you also want to push Firestore rules and indexes:

```bash
npm run deploy:firestore
```

Or deploy everything at once:

```bash
npm run deploy
```

That full deploy publishes Hosting, Functions, and Firestore configuration together.

## How the backend works

The browser no longer writes directly to Firestore. Instead:

- Hosting serves the React app
- Requests to `/api/*` are rewritten to the Firebase Function in `functions/index.js`
- The function writes to Firestore with the Admin SDK
- `firestore.rules` can stay locked down for browser clients

This is a much safer production setup than allowing public client writes to the tracker documents.

## Final cutover

To fully move away from GitHub Pages:

1. Point your custom domain DNS to Firebase Hosting.
2. Confirm HTTPS is active in Firebase Hosting.
3. Disable GitHub Pages for the old repository so there is only one live host.
