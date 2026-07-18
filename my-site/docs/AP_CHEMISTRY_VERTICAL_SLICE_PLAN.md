# AP Chemistry vertical-slice plan

Status: proposed implementation plan  
Planning baseline: July 2026  
Product goal: make AP Chemistry the reusable blueprint for adding every AP course.

## 1. What “complete vertical slice” means

The AP Chemistry slice is complete when a student can:

1. Understand the current exam and make a study plan.
2. Browse all nine official course units and their skills.
3. Learn a skill from an original lesson, worked examples, and an interactive formula companion.
4. Practice original multiple-choice, stimulus-set, short free-response, and long free-response questions.
5. Receive useful answer explanations, rubric-based FRQ feedback, and misconception-specific remediation.
6. Ask an AP Chemistry tutor questions at the course, unit, and skill level.
7. Complete timed section and full-exam simulations matching the current public exam structure.
8. Save progress and see strengths, weaknesses, and recommended next work.

This is also an architectural slice: the same taxonomy, content schemas, editorial workflow, tutor boundaries, analytics, and quality gates must be reusable for a second AP subject without redesigning the platform.

## 2. Official baseline and source policy

### Authoritative public references

- AP Chemistry Course and Exam Description (CED), effective fall 2024: https://apcentral.collegeboard.org/media/pdf/ap-chemistry-course-and-exam-description.pdf
- AP Chemistry course page and current unit weightings: https://apcentral.collegeboard.org/courses/ap-chemistry
- Current exam format: https://apcentral.collegeboard.org/courses/ap-chemistry/exam
- Current official exam reference information: https://apcentral.collegeboard.org/media/pdf/ap-chemistry-equations-sheet.pdf
- Released FRQs and scoring information: https://apcentral.collegeboard.org/courses/ap-chemistry/exam/past-exam-questions
- AP course and exam change log: https://apcentral.collegeboard.org/courses/how-ap-develops-courses-and-exams/course-changes-overview

### Rules for formulas and past exams

- The website may link students directly to official College Board reference material.
- Build an original, interactive formula companion that explains when and how to use each relationship. Do not present it as an official College Board sheet.
- Treat released FRQs, scoring guidelines, student samples, and commentary as research and external links unless explicit redistribution permission is established.
- Do not copy released question text, diagrams, scoring language, or student responses into the question bank by default.
- Record an analysis of each released question: year, question number, unit(s), topic(s), science practice(s), task shape, representation type, calculation type, and common error. This metadata guides original content without reproducing the question.
- Never ingest or expose secure AP Classroom questions.
- All production questions must have truthful provenance: `editorial`, `ai-generated`, licensed `third-party`, or permitted `official` content with a unique external identifier.
- AI-generated content remains visibly distinguishable internally and cannot become editorial content without human review.

Create a source register with `sourceId`, title, owner, URL, publication/effective date, access date, allowed use, redistribution status, affected framework version, and review notes. Recheck the CED, reference sheet, exam format, and change log before each school year.

### Source-to-tutor derivation policy

Official, released, restricted, and third-party PDFs can inform the curriculum, but they are not automatically tutor knowledge. Use a controlled derivation pipeline:

```text
Authorized source review
  -> source metadata and coverage analysis
  -> original lessons, formula explanations, examples, hints, and questions
  -> reviewed first-party tutor context packs
  -> student-facing Gemini response
```

- Do not fine-tune a model on College Board exams, scoring guides, student samples, or other third-party PDFs unless explicit rights for that purpose are recorded.
- Do not place raw copyrighted question text, diagrams, rubrics, or answer keys in permanent retrieval/search indexes or production tutor prompts by default.
- A source may be analyzed privately to record high-level metadata and an original content brief, such as assessed topic, science practice, task pattern, misconception, or required formula. The resulting brief must not reproduce protected wording, numbers, scenario structure, diagrams, or scoring language.
- Only reviewed first-party editorial materials, licensed third-party materials, or explicitly permitted official materials may become persistent tutor context.
- Using Vertex AI without provider-side training does not create redistribution or derivative-use rights; source rights remain an independent editorial requirement.
- Student-uploaded work may be analyzed for that student’s active tutoring request under the privacy policy, but it is never added to the shared content library or used for model training without explicit, appropriate consent.
- The visual-tutor foundation supports one signed-in student image at a time (JPEG, PNG, or WebP; 5 MB maximum). Images are private, temporary, deleted after the request, and limited to 10 successful analyses per student per UTC day.

