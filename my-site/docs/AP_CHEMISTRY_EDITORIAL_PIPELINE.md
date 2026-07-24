# AP Chemistry editorial and source-derivation pipeline

This workflow turns framework facts and lawful source analysis into original AP Chemistry learning material. It does not turn source PDFs into a question bank or persistent tutor context.

## Source boundary

College Board PDFs in the source register are `link-only` or `metadata-only` unless written redistribution permission is recorded. Local copies supplied for research stay outside the repository. Never paste or extract question text, answer choices, diagrams, scoring language, student responses, or the official reference-sheet layout into production data.

For a public released question, an editor may record only high-level facts in the released-exam metadata schema:

- year and public question number;
- canonical topic and science-practice IDs;
- task verbs;
- representation and calculation categories;
- observed misconception categories.

The validator uses an exact allow-list for record fields, recursively rejects protected-content names such as `questionText`, `prompt`, `rubricText`, `studentResponse`, `answerChoices`, and `diagram`, and requires category values to be short stable metadata IDs rather than prose. Renaming a text field does not bypass the boundary. The repository intentionally begins with no released-question metadata records; a human editor must inspect public sources and enter factual metadata without protected content.

Create a local, deliberately incomplete intake template for one public question:

```powershell
New-Item -ItemType Directory -Force metadata-intake
npm run catalog:metadata-template -- --year=2026 --question=FRQ-1 --recorded-by=metadata-reviewer --date=2026-07-20 --output=metadata-intake/released-2026-frq-1.json
```

Fill only the six metadata arrays, using canonical topic and science-practice IDs plus short kebab-case category IDs. Then validate one file or a batch:

```powershell
npm run catalog:metadata-validate -- metadata-intake/released-2026-frq-1.json
```

Templates are restricted to new UTF-8 `.json` files inside the ignored `metadata-intake/` directory. They are invalid while their arrays are empty, cannot overwrite an existing file, and never enter the production registry automatically. A human editor must decide whether a validated factual record should be reviewed and added to `apChemistryReleasedExamMetadata.js`.

## From metadata to original work

1. Verify the source register and usage status.
2. Record high-level released-exam metadata only.
3. Generate a deterministic coverage brief that identifies missing topic and science-practice combinations.
4. Author a new scenario, values, representation, wording, explanation, hints, and rubric from the coverage need—not by rewriting one released item.
5. Run internal-draft similarity checks. These compare only first-party drafts; copyrighted source text is never supplied to the checker or retained.
6. Validate taxonomy, provenance, misconception, stimulus, formula, rubric, and bidirectional links.
7. Independently solve numerical work and verify every rubric point.
8. Move through `draft` → `in-review` → `approved` → `published` with attributed audit decisions. Approval and publication require the complete checklist and a reviewer other than the author. Retirement and revision use the allowed transitions in `editorialSchema.js`.

## Mandatory review checklist

Every approval covers chemistry correctness, independent solvability, originality, distractor quality, units and significant figures, accessibility, rubric consistency, and source rights. A SHA-256 content hash and sequential revision record make the reviewed version identifiable. AI-assisted drafts remain labeled `ai-generated` and `draft` until real reviewers approve them.

## Development review queue

Set `VITE_EDITORIAL_PREVIEW=true` and open a canonical unit route such as `/editorial.html?test=ap-chemistry&unit=equilibrium` or `/editorial.html?test=ap-chemistry&unit=acids-bases` during Vite development. The route assembles a deterministic, read-only queue from that unit's canonical question, resource, and FRQ-exemplar catalogs. It supports ID, text, topic, practice, type, and format filtering; shows reviewer attribution; and expands the eight required checklist gates for each item.

Every current gate remains `pending`, and the page has no approve, publish, or persistence action. Its counts are derived rather than hand-maintained, so new drafts enter the queue automatically. Internal similarity flags compare only first-party drafts and must not be interpreted as evidence that a draft differs sufficiently from a released exam or other external source. Reviewers must complete the source-rights and originality checks independently before any status transition.

## Independent reviewer packets

The queue can be exported as a decision template without copying question text into another catalog. Packet schema version 2 includes questions, supporting resources, and three-level FRQ exemplar sets as independently versioned records. Each packet contains stable content IDs, format metadata, the current revision, a SHA-256 hash of the exact record, the eight checklist gates, and blank decision fields. Changing any sample response or its feedback invalidates the prior hash just as changing a question or rubric does. The packet does not change content status.

Create one packet for each reviewer from the same content revision:

```powershell
New-Item -ItemType Directory -Force review-packets
npm run catalog:review-template -- --unit=equilibrium --reviewer=reviewer-one --date=2026-07-20 --output=review-packets/reviewer-one.json
npm run catalog:review-template -- --unit=equilibrium --reviewer=reviewer-two --date=2026-07-20 --output=review-packets/reviewer-two.json
```

Each reviewer independently changes every `decision` from `pending` to `approve` or `request-changes`, records a note for every completed checklist result, and adds an overall note. Approval requires all eight results to pass. A change request requires at least one failed gate. An author identifier cannot approve its own record.

Validate one or both completed packets against the current worktree:

```powershell
npm run catalog:review-validate -- --unit=equilibrium review-packets/reviewer-one.json
npm run catalog:review-validate -- --unit=equilibrium review-packets/reviewer-one.json review-packets/reviewer-two.json
```

Validation rejects missing items, duplicate reviewers, incomplete gates, self-approval, stale revisions, and changed content hashes. Two valid approvals make an item eligible for a deliberate audited status transition; the command never edits source files, changes status, or publishes content. Any change request requires a new content revision and new packets. The `review-packets/` directory is ignored because reviewer identities and notes may be private; retain packets in an access-controlled editorial system according to the project privacy policy.

The output option accepts only `.json` files inside `review-packets/` and refuses to overwrite an existing packet. This avoids shell-redirection encoding and npm-banner problems while protecting completed reviewer notes from accidental replacement.

## Tutor boundary

Only approved or published first-party packs are eligible for production tutor grounding. The current Unit 7 pack is a draft and is excluded by default. Local Functions-emulator testing may opt in with both `FUNCTIONS_EMULATOR=true` and `TUTOR_EDITORIAL_PREVIEW=true`; that flag does not make the material reviewed or production eligible.

## Commands

```text
npm run catalog:validate
npm run catalog:coverage
npm run catalog:readiness
npm run catalog:review-template -- --unit=equilibrium --reviewer=reviewer-id
npm run catalog:review-validate -- --unit=equilibrium packet-one.json packet-two.json
npm run catalog:metadata-template -- --year=2026 --question=FRQ-1 --recorded-by=metadata-reviewer --output=metadata-intake/file.json
npm run catalog:metadata-validate -- metadata-intake/file.json
npm run test:site
npm run test:functions
```

The readiness command defaults to Unit 7. Use `npm run catalog:readiness -- --unit=<canonical-unit-id>` for one unit or `npm run catalog:readiness -- --all` for all nine units in official order. Add `--require-ready` when a nonzero exit status should block a release if any selected unit still has an unmet gate. `--all` and `--unit` are intentionally mutually exclusive.

The Firebase rules suites additionally require Java and the Firebase emulators.
