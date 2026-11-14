# Bulletin

A minimal dashboard designed to run fullscreen on a Frameo digital photo frame (or any Android display). Deployed on Vercel, loaded in the frame's browser as a kiosk page.

## Features

- **Clock and date** - live 12-hour clock with day/month display
- **Greeting** - time-aware greeting (morning/afternoon/evening/night) with rotating emoticons
- **Auto theme** - switches between light and dark mode at 7am/7pm EST
- **Music** - top albums across Hip-Hop, Pop, and R&B; toggle between new releases (MusicBrainz) and charts (Deezer)
- **Calendar** - navigable monthly calendar with Canadian holidays highlighted; optionally shows upcoming events from any ICS feed

## Deploy

```bash
vercel deploy
```

The frontend proxies API calls to the live Vercel URL when running locally (`localhost`), so the dev experience requires no local server for the API routes.

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
