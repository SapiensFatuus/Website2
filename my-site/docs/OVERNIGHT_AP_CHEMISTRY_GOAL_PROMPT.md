# Overnight autonomous goal: advance the AP Chemistry vertical slice

Work autonomously for the full available goal budget in `C:\Users\chris\Desktop\Website2`. Make as much verified, production-quality progress as possible toward the AP Chemistry vertical slice described in `my-site/docs/AP_CHEMISTRY_VERTICAL_SLICE_PLAN.md`. Continue across goal turns; do not stop after completing only the first convenient task. When one task is blocked by external configuration, record the blocker and immediately continue with the next safe local task.

## Operating rules

- Treat the current worktree as authoritative. Inspect it before editing and preserve all existing user changes.
- The worktree currently contains unfinished Google sign-in restoration. Finish, test, and preserve it before starting new feature work.
- You are authorized to edit local repository files, add original content, install already-declared dependencies when needed, and run relevant local tests/builds.
- Do not push, deploy, change IAM, enable billing, alter Firebase Console settings, send messages, or perform other external mutations unless separately authorized in the active conversation.
- Do not weaken authentication, App Check, quotas, private Storage rules, source-rights restrictions, validation, or tests to make checks pass.
- Do not claim human review, chemistry-expert approval, licensing, or production verification that did not occur. Use truthful `draft` or `ai-generated`/unreviewed status where appropriate.
- Never copy College Board questions, rubrics, diagrams, student responses, secure AP Classroom material, or substantial protected wording into the repository. The supplied PDFs may inform high-level coverage metadata and independently written resources only. Do not place raw PDFs or extracted protected text in permanent tutor context.
- Use original scenarios, numbers, explanations, examples, questions, rubrics, and diagrams. Avoid close paraphrase or structural imitation of a past exam question.
- Use the existing taxonomy and stable IDs. Do not create new browser-side AP Chemistry unit lists or another parallel content catalog.
- Use `apply_patch` for hand-authored file edits. Preserve unrelated changes. Never use destructive Git commands.
- Keep a concise plan current, send periodic progress updates, and verify each increment in proportion to risk.

## Current evidence and known state

- Canonical AP Chemistry framework/source registry exists with nine units, 88 topics, learning objectives, and science practices.
- AP Chemistry still has four prototype questions behind `site/questions/legacy/apChemistryAdapter.js`; do not silently treat them as reviewed canonical content.
- A `studyTutor` callable, private image-upload flow, daily quota, Storage rules, and a small original Unit 7 tutor pack have been implemented locally/on the latest commit, but deployment has encountered Firebase IAM/configuration issues.
- Google sign-in UI was hidden by `site/auth/authFeatures.js`. Current uncommitted work removes that kill switch, restores the button, and adds actionable auth errors/tests. Inspect and complete this work rather than reverting it.
- Firebase Authentication must be enabled externally; local code cannot prove the console provider is enabled. Keep code testable and document the exact external verification step.
- Plain Vite development currently mocks tutor text, does not proxy `/api`, does not connect Auth or Storage emulators, and can upload a real image in mock mode without server cleanup. Fix this unsafe local-development boundary.
- Storage/Firestore emulator tests may be blocked locally if Java is unavailable. Do not remove or skip the tests permanently; run all nonblocked checks and document the exact Java blocker.
- SAT Math behavior must remain intact.

## Priority 1: stabilize authentication, local development, and deployment readiness

Complete this entire foundation before relying on the tutor UI for content work:

1. Finish Google sign-in restoration.
   - Signed-out visitors must always see a Google sign-in action.
   - Preserve popup sign-in, local persistence, auth-state restoration, sign-out, and useful errors.
   - Ensure the photo attachment gate uses the same auth state and sign-in action.
   - Add regression tests that fail if sign-in is hidden again.
   - Document Firebase Console requirements: enable Google provider; set support email; authorize Firebase Hosting domains and local development hosts.
