# App Store Deployment (iOS)

Die App ist eine Vite-PWA, die über **Capacitor** in eine native iOS-Hülle verpackt
wird. Das native Projekt liegt unter `ios/` und wird aus dem Web-Build (`dist/`)
gespeist.

- **App-Name:** GF Finder
- **Bundle-ID:** `com.produktentdecker.gffinder`
- **Capacitor:** 8.x (nutzt Swift Package Manager, kein CocoaPods nötig)

## Voraussetzungen

| Tool | Zweck | Check |
|------|-------|-------|
| Xcode (volle Installation) | Build, Archive, Upload | `xcodebuild -version` |
| Apple-Developer-Mitgliedschaft | Signing & App Store Connect | developer.apple.com |
| App-Eintrag in App Store Connect | mit Bundle-ID `com.produktentdecker.gffinder` | appstoreconnect.apple.com |
| Node + npm | Web-Build | `node -v` |

> Das `ios/`-Verzeichnis ist eingecheckt, `node_modules/`, `dist/` und die nativen
> Build-Artefakte (`ios/App/Pods`, `App/build`, `DerivedData`, `public/`) sind via
> `.gitignore` ausgeschlossen.

## Erstmaliges Setup auf einem neuen Mac

```bash
git pull
npm install
npm run ios:sync     # baut die Web-App und kopiert sie ins iOS-Projekt
npm run ios:open     # öffnet das Projekt in Xcode
```

## Täglicher Dev-Workflow

```bash
# Web-Code geändert? → neu bauen und ins native Projekt syncen
npm run ios:sync

# Xcode öffnen (falls noch nicht offen)
npm run ios:open
```

`ios:sync` führt `npm run build` aus (TypeScript-Check + Vite-Build nach `dist/`)
und danach `npx cap sync ios` (kopiert `dist/` → `ios/App/App/public` und
aktualisiert die nativen Plugins).

## In Xcode: Signing einrichten

1. Im Project Navigator das Target **App** auswählen.
2. Tab **Signing & Capabilities**.
3. **Automatically manage signing** aktivieren.
4. Bei **Team** das eigene Apple-Developer-Team wählen
   (z. B. *FLORIAN MICHAEL STEINER* / Team-ID `6T76YW76J8`).
5. Sicherstellen, dass der **Bundle Identifier** `com.produktentdecker.gffinder` ist.

## Auf dem Simulator testen

```bash
# verfügbare Simulatoren auflisten
xcrun simctl list devices available | grep iPhone

# Build + Start auf einem Simulator direkt von der CLI
xcrun simctl boot "iPhone 16"          # oder über Xcode ▶︎ Run
```

In Xcode: oben das Ziel **App** + einen iPhone-Simulator wählen, dann **⌘R** (Run).

## Archive & Upload nach App Store Connect

1. In Xcode oben als Ziel **Any iOS Device (arm64)** wählen (kein Simulator).
2. Menü **Product → Archive**.
3. Im **Organizer** das Archive auswählen → **Distribute App**.
4. **App Store Connect → Upload** wählen und dem Assistenten folgen.
5. In [App Store Connect](https://appstoreconnect.apple.com) den Build der
   Version zuordnen, Metadaten/Screenshots ergänzen, zur Review einreichen.

### Alternative: CLI-Archive

```bash
# Archive von der Kommandozeile (Signing muss konfiguriert sein)
xcodebuild -project ios/App/App.xcodeproj \
  -scheme App \
  -configuration Release \
  -archivePath build/App.xcarchive \
  archive

# Export & Upload erfordern eine ExportOptions.plist; in der Praxis ist der
# Organizer-Weg über Xcode für den ersten Upload am robustesten.
```

## Versionierung

- **Marketing Version** (CFBundleShortVersionString) und **Build** (CFBundleVersion)
  im Target **App → General** erhöhen — jeder Upload braucht eine neue Build-Nummer.

## Troubleshooting

- **„No account for team"** → in Xcode unter *Settings → Accounts* Apple-ID hinzufügen.
- **Signing-Fehler** → *Automatically manage signing* an, korrektes Team gewählt.
- **Weiße/leere App** → `npm run ios:sync` vergessen; `dist/` war nicht aktuell.
- **CocoaPods-Warnung** → für Capacitor 8 (SPM) irrelevant.