## 3. Current product gap

The repository currently has a canonical SAT Math taxonomy and question catalog, but AP Chemistry is still isolated behind a four-question legacy adapter. Its tutor catalog has eight broad units; the current official AP Chemistry framework has nine:

1. Atomic Structure and Properties (7%–9%)
2. Compound Structure and Properties (7%–9%)
3. Properties of Substances and Mixtures (18%–22%)
4. Chemical Reactions (7%–9%)
5. Kinetics (7%–9%)
6. Thermochemistry (7%–9%)
7. Equilibrium (7%–9%)
8. Acids and Bases (11%–15%)
9. Thermodynamics and Electrochemistry (7%–9%)

The course must also cover all six current science practices: models and representations, question and method, representing data and phenomena, model analysis, mathematical routines, and argumentation.

## 4. Phased implementation

### Phase 0 — Lock the contract and evidence base

Goal: prevent content and product work from being built on an unstable or ambiguous foundation.

Deliverables:

- Add the official source register and annual review policy.
- Transcribe the current CED structure into reviewed, versioned internal data: nine units, topics, learning objectives, essential knowledge, science practices, and exam weightings.
- Define terminology rules: “AP-style” or “exam-style,” never “official,” for original questions.
- Define content status: `draft`, `in-review`, `approved`, `published`, `retired`.
- Decide the public disclaimer and trademark language with appropriate legal review before launch.

Exit gate:

- A chemistry subject-matter reviewer signs off that the internal map matches the current CED.
- Every stored official source has known usage and redistribution status.

### Phase 1 — Make AP Chemistry canonical

Goal: remove the special-case legacy architecture.

Deliverables:

- Add AP Chemistry to `site/taxonomy/contentTaxonomy.js` using the same shared exam → subject → unit → skill hierarchy as SAT Math.
- Add science-practice and learning-objective dimensions without embedding them in display labels or question IDs.
- Add chemistry-specific response and representation metadata: discrete MCQ, stimulus-set MCQ, short FRQ, long FRQ, particle diagram, graph, table, experiment, equation, and written justification.
- Extend validation for multi-part FRQs, point-level rubrics, significant figures, acceptable equivalent answers, units, and linked stimulus assets.
- Migrate or retire the four legacy questions truthfully; do not silently label them reviewed.
- Make the tutor consume the canonical taxonomy instead of its duplicate eight-unit list.

Exit gate:

- No AP Chemistry feature reads from `site/questions/legacy/apChemistryAdapter.js`.
- Catalog validation, tests, lint, and build pass.
- A coverage report can group questions by unit, topic, learning objective, science practice, format, difficulty, and review status.

### Phase 2 — Build the Unit 7 Equilibrium pilot end to end

Goal: prove the complete student loop on one representative unit before multiplying content.

Why Unit 7: the prototype already contains equilibrium tutor behavior and a legacy FRQ, while the unit exercises conceptual models, calculations, graphs, particle reasoning, and written justification.

Deliverables:

- Complete canonical Unit 7 topic/skill map from the current CED.
- Original lesson set for every Unit 7 topic: concept summary, prerequisites, worked examples, misconceptions, formula links, and retrieval checks.
- Initial reviewed bank:
  - 35 discrete MCQs
  - 5 stimulus sets with 3–4 linked MCQs each
  - 8 short FRQs
  - 3 long FRQs
- Point-level FRQ rubrics and exemplar original responses at multiple performance levels.
- Unit diagnostic, adaptive skill practice, unit review, and timed unit test.
- Unit-aware tutor grounded in approved lessons, formulas, examples, misconceptions, and question explanations.
- Source-derived tutor pack containing only original, reviewed Unit 7 material; released exams may inform coverage briefs but never supply raw prompt text or answer keys.
- Progress page showing skill coverage, recent performance, error types, and recommended next activity.

