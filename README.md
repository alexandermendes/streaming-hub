# RT Streamers Hub

A concept app for managing every streaming subscription you juggle — deals,
expiries, and a Radio Times watchlist sorted by what's actually streaming where.

The repo holds **two apps**:

| App         | Path       | Stack                                          |
| ----------- | ---------- | ---------------------------------------------- |
| **Website** | `/`        | TanStack Start · React · Tailwind · shadcn/ui  |
| **Mobile**  | `/mobile`  | Expo (SDK 57) · expo-router · React Native     |

They install and run independently — pick whichever you're working on.

## Prerequisites

- **Node 20+**
- **Yarn** (website) and **npm** (mobile) — both ship with most setups
- For the mobile app: the **Expo Go** app on your phone, or **Xcode** (iOS
  Simulator) / **Android Studio** (emulator)

## Website (`/`)

```bash
yarn install
yarn dev
```

Then open the URL it prints (usually http://localhost:3000).

Other scripts: `yarn build`, `yarn preview`, `yarn lint`, `yarn format`.

> Prefer npm? `npm install` then `npm run dev` — the scripts are the same.

## Mobile app (`/mobile`)

```bash
cd mobile
npm install
npm start
```

This starts Expo. From there:

- press **`i`** to open the iOS Simulator
- press **`a`** to open an Android emulator
- press **`w`** to open it in a browser (React Native Web) — or `npm run web`
- or scan the QR code with **Expo Go** on your phone

To build and run natively instead: `npm run ios` or `npm run android`.

> The `w` / `npm run web` option renders the **mobile app** in a browser via
> React Native Web. That's a different codebase from the `/` website above —
> two separate front-ends, not the same site.

## Notes for contributors

- Keep `main` in a working state — it syncs back to Lovable.
- The website and mobile app currently keep their own copy of the data
  (`src/components/streamers/data.ts` and `mobile/src/data/streamers.ts`).
