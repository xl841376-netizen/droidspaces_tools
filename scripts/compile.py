#!/usr/bin/env python3
"""
droidspaces_tools build script.
Currently: copies the primary JS source to output location.
The JS file in packages/ is the authoritative source (ES5/QuickJS-compatible).
The file in src/packages/ is a TypeScript reference with JSDoc types.
"""

import sys, os, shutil

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    src = os.path.join(script_dir, '..', 'packages', 'droidspaces.js')
    
    if len(sys.argv) >= 2:
        dst = sys.argv[1]
    else:
        dst = src  # no-op
    
    if not os.path.exists(src):
        print(f'Error: source not found: {src}')
        sys.exit(1)
    
    if dst != src:
        shutil.copy(src, dst)
    
    size = os.path.getsize(src)
    print(f'Build OK: {src} ({size} bytes)')
    
    # Validate
    with open(src, 'r') as f:
        content = f.read()
    
    checks = [
        ('METADATA block', 'METADATA' in content),
        ('*/ closer', '*/' in content),
        ('ctExec function', 'async function ctExec' in content),
        ('exec_code tool', 'execCodeTool' in content),
        ('Droidspaces object', 'var Droidspaces' in content),
        ('exports', 'exports.exec_code' in content),
    ]
    
    all_ok = True
    for name, ok in checks:
        status = 'OK' if ok else 'MISSING!'
        if not ok: all_ok = False
        print(f'  [{status}] {name}')
    
    return 0 if all_ok else 1

if __name__ == '__main__':
    sys.exit(main())