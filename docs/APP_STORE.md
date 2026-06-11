# Apple App Store Submission Guide

The app is wrapped as a native iOS app using [Capacitor](https://capacitorjs.com/).
The web app (Vite build output in `dist/`) is bundled into the iOS project in
`ios/` and runs inside a WKWebView.

## What is already done in this repo

- ✅ Production web build compiles cleanly (`npm run build`)
- ✅ Capacitor configured (`capacitor.config.ts`, app id `com.produktentdecker.gffinder`)
- ✅ Native iOS project generated in `ios/` (Capacitor 8, Swift Package Manager)
- ✅ 1024×1024 App Store icon (opaque, no rounded corners) in
  `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
- ✅ `NSLocationWhenInUseUsageDescription` purpose string in `Info.plist`
  (required because the app uses geolocation)
- ✅ `ITSAppUsesNonExemptEncryption = false` in `Info.plist` (skips the export
  compliance question on every upload)
- ✅ App privacy manifest (`PrivacyInfo.xcprivacy`) declaring precise location
  collected for app functionality only, no tracking

## Remaining steps (require a Mac with Xcode)

### 1. One-time setup

1. Enroll in the [Apple Developer Program](https://developer.apple.com/programs/) ($99/year).
2. In [App Store Connect](https://appstoreconnect.apple.com/), create a new app
   with bundle ID `com.produktentdecker.gffinder` (register the bundle ID in
   the developer portal first if prompted).

### 2. Build and run locally

```bash
npm install
npm run ios:sync   # builds the web app and copies it into ios/
npm run ios:open   # opens the project in Xcode
```

In Xcode:

1. Select the `App` target → **Signing & Capabilities** → choose your team and
   enable automatic signing.
2. Run on a simulator or device to verify: search, geolocation prompt, and
   restaurant results from OpenStreetMap.

### 3. Archive and upload

1. Select **Any iOS Device (arm64)** as the destination.
2. **Product → Archive**, then **Distribute App → App Store Connect → Upload**.
3. Wait for processing in App Store Connect (~15 min), then attach the build to
   your app version.

### 4. App Store Connect metadata

- **Screenshots**: Apple requires one set for the 6.9" display class
  (1320×2868 px portrait) or alternatively 6.5"; smaller sizes are optional and
  scaled automatically. Take them in the simulator (`Cmd+S`) and check the
  exact sizes required for your setup in App Store Connect's Media Manager.
- **Description / keywords / support URL**: support URL can point to the
  GitHub repo or a simple landing page.
- **Privacy policy URL**: required because the app accesses location. Host a
  short policy stating location is used only on-device to query OpenStreetMap
  and is never stored or shared.
- **App Privacy questionnaire**: declare *Precise Location* — used for *App
  Functionality*, *not linked to identity*, *no tracking* (matches
  `PrivacyInfo.xcprivacy`).
- **Age rating**: complete the questionnaire (expect 4+).

### 5. Review-readiness notes (common rejection risks)

- **Guideline 4.2 (Minimum Functionality)**: thin web wrappers get rejected.
  Native touches that help: the geolocation flow, offline handling, and a
  polished launch screen. If rejected, consider adding native features
  (e.g. `@capacitor/geolocation`, haptics, share sheet) before resubmitting.
- **Medical/health caution**: avoid claiming food is "safe" for celiacs in the
  store listing — phrase it as "find restaurants with gluten-free options".
  The data comes from OpenStreetMap and is community-maintained.
- **Attribution**: OpenStreetMap data requires attribution (© OpenStreetMap
  contributors); make sure it is visible in the app UI.

## Day-to-day workflow after changes to the web app

```bash
npm run ios:sync   # rebuild web assets and copy into the iOS project
```

Then archive/upload from Xcode as above. For each new submission bump the
version in Xcode: `MARKETING_VERSION` under Target → General (Version field),
`CURRENT_PROJECT_VERSION` (Build) there too or via Target → Build Settings.
