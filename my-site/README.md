# Firebase deployment for this site

This project is now set up to use Firebase as its primary hosting path, with a small Firebase Functions backend for the live visitor tracker.

## Adaptive AI tutor

SAT Math and AP Chemistry each have one test tutor. Test overview pages open a clean whole-test conversation, while SAT Math unit and skill links generate a focused opening question and submit it automatically.

The tutor adjusts its internal focus automatically as the student moves between units and skills. Students never manage scope or see grounding metadata. Questions outside the selected test still receive a helpful answer with a brief test-boundary note.

The browser defaults to safe local mock mode. No API key is needed and no request leaves the browser:

```bash
copy .env.example .env.local
npm run dev
```

Open SAT Math or AP Chemistry and choose **Ask the [test] Tutor** for whole-test tutoring. SAT Math also exposes secondary **Teach me this unit** and **Teach me this skill** actions.

### Configure Vertex AI Gemini and deploy

The tutor uses Vertex AI with the Cloud Function's service account. No Gemini API key or browser credential is used.

1. Upgrade the Firebase project to Blaze and enable the Vertex AI API.
2. Grant `roles/aiplatform.user` to the default compute service account (`PROJECT_NUMBER-compute@developer.gserviceaccount.com`).
3. Install and deploy the backend:

   ```bash
   npm install --prefix functions
   npm run deploy:backend
   ```

4. Set `VITE_CHAT_MODE=firebase` in `.env.production`, then build and deploy Hosting:

   ```bash
   npm run deploy:hosting
   ```

The exported callable remains `satMathTutor` in `us-central1` for deployment compatibility. Its input accepts a canonical `skill`, `domain`, or `subject` target, a message of at most 1,200 characters, and at most 10 history messages. The backend retains effective-target and classification fields for compatibility, but the chat UI does not expose routing or grounding details.

### Add another tutor course or grounding pack

Course scope is allow-listed independently in `functions/tutorScopeCatalog.js` and `site/chat/tutorScopes.js`. Add matching canonical course, unit, and skill metadata to both server and client catalogs, then add scope-resolution and URL tests.

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

Run `npm run catalog:coverage` for deterministic counts by exam, subject, domain, skill, question type, and source kind. It also lists skills with no questions and skills below the default minimum of five. Use `npm run catalog:coverage -- --minimum=10` to choose another positive threshold.

AP Chemistry remains prototype-only content behind `site/questions/legacy/apChemistryAdapter.js`. It is intentionally excluded from the canonical catalog until that subject receives a complete shared taxonomy and migration.

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

### Try Gemini locally with emulators

For local Vertex AI calls, install the Google Cloud CLI and authenticate Application Default Credentials:

```bash
gcloud auth application-default login --project website2-c8d1e
```

Then set these in `.env.local`:

```text
VITE_CHAT_MODE=firebase
VITE_USE_FUNCTIONS_EMULATOR=true
```

Then run the Functions emulator and Vite in separate terminals:

```bash
npx firebase-tools emulators:start --only functions
npm run dev
```

### Enable App Check enforcement

The client already initializes reCAPTCHA Enterprise App Check when `VITE_RECAPTCHA_ENTERPRISE_SITE_KEY` is present, and callable requests automatically carry its token. To enforce it:

1. Register the web app with App Check in Firebase Console using reCAPTCHA Enterprise.
2. Put the public site key in `VITE_RECAPTCHA_ENTERPRISE_SITE_KEY` and redeploy Hosting.
3. Verify valid requests in App Check metrics.
4. Change `enforceAppCheck` to `true` on `satMathTutor` in `functions/index.js` and redeploy Functions.

Enforcement is intentionally `false` during the prototype so mock/local development is not blocked. Vertex AI authentication remains server-side either way.

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
2. In Authentication settings, ensure your local and production domains are authorized if Firebase prompts for them.
3. In Firestore Database, create the database if it does not already exist.
4. Deploy updated Firestore rules when you are ready with `npm run deploy:firestore`.

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

Run these from the `my-site` folder:

```bash
npm install
npm install --prefix functions
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