2. Make development modes explicit and safe.
   - Define a clear environment contract for `mock`, emulator-backed, and production Firebase modes.
   - In mock mode, never upload homework images to production Storage. Either provide an in-memory/local mock analysis path with a clearly labeled mock response or disable attachment submission with a precise explanation.
   - Add optional Auth, Firestore, Storage, and Functions emulator connections using explicit environment flags. Avoid accidental live writes during emulator mode.
   - Add a Vite development proxy or an explicit mock/emulator path for `/api` visitor stats so failures are intentional and understandable.
   - Support Firebase App Check debug tokens for local real-function testing without embedding secrets or weakening production enforcement.
   - Add tests for environment resolution and the rule that mock photo requests cannot create production uploads.
3. Improve deployment readiness without deploying.
   - Update GitHub Actions to the supported Node version used by Functions (currently Node 22) and current compatible official action majors when justified by package/runtime evidence.
   - Use deterministic installs (`npm ci`) for both app and Functions where lockfiles allow it.
   - Keep deployment order and required IAM roles documented, including Storage initialization, Cloud Functions Admin for the deploy account, and narrowly scoped Service Account User on the runtime service account.
   - Do not add service-account keys or secrets to the repository.

Acceptance evidence for Priority 1:

- Auth UI/provider/error tests pass.
- Mock mode cannot upload a file to live Storage.
- Emulator/live environment selection has direct tests.
- Site tests, Functions tests, lint, build, and `git diff --check` pass, except emulator suites that are proven blocked by missing Java.

## Priority 2: implement the Unit 7 Equilibrium skeleton increment

Build the next master-plan increment as a complete thin vertical slice using original content. Do not attempt the full 35+ question pilot yet.

### Content architecture

- Add reusable schemas and validators for AP Chemistry lessons, formula references, stimuli, multi-part FRQs, point-level rubrics, misconceptions, review status, provenance, revision, learning objectives, and science-practice subskills.
- Make schemas generic enough for later AP units; keep chemistry-specific metadata additive.
- Add deterministic coverage reporting by unit, topic, learning objective, science practice, format, difficulty, provenance, and review status.
- Ensure only `published` canonical content appears in student practice. Draft seed content may be previewed only through an explicit development/editorial path.
- Do not claim draft content has human approval.

### Original Unit 7 starter resources

Create a coherent, independently written starter set aligned to the canonical Unit 7 topics:

- At least one substantial original lesson containing prerequisites, concept explanation, worked examples, misconceptions, retrieval checks, and links to formula entries.
- Original formula/reference entries needed by that lesson, including variable definitions, units, assumptions, applicability, rearrangements, one worked example, and one common mistake.
- Six original discrete multiple-choice questions.
- One original stimulus set with three or four linked MCQs.
- One original short FRQ.
- One original long FRQ.
- Point-level draft rubrics, answer explanations, hints, misconception tags, valid learning-objective IDs, and valid science-practice IDs for every item.
- Use original chemical systems, values, tables, graphs, and experimental contexts. Numerically verify every answer with independent calculations/tests.
- Mark all new scored content truthfully as draft/unreviewed until a human chemistry reviewer approves it. If the current public practice catalog only permits published items, add an editorial preview fixture rather than bypassing status controls.

### Student routes and loop

- Add canonical Unit 7 lesson and formula routes/components with safe invalid-ID behavior.
- Connect Unit 7 browsing to available lesson/formula resources without breaking zero-content topics.
- Allow the draft starter set to exercise practice and FRQ renderers in development/editorial preview.
- Add accessible tables, chemical notation, math rendering, keyboard behavior, responsive layouts, and text alternatives for any original visual representation.
- Ground the Unit 7 tutor only in approved/published first-party packs in production; draft packs must not silently become production grounding.
- Preserve readable tutor source citations.

Acceptance evidence for Priority 2:

