# Ajusta el proyecto Android de Capacitor: horizontal, cámara (QR del modo LAN), íconos, pantalla de inicio y versión.
import sys, os, re, glob
from PIL import Image
android, assets, version = sys.argv[1], sys.argv[2], sys.argv[3]
man = os.path.join(android, 'app/src/main/AndroidManifest.xml'); s = open(man, encoding='utf-8').read()
s = re.sub(r'(<activity\b)', r'\1 android:screenOrientation="sensorLandscape"', s, count=1)
s = s.replace('</manifest>', '    <uses-permission android:name="android.permission.CAMERA" />\n    <uses-feature android:name="android.hardware.camera" android:required="false" />\n</manifest>')
open(man, 'w', encoding='utf-8').write(s)
res = os.path.join(android, 'app/src/main/res')
icon = Image.open(os.path.join(assets, 'icon-512.png')).convert('RGB'); mask = Image.open(os.path.join(assets, 'icon-maskable-512.png')).convert('RGB')
for d, px in {'mdpi': 48, 'hdpi': 72, 'xhdpi': 96, 'xxhdpi': 144, 'xxxhdpi': 192}.items():
    folder = os.path.join(res, 'mipmap-' + d); os.makedirs(folder, exist_ok=True)
    icon.resize((px, px), Image.LANCZOS).save(os.path.join(folder, 'ic_launcher.png'))
    icon.resize((px, px), Image.LANCZOS).save(os.path.join(folder, 'ic_launcher_round.png'))
    fg = int(px * 108 / 48); mask.resize((fg, fg), Image.LANCZOS).save(os.path.join(folder, 'ic_launcher_foreground.png'))
for f in glob.glob(os.path.join(res, 'values*/ic_launcher_background.xml')):
    open(f, 'w').write('<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#000000</color>\n</resources>\n')
for f in glob.glob(os.path.join(res, 'drawable*/splash.png')):
    w, h = Image.open(f).size; im = Image.new('RGB', (w, h), (0, 0, 0)); k = int(min(w, h) * .38)
    im.paste(icon.resize((k, k), Image.LANCZOS), ((w - k) // 2, (h - k) // 2)); im.save(f)
g = os.path.join(android, 'app/build.gradle'); t = open(g, encoding='utf-8').read()
t = re.sub(r'versionName "[^"]*"', 'versionName "%s"' % version, t)
t = re.sub(r'versionCode \d+', 'versionCode %d' % int(version.replace('.', '')), t)
open(g, 'w', encoding='utf-8').write(t)
print('android parcheado', version)
