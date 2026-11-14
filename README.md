# Bulletin

A minimal dashboard designed to run fullscreen on a Frameo digital photo frame (or any Android display). Deployed on Vercel, loaded in the frame's browser as a kiosk page.

## Features

- **Clock** - live 12-hour clock with seconds
- **Weather** - 5-day forecast for Toronto (Open-Meteo, no API key needed)
- **Auto theme** - switches between light and dark mode at 7am/7pm EST
- **Music** - top albums across Pop, Hip-Hop, and Alternative; horizontally scrollable (up to 9 per genre); toggle between Trending (Deezer charts) and Fresh (MusicBrainz new releases)
- **Calendar** - navigable monthly calendar with Canadian holidays highlighted; click the month label to return to today

## Project structure

```
api/
  music.js      Vercel serverless function - fetches album data from Deezer / MusicBrainz
  calendar.js   Vercel serverless function - parses ICS calendar feeds
app.js          Frontend logic (clock, theme, music, calendar, weather)
style.css       Styles
index.html      Entry point
setup-frame.sh  ADB script to configure the Frameo device as a kiosk
```

## Deploy

```bash
vercel deploy --prod
```

API routes are served locally by `vercel dev` on port 3000, so no separate server is needed during development.

## Environment variables

| Variable | Description |
|---|---|
| `CALENDAR_URLS` | Comma-separated list of `.ics` feed URLs to display upcoming events |

Set these in the Vercel dashboard under Project Settings > Environment Variables.

## Frame setup

Run the setup script once with your deployed URL to configure the Frameo device via ADB:

```bash
./setup-frame.sh https://your-deployment.vercel.app
```

The script:

1. Connects to the frame over USB
2. Sets screen to always-on while charging
3. Disables animations
4. Maximizes brightness
5. Launches the dashboard in the browser in immersive fullscreen
6. Switches ADB to WiFi so the USB cable can be removed

Requires `adb` - install with `brew install android-platform-tools`.
