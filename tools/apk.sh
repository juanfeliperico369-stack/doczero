#!/usr/bin/env bash
# Genera el APK de prueba (debug, instalable a mano) con Capacitor 7.
# Requiere: Node 20+, JDK 21, Android SDK (platforms;android-35 y build-tools;35.0.0) en ANDROID_HOME.
# Uso: ANDROID_HOME=~/android-sdk bash tools/apk.sh   → dist/DocElement-v<versión>.apk
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"; W="${APK_WORK:-$ROOT/dist/apk-work}"
export ANDROID_HOME="${ANDROID_HOME:-$HOME/android-sdk}"; export ANDROID_SDK_ROOT="$ANDROID_HOME"
VERSION="$(grep -o "VERSION: '[^']*'" "$ROOT/src/data.js" | cut -d"'" -f2)"
node "$ROOT/tools/build.mjs"
rm -rf "$W"; mkdir -p "$W"; cd "$W"
npm init -y >/dev/null
npm i --silent --no-audit --no-fund @capacitor/core@7 @capacitor/cli@7 @capacitor/android@7 @capacitor/share@7
mkdir -p www && cp -r "$ROOT/dist/web/." www/
npx cap init "Doc Element" com.infinitetree.docelement --web-dir www
npx cap add android
python3 "$ROOT/tools/apk_patch.py" "$W/android" "$ROOT/assets" "$VERSION"
npx cap sync android
cd android && ./gradlew --no-daemon -q --max-workers=2 --init-script "$ROOT/tools/gradle-mirror.gradle" assembleDebug
cp app/build/outputs/apk/debug/app-debug.apk "$ROOT/dist/DocElement-v$VERSION.apk"
echo "APK listo: dist/DocElement-v$VERSION.apk"
