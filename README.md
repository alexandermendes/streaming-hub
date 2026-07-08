# RT Streamers Hub

A concept app for managing every streaming subscription you juggle — deals,
expiries, and a Radio Times watchlist sorted by what's actually streaming where.

It's one universal [Expo](https://expo.dev) codebase (SDK 57 · expo-router ·
React Native Web) in `/app` that runs on **iOS, Android, and the web** from a
single source.

**Live web app:** https://immediate-media.github.io/streaming-hub-demo/

## Prerequisites

- To run on a phone or simulator: the **Expo Go** app (iOS/Android), or
  **Xcode** (iOS Simulator) / **Android Studio** (Android emulator)

## Running it

Install dependencies once:

```bash
cd app
npm install
```

### In the browser (web)

```bash
npm run web
```

This builds with React Native Web and opens the app in your browser
(http://localhost:8081). No device or simulator needed — or just visit the
[live deployment](https://immediate-media.github.io/streaming-hub-demo/).

### As a mobile app (iOS / Android)

```bash
npm start
```

Then, from the Expo dev server:

- press **`i`** — open in the iOS Simulator
- press **`a`** — open in the Android emulator
- or scan the QR code with **Expo Go** on your phone

To compile and run a native build instead: `npm run ios` or `npm run android`.

## Deployment

The web build is published to GitHub Pages at
**https://immediate-media.github.io/streaming-hub-demo/**.

Every push to `main` triggers
[`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml),
which runs a static Expo web export (`npm run export:web` in `/app`) and
deploys the resulting `dist/` to Pages. Since the site is served from the
`/streaming-hub-demo` subpath, `app/app.json` sets `experiments.baseUrl` to match.

To produce the static build locally: `cd app && npm run export:web` (output in
`app/dist`).

## Prototype (`/prototype`)

The repo also holds the original [Lovable](https://lovable.dev) design prototype
(TanStack Start · React · Tailwind · shadcn/ui), kept for reference only — it
isn't wired into the app and runs independently:

```bash
cd prototype
yarn install
yarn dev
```

Then open the URL it prints (usually http://localhost:3000). Other scripts:
`yarn build`, `yarn preview`, `yarn lint`, `yarn format`.

> The app and the prototype each keep their own copy of the streamer data
> (`app/src/data/streamers.ts` and
> `prototype/src/components/streamers/data.ts`).