Exit gate:

- At least two chemistry reviewers approve every published question and rubric.
- Pilot students can complete learn → practice → feedback → tutor → reassessment without a dead end.
- No tutor answer exposes hidden answer keys before submission or claims an unofficial predicted AP score is official.

### Phase 3 — Formula and reference center

Goal: turn the exam reference sheet into a learning system rather than a static PDF dependency.

Deliverables:

- Prominent link to the current official AP Chemistry exam reference information.
- Original interactive formula companion organized by concept and unit.
- For each relationship: variable definitions, units, assumptions, when it applies, when it does not, rearrangements, one worked example, one common mistake, and linked practice.
- Search, unit filtering, print-friendly mode, keyboard navigation, screen-reader math, and mobile layouts.
- Periodic table access and chemistry constants presented with clear provenance.
- “Reference available on exam” versus “must understand/recognize” labels based on the current official framework.

Exit gate:

- Every formula used in published questions resolves to a reviewed formula entry or is explicitly marked as prior knowledge.
- Formula rendering and units are verified on desktop, mobile, print, and with assistive technology.

### Phase 4 — Released-exam intelligence and editorial tooling

Goal: learn systematically from public exams without turning copyrighted exams into the site’s content bank.

Deliverables:

- Internal released-FRQ metadata index for the currently public years.
- Alignment matrix: released task → units/topics → science practices → task verbs → representations → calculations → misconceptions.
- Original-resource briefs that translate each approved metadata pattern into independently written lesson, example, hint, and question requirements before any tutor context is authored.
- Reviewer dashboard or import template for drafting original questions from a coverage brief.
- Similarity review to flag drafts that are too close to a reference question in wording, numbers, scenario, or diagram structure.
- Author checklist for chemical correctness, solvability, distractor quality, significant figures, accessibility, rubric consistency, and originality.
- Version history and audit trail for edits, approvals, publication, and retirement.

Exit gate:

- Each content batch starts from a coverage need rather than “rewrite this past question.”
- A reviewer can trace every published item to its authoring and approval history.

### Phase 5 — Expand through all nine units

Goal: deliver complete curricular coverage with deliberate depth rather than equal but shallow counts.

Suggested rollout order:

1. Unit 8: Acids and Bases
2. Unit 3: Properties of Substances and Mixtures
3. Unit 4: Chemical Reactions
4. Unit 5: Kinetics
5. Unit 6: Thermochemistry
6. Unit 9: Thermodynamics and Electrochemistry
7. Unit 1: Atomic Structure and Properties
8. Unit 2: Compound Structure and Properties

For each unit, repeat the Phase 2 package and acceptance gate. Weight question production toward current exam weighting and science-practice coverage, not only unit count.

Initial full-course target:

- 350–500 approved original question parts across all formats.
- At least 25 approved items or parts per unit before calling that unit available.
- Stronger depth for Units 3 and 8 because of their larger current exam weighting.
- No learning objective or science practice left without assessment coverage.

Exit gate:

- All nine units have lessons, worked examples, practice, feedback, tutor grounding, and progress reporting.
- Coverage tooling shows no unintended gaps and flags thin combinations.

### Phase 6 — Exam simulation and FRQ feedback

Goal: reproduce the public testing experience closely enough to train pacing and response habits.

Current public structure to model:

- Section I: 60 MCQs, 90 minutes, 50% of exam score.
- Section II: 7 FRQs in 105 minutes, 50% of exam score: 3 long questions and 4 short questions.
- Hybrid workflow: questions viewed digitally; FRQ responses handwritten on exam day.

Deliverables:

- Section drills and at least three fully original, balanced full-length practice forms.
- Bluebook-inspired navigation and pacing without copying protected branding or interface assets.
- Optional printable FRQ response booklet and upload/self-review flow to practice handwriting.
- Rubric-based FRQ feedback that separates correctness, method, evidence, reasoning, units, and communication.
- Conservative score-range estimates labeled as unofficial and accompanied by uncertainty; keep raw performance available without a predicted AP score.
- Post-exam review by unit, science practice, error type, time spent, and confidence.

Exit gate:

