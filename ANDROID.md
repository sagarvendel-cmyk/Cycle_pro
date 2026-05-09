# Android APK (Trusted Web Activity)

Light Process is a **Next.js web app**. It does not emit an APK from `npm run build`. You wrap the **deployed HTTPS site** in a Trusted Web Activity (TWA) shell so users install it like an app from the Play Store.

## Prerequisites

1. Deploy the app to a stable HTTPS URL (e.g. Vercel). Set production env vars (see [.env.example](.env.example)).
2. Ensure the PWA manifest is served at `/manifest.json` and icons resolve (see [public/manifest.json](public/manifest.json)).
3. For Play Console you typically need **maskable PNG icons** (e.g. 192×192 and 512×512). Export them from your brand assets, add them under `public/`, and extend `manifest.json` `icons` accordingly. Bubblewrap can also generate icons during init.

## Digital Asset Links

TWAs must prove you own the domain. After you pick an Android package name and signing key, host the **Digital Asset Links** JSON file Google/Bubblewrap gives you on your site (e.g. `https://your-domain/.well-known/assetlinks.json`).

## Option A: Bubblewrap (CLI)

1. Install [Node.js](https://nodejs.org/) and the [Android SDK / build tools](https://developer.android.com/studio).
2. Install Bubblewrap: `npm install -g @bubblewrap/cli`
3. Run `bubblewrap init --manifest https://your-domain.com/manifest.json` and follow prompts (package name, launcher name, signing key).
4. Run `bubblewrap build` to produce an APK (or AAB for Play upload).

Use the [Bubblewrap documentation](https://github.com/GoogleChromeLabs/bubblewrap) for keystores, `assetlinks.json`, and Play upload steps.

## Option B: Android Studio TWA template

Create a new Trusted Web Activity project in Android Studio, point it at your production URL and manifest, configure the same signing and Digital Asset Links, then **Build → Build Bundle(s) / APK(s)**.

## Local testing without Play Store

Install the debug APK on a device/emulator (`adb install app-release.apk`). The WebView loads your production URL; local `npm run dev` is not suitable for a TWA pointing at `localhost` unless you use a tunnel (e.g. ngrok) and update the manifest/start URL.
