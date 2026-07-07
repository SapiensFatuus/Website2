# Firebase deployment for this site

This project is now set up to use Firebase as its primary hosting path, with a small Firebase Functions backend for the live visitor tracker.

## SAT Math AI tutor prototype

One skill, `sat:math:algebra:linear-equations-one-variable`, has an enabled AI tutor. The tutor uses a small manually curated set of material explicitly labeled as original prototype samples. It does not contain copied SAT or commercial test questions.

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