- Every form passes blueprint, timing, answer-key, duplication, and difficulty review.
- Automated feedback is benchmarked against expert scoring and escalates uncertain responses to self-review rather than inventing certainty.

### Phase 7 — Specialized AP Chemistry tutor

Goal: make the tutor a coach connected to the student’s actual curriculum and practice history.

Deliverables:

- Course-, unit-, and skill-aware retrieval from approved first-party content.
- Permanent tutor retrieval contains first-party editorial resources, licensed materials, and explicitly permitted official material only; source PDFs remain external references or private analysis inputs according to their recorded rights.
- Modes for Socratic help, concept teaching, worked examples, error diagnosis, study planning, and FRQ feedback.
- Chemistry-safe formatting for equations, charges, states of matter, units, tables, graphs, and particle descriptions.
- Guardrails around hazardous laboratory instructions and unsupported claims.
- Student-context controls: use performance summaries and misconception tags, not raw private history copied into prompts unnecessarily.
- Evaluation set covering correctness, pedagogy, scope, hallucination, answer leakage, formula use, and prompt injection.

Exit gate:

- The tutor passes a reviewed evaluation threshold for every unit and clearly acknowledges uncertainty.
- Students can see which approved learning materials support a tutor explanation.

### Phase 8 — Quality, launch, and template extraction

Goal: ship a trustworthy course and capture the reusable AP-course system.

Deliverables:

- Closed beta with students and at least two AP Chemistry educators.
- Accessibility audit, performance/load testing, privacy review, content incident process, and analytics validation.
- Content freshness dashboard and annual AP update checklist.
- Extract an “AP course kit”: taxonomy template, source register, question schema, rubric schema, formula/reference schema, tutor pack, coverage targets, review workflow, and launch checklist.
- Validate the kit by scaffolding a second AP subject with no AP Chemistry-specific code copied into shared modules.

Exit gate:

- No critical correctness, privacy, security, accessibility, or copyright issues remain open.
- The course has named owners for engineering, chemistry review, editorial review, and annual framework maintenance.

## 5. Workstreams that run throughout every phase

### Content quality

- Two-person approval for scored content.
- Numerical answer verification independent of the author.
- Distractor rationales tied to plausible misconceptions.
- Diagram and graph accessibility descriptions.
- Regression tests for every corrected content defect.

### Measurement

Track learning and product signals separately:

- Learning: diagnostic-to-reassessment improvement, misconception resolution, FRQ rubric improvement, delayed retention.
- Product: activity completion, dead ends, tutor helpfulness, formula-center usage, return rate, latency, and errors.
- Do not optimize question volume or time-on-site as substitutes for learning.

### Privacy and safety

- Minimize stored student data and make deletion/export behavior clear.
- Keep public learning content separate from private progress records.
- Never use student submissions to train or publish examples without explicit, appropriate consent.
- Never use copyrighted source PDFs for fine-tuning or permanent tutor context without documented authorization for that exact use.
- Apply age-appropriate product and privacy review before broad student launch.

## 6. First four implementation increments

These are small enough to build and verify sequentially:

1. **Framework increment:** add source register, current nine-unit canonical AP Chemistry taxonomy, six science practices, validation, and tests.
2. **Equilibrium skeleton:** build every Unit 7 route and data shape with a small reviewed seed set—one lesson, formula links, 6 MCQs, 1 stimulus set, 1 short FRQ, and 1 long FRQ.
3. **Student loop:** connect diagnostic, practice, FRQ rubric feedback, progress, and the Unit 7 tutor.
4. **Production pipeline:** add review states, coverage reports, released-exam metadata, originality checks, and author/reviewer documentation before scaling question generation.

Do not begin mass question generation until increments 1 and 4 are complete. Otherwise hundreds of items may need reclassification, relicensing, or rewriting.

## 7. Decisions to revisit after the Equilibrium pilot

- Whether human review capacity supports the proposed question volume.
- Whether FRQ feedback should be AI-assisted self-review, expert review, or both.
- Whether official reference PDFs are linked only or also locally mirrored under explicit permission.
- Whether full exams launch before every lesson is complete.
- Which second AP course best validates the reusable course kit.