- Every new resource validates against canonical Unit 7 IDs and source policy.
- Correct-answer and rubric calculations have direct tests.
- Routes resolve directly and fail safely for invalid IDs.
- Coverage reports include the starter resources and distinguish draft from published.
- SAT Math regression tests remain green.

## Priority 3: build the production/editorial pipeline before mass generation

If Priority 2 is complete and budget remains, implement the master plan's production-pipeline increment:

- Review states: `draft`, `in-review`, `approved`, `published`, `retired`, with valid transitions and audit metadata.
- Author/reviewer checklist for chemistry correctness, solvability, originality, distractors, units, significant figures, accessibility, rubric consistency, and source rights.
- Released-exam metadata schema that stores only high-level facts such as year, public question number, topics, practices, task verbs, representation/calculation types, and observed misconception categories. It must reject raw question/rubric text fields.
- Coverage-brief schema that turns metadata gaps into requirements for independently written content.
- Originality/similarity tooling that flags suspiciously close internal drafts for human review without storing copyrighted reference text in the production repository.
- Version history, approval attribution, and deterministic coverage reports.
- Documentation showing how supplied PDFs can inform metadata and briefs without entering tutor retrieval or being reproduced.

Do not bulk-generate hundreds of questions. The pipeline and review controls must exist first.

## Priority 4: continue with the highest-value unblocked work

After Priorities 1–3, keep working through the master plan in dependency order. Prefer:

1. Expand the original Unit 7 lesson set across remaining Equilibrium topics.
2. Build the interactive formula/reference center shell and Unit 7 entries.
3. Add Unit 7 diagnostic, practice recommendations, rubric feedback, and progress summaries.
4. Add tutor evaluation fixtures for chemistry correctness, pedagogy, hallucination, scope, source citation, image privacy, and answer leakage.
5. Improve accessibility, responsive behavior, performance, and documentation.

For each additional slice, add validation/tests and keep new scored content in truthful draft status. Do not represent AI output as educator-approved.

## Source files available for research only

These user-supplied files may be inspected when filesystem permissions allow, following the PDF workflow and the source policy above. They must not be copied into the public repository or persistent tutor context:

- `C:\Users\chris\Downloads\ap-chemistry-equations-sheet.pdf`
- `C:\Users\chris\Downloads\[2019-Official-AP Practice Exam] (With Answers).pdf`
- `C:\Users\chris\Downloads\ap26-frq-chemistry.pdf`
- `C:\Users\chris\Downloads\Steen-s Solutions 2026 Chem.pdf`
- `C:\Users\chris\Downloads\Chemistry_PE3_FRQ-scoring-guidelines.pdf`
- `C:\Users\chris\Downloads\Chemistry_PE2_FRQ-scoring-guidelines.pdf`
- `C:\Users\chris\Downloads\Chemistry_PE1_FRQ-scoring-guidelines.pdf`
- `C:\Users\chris\Downloads\SG_SupplementalPracticeExamFRQ_6a060a544ed3f1.6a060a58c3b605.29785587.pdf`

If access requires approval and no user is present, skip PDF inspection and continue building from the existing canonical framework and original editorial knowledge. Never stall the overall goal on these files.

## Verification and handoff

Continuously run focused tests while editing. Before claiming any increment complete, run and report:

- `npm run catalog:validate`
- `npm run test:site`
- `npm run test:functions`
- `npm run lint`
- `npm run build`
- `git diff --check`
- Firestore and Storage emulator rule tests when Java/emulators are available

Inspect the final diff for accidental secrets, copied source material, duplicated taxonomies, weakened rules, and unrelated changes. Provide a concise handoff containing:

- What was completed, organized by master-plan priority.
- Exact test/build results and any blocked emulator/manual checks.
- Content-review items that still require a human chemistry educator.
- External Firebase/IAM/App Check steps that remain, without claiming they were performed.
- The next highest-value implementation task.

Do not mark the overall AP Chemistry vertical slice complete merely because the overnight budget ends. Completion requires the full master-plan exit gates and real evidence.
