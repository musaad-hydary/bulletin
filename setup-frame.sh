#!/usr/bin/env bash
# setup-frame.sh — ADB setup for Frameo DPF ZC002 kiosk dashboard
# Usage: ./setup-frame.sh https://your-dashboard.vercel.app

set -e

DASHBOARD_URL="${1}"

if [ -z "$DASHBOARD_URL" ]; then
  echo "Usage: ./setup-frame.sh <dashboard-url>"
  echo "Example: ./setup-frame.sh https://my-frame.vercel.app"
  exit 1
fi

echo "================================================"
echo "  Frame Dashboard — ADB Kiosk Setup"
echo "================================================"
echo "  URL: $DASHBOARD_URL"
echo ""

# 1. Verify ADB
if ! command -v adb &>/dev/null; then
  echo "ERROR: adb not found. Install: brew install android-platform-tools"
  exit 1
fi

# 2. Wait for USB device
echo "Waiting for device (plug in USB and tap 'Allow' on frame)..."
adb wait-for-device

DEVICE=$(adb devices | awk '/device$/{print $1; exit}')
if [ -z "$DEVICE" ]; then
  echo "ERROR: No authorized device found."
  echo "  → Make sure ADB is ON in frame Settings → About → ADB access"
  exit 1
fi
echo "Connected: $DEVICE"
echo ""

# 3. Screen always-on while charging
echo "[1/5] Setting screen to always-on while plugged in..."
adb shell settings put system screen_off_timeout 2147483647
adb shell settings put global stay_on_while_plugged_in 3

# 4. Disable animations for snappier UI
echo "[2/5] Disabling animations..."
adb shell settings put global window_animation_scale 0.0
adb shell settings put global transition_animation_scale 0.0
adb shell settings put global animator_duration_scale 0.0

# 5. Set max brightness
echo "[3/5] Maximizing brightness..."
adb shell settings put system screen_brightness 255
adb shell settings put system screen_brightness_mode 0  # manual

# 6. Find browser
echo "[4/5] Locating browser..."
BROWSER=""
for PKG in com.android.chrome com.google.android.apps.chrome org.chromium.chrome \
           com.sec.android.app.sbrowser com.android.browser; do
  if adb shell pm list packages 2>/dev/null | grep -q "$PKG"; then
    BROWSER="$PKG"
    echo "       Found: $PKG"
    break
  fi
done

# 7. Launch dashboard
echo "[5/5] Launching dashboard..."
if [ "$BROWSER" = "com.android.chrome" ] || [ "$BROWSER" = "com.google.android.apps.chrome" ]; then
  adb shell am start -n "$BROWSER/com.google.android.apps.chrome.Main" \
    -a android.intent.action.VIEW -d "$DASHBOARD_URL" 2>/dev/null || \
  adb shell am start -a android.intent.action.VIEW -d "$DASHBOARD_URL"
else
  adb shell am start -a android.intent.action.VIEW -d "$DASHBOARD_URL"
fi

sleep 2

# 8. Immersive fullscreen (hides navigation/status bars)
echo "Enabling immersive fullscreen..."
adb shell settings put global policy_control "immersive.full=*"

# 9. Enable WiFi ADB so USB can be removed
echo ""
echo "Switching to WiFi ADB (so you can unplug the cable)..."
adb tcpip 5555

FRAME_IP=$(adb shell ip route 2>/dev/null | awk '/wlan/{print $NF; exit}')
if [ -n "$FRAME_IP" ]; then
  echo ""
  echo "Frame IP: $FRAME_IP"
  echo "To reconnect wirelessly:"
  echo "  adb connect ${FRAME_IP}:5555"
else
  echo "Could not detect IP. Find it in frame Settings → Wi-Fi → tap your network."
  echo "Then run: adb connect <IP>:5555"
fi

echo ""
echo "================================================"
echo "  Done! Dashboard should be running."
echo "================================================"
echo ""
echo "Tips:"
echo "  • If Frameo reopens on reboot, install 'Autostart' or 'Tasker' via"
echo "    adb to launch the browser on boot."
echo "  • To suppress Frameo auto-launch:"
echo "    adb shell pm disable-user --user 0 net.frameo.app"
echo "  • To re-enable Frameo:"
echo "    adb shell pm enable net.frameo.app"
echo ""
