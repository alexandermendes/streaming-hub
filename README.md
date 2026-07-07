# RT Streamers Hub

A concept app for managing every streaming subscription you juggle — deals,
expiries, and a Radio Times watchlist sorted by what's actually streaming where.

**Live web app:** https://alexandermendes.github.io/streaming-hub/

The repo holds two projects:

| Project       | Path         | Stack                                            |
| ------------- | ------------ | ------------------------------------------------ |
| **App**       | `/app`       | Expo (SDK 57) · expo-router · React Native + Web |
| **Prototype** | `/prototype` | TanStack Start · React · Tailwind · shadcn/ui    |

`/app` is what we're building — one universal Expo codebase targeting **iOS,
Android, and the web** (via React Native Web). `/prototype` is the original
Lovable design prototype, kept for reference only; it isn't wired into the app.

The two install and run independently.

## Prerequisites

- **Node 20+**
- **npm** (app) and **yarn** (prototype) — both ship with most setups
- For the app on a device/simulator: the **Expo Go** app on your phone, or
  **Xcode** (iOS Simulator) / **Android Studio** (emulator)

## App (`/app`) — start here

The universal Expo app — iOS, Android, and web from one codebase.

```bash
cd app
npm install
npm start
```

This starts Expo. From there:

- press **`i`** — iOS Simulator
- press **`a`** — Android emulator
- press **`w`** — web browser (React Native Web), or `npm run web`
- or scan the QR code with **Expo Go** on your phone

To build and run natively instead: `npm run ios` or `npm run android`.

## Deployment

The web build is published to GitHub Pages at
**https://alexandermendes.github.io/streaming-hub/**.

Every push to `main` triggers
[`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml),
which runs a static Expo web export (`npm run export:web` in `/app`) and
deploys the resulting `dist/` to Pages. Since the site is served from the
`/streaming-hub` subpath, `app/app.json` sets `experiments.baseUrl` to match.

To produce the static build locally: `cd app && npm run export:web` (output in
`app/dist`).

## Prototype (`/prototype`)

The original web design prototype, archived for reference.

```bash
cd prototype
yarn install
yarn dev
```

Then open the URL it prints (usually http://localhost:3000).

Other scripts: `yarn build`, `yarn preview`, `yarn lint`, `yarn format`.

> Prefer npm? `npm install` then `npm run dev` — the scripts are the same.

## Notes for contributors

- The app and the prototype each keep their own copy of the data
  (`app/src/data/streamers.ts` and
  `prototype/src/components/streamers/data.ts`).
