# Rooted (Expo / React Native)

A self-contained farmers-market style app: **consumer** experience (map, search, events, saved, profile) and a **producer** dashboard (analytics, inventory, markets, profile). The repo root **is** the Expo app (where `package.json` lives)—nothing else is required.

---

## Quick start (new to the repo)

1. **Install Node.js**  
   Use the current [LTS](https://nodejs.org/) (v20+ is a safe choice).

2. **Clone and enter the folder**

   ```bash
   git clone https://github.com/juu2n/Rooted-ios.git
   cd Rooted-ios
   ```

   (If you cloned into a different directory name, `cd` into that folder instead.)

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Start Expo**

   ```bash
   npm run start
   ```

5. **Open the app**

   - **iOS Simulator** (Mac + Xcode): press `i` in the terminal, or run `npm run ios`.
   - **Android Emulator**: press `a`, or run `npm run android`.
   - **Physical phone**: install [Expo Go](https://expo.dev/go), then scan the QR code from the terminal (same Wi‑Fi as your computer).

6. **Sanity check that it works**

   - You should see the main **tab bar** (Map, Search, Events, Saved, Profile).
   - Open **Map**: markers should appear; you can tap into a market.
   - Open **Profile** → **Switch to Producer View**: you should land on producer tabs (Analytics, Inventory, …). Use **Switch to Consumer View** on the producer profile to go back.

If the bundler shows a stale error, stop the server and run:

```bash
npx expo start --clear
```

### Check the project without a simulator

From the same folder (after `npm install`):

```bash
npm run typecheck
npm run lint:expo
```

Pushes to `main` also run these checks (and an iOS JS bundle) on [GitHub Actions](https://github.com/juu2n/Rooted-ios/actions).

---

## Scripts

| Command | Purpose |
|--------|---------|
| `npm run start` | Dev server (Metro + Expo) |
| `npm run ios` / `npm run android` | Open in simulator / emulator |
| `npm run typecheck` | TypeScript check (`tsc --noEmit`) |
| `npm run lint:expo` | `expo-doctor` health checks |

---

## Project layout

| Path | What it is |
|------|------------|
| `App.tsx` | Root providers and navigation container |
| `src/navigation/` | Consumer tabs, consumer/producer switch, producer tabs |
| `src/screens/` | Screens; `producer/` is the producer experience |
| `src/data/` | Seed data (markets, products, producers) |
| `assets/` | App icon and splash images |

---

## Notes

- **No backend**: data is local/seeded. Producer inventory is stored with **AsyncStorage** for demo persistence.
- **Maps**: `react-native-maps` with the default provider (e.g. Apple Maps on iOS).

## License

Add a `LICENSE` file if you want explicit terms for reuse.
