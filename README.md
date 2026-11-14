# Bulletin

A minimal newspaper-style dashboard designed to run fullscreen on a digital photo frame or any Android display. Deployed on Vercel, served via a proper kiosk app built from [wesbos/photo-frame-dashboard](https://github.com/wesbos/photo-frame-dashboard).

**Live:** https://bulletin-six.vercel.app

## Features

- **Clock** — live 12-hour clock with seconds
- **Weather** — 5-day forecast for Toronto (Open-Meteo, no API key needed)
- **Auto theme** — switches between light and dark mode at 7am/7pm EST
- **Music** — top albums across Pop, Hip-Hop, and Alternative; horizontally scrollable (up to 9 per genre); toggle between Trending (Deezer charts) and Fresh (MusicBrainz new releases)
- **Calendar** — navigable monthly calendar with Canadian holidays highlighted; click the month label to return to today

## Project structure

```
api/
  music.js      Vercel serverless function — fetches album data from Deezer / MusicBrainz
  calendar.js   Vercel serverless function — parses ICS calendar feeds
app.js          Frontend logic (clock, theme, music, calendar, weather)
style.css       Styles (responsive: desktop two-column, mobile single-column)
index.html      Entry point
vercel.json     Vercel config (function timeouts, CORS headers)
```

## Deploy

```bash
vercel --prod
```

API routes are served locally by `vercel dev` on port 3000, no separate server needed during development.

## Environment variables

| Variable | Description |
|---|---|
| `CALENDAR_URLS` | Comma-separated list of `.ics` feed URLs to display upcoming events |

Set these in the Vercel dashboard under Project Settings > Environment Variables.

## Frame setup (Rockchip Android frame via ADB)

Tested on a **Rockchip RK3326** frame running Android 11 at 1280×800. Uses the kiosk app from [wesbos/photo-frame-dashboard](https://github.com/wesbos/photo-frame-dashboard) — a no-Gradle WebView app that runs fullscreen, auto-retries on network failures, and keeps the screen on.

### Requirements

- `adb` — `brew install android-platform-tools`
- JDK 17+ — `brew install --cask temurin`
- Android command-line tools — `brew install --cask android-commandlinetools`
- Android SDK build-tools 36 and platform 34:

```bash
sdkmanager --sdk_root=/opt/homebrew/share/android-commandlinetools \
  "build-tools;36.0.0" "platforms;android-34"
```

> Use build-tools 36+ — build-tools 34's `d8` crashes with JDK 17+.

### Build and install the kiosk APK

```bash
git clone --depth=1 https://github.com/wesbos/photo-frame-dashboard.git
cd photo-frame-dashboard/dashboard/kiosk

# Set your URL
sed -i '' 's|DEFAULT_URL = ".*"|DEFAULT_URL = "https://bulletin-six.vercel.app"|' \
  src/com/wesbos/homehq/MainActivity.java

# Build
ANDROID_HOME=/opt/homebrew/share/android-commandlinetools \
BUILD_TOOLS=/opt/homebrew/share/android-commandlinetools/build-tools/36.0.0 \
bash build.sh

# Install
adb install -r build/homehq.apk
```

### Launch

```bash
adb shell am start -n com.wesbos.homehq/.MainActivity
```

### Set as home app (auto-starts on reboot)

```bash
adb shell am start -n com.wesbos.homehq/.MainActivity --ez home true
adb shell cmd package set-home-activity com.wesbos.homehq/.Home
```

### Keep screen on while plugged in

```bash
adb shell settings put global stay_on_while_plugged_in 3
```

### Controls on the frame

Hold two fingers still for 1.5 seconds to open a menu for reload, Android settings, Wi-Fi, or the launcher.
