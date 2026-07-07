# Firebase deployment for this site

This project is now set up to use Firebase as its primary hosting path, with a small Firebase Functions backend for the live visitor tracker.

## SAT Math AI tutor prototype

Two skills have enabled AI tutors:

- `sat:math:algebra:linear-equations-one-variable`
- `sat:math:algebra:linear-functions`

Both use small manually curated context packs explicitly labeled as original prototype material. They do not contain copied SAT or commercial test questions.

The browser defaults to safe local mock mode. No API key is needed and no request leaves the browser:

```bash
copy .env.example .env.local
npm run dev
```

Open SAT Math, choose **View Topics**, expand **Algebra**, and select **Ask AI** beside **Linear equations in one variable**.

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

The exported callable is `satMathTutor` in `us-central1`. Its input is validated canonical taxonomy data, a message of at most 1,200 characters, and at most 10 history messages.

### Add another tutor skill

Tutor support is data-driven but intentionally allow-listed. To add a skill:

1. Add declarative client capability metadata in `site/taxonomy/contentTaxonomy.js` so the shared topic browser and chat route can expose it.
2. Add a server-only context-pack module under `functions/tutorContextPacks/`. Include the canonical target, label, original-material notice, relevance rules, and uniquely identified materials.
3. Register the pack in `functions/tutorRegistry.js`. The registry validates complete targets, pack metadata, and globally unique source IDs when the module loads.
4. Add a separate client-safe fixture to `site/chat/mockTutor.js` for offline mock mode. Do not import production context packs or prompt-building code into the browser.
5. Add registry, isolation, insufficient-context, history, source-filtering, taxonomy URL, and mock-mode tests.

Adding a context pack should not require editing the callable flow or chat UI. Production prompts and approved source packs must remain inside `functions/`.

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
