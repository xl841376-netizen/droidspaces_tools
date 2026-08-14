#!/bin/sh
# droidspaces_tools build: regenerate .toolpkg from source files
set -e
cd "$(dirname "$0")"
VERSION=$(python3 -c "import json; print(json.load(open(\"manifest.json\"))[\"version\"])")
OUT="droidspaces_tools-v${VERSION}.toolpkg"
[ -f "$OUT" ] && rm -f "$OUT"
python3 - "$OUT" << "PYEOF"
import zipfile, os, sys
out = sys.argv[1]
files = []
for root, dirs, fs in os.walk("."):
    if ".git" in root:
        continue
    for f in fs:
        if f.endswith(".toolpkg") or f in ("README.md", ".gitignore", "build.sh"):
            continue
        p = os.path.join(root, f)
        files.append((p, os.path.relpath(p, ".")))
zf = zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED)
for full, rel in files:
    zf.write(full, rel)
zf.close()
print(f"BUILD_OK: {out} ({len(files)} files, {os.path.getsize(out)} bytes)")
PYEOF
