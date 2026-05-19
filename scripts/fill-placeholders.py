#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Fill all ph-visual placeholders in product detail pages with real images.
Run from project root. Reads/writes UTF-8 explicitly (no PowerShell cp949 mojibake).
"""
import re
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ph-visual block pattern (single line; matches both .ph-visual and .ph-visual--dark)
PATTERN = re.compile(
    r'<div class="ph-visual(?:--[a-z]+)?">'
    r'<div class="ph-visual__inner">'
    r'<span class="ph-visual__label">[^<]*</span>'
    r'<div class="ph-visual__caption">[^<]*</div>'
    r'</div></div>'
)

# Ordered list of replacement images per file.
# None = leave placeholder in place (e.g., real SEM sample shot still missing).
mappings = {
    'products/rs-tf/index.html': [
        'RS-TF.jpg',          # 01 AUTO WD CONTROL
        'RS-TF-side.png',     # 02 STAGE-INTEGRATED FTM
        'RS-TF-shutter.png',  # 03 ACTIVE SHUTTER
        'RS-TF.jpg',          # 04 PLANETARY ROTATION
    ],
    'products/rs-carbon/index.html': [
        'RS-Carbon.jpg', 'RS-Carbon.jpg', 'RS-Carbon.jpg', 'RS-Carbon.jpg',
    ],
    'products/smc-10g/index.html': [
        'SMC-10G.png',     # 01 APC + NEEDLE VALVE
        'SMC-10G-alt.png', # 02 AUTO VACUUM MAINTENANCE
        'SMC-10G-web.png', # 03 DUAL-SYSTEM OPTION
    ],
    'products/smc-10s/index.html': [
        'SMC-10S.png',         # 01 COMPACT DESIGN
        'SMC-10S-render.png',  # 02 ONE-TOUCH AUTOMATION
        'SMC-10S-context.png', # 03 GLOVEBOX-COMPATIBLE
        'SMC-10S.png',         # 04 STORAGE OPTION
    ],
    'products/smc-15e/index.html': [
        'SMC-15E.png',        # 01 UPWARD DEPOSITION
        'SMC-15E-cover.png',  # 02 FLASH + PULSED MODE
        'SMC-15E-angle.png',  # 03 THICKNESS-MONITORED
    ],
    'products/smc-15s/index.html': [
        'SMC-15S.png',        # 01 FTM-INTEGRATED STAGE
        'SMC-15S-cover.png',  # 02 RAPID COATING MODE
        'SMC-15S-alt.png',    # 03 HEAT-DAMAGE PREVENTION
    ],
    'products/smc-22ts/index.html': [
        'SMC-22TS.png',         # 01 ONE-STEP MULTILAYER
        'SMC-22TS-rotate.png',  # 02 3D SAMPLE COATING
        'SMC-22TS-photo.jpg',   # 03 UNIFORM LARGE-AREA
    ],
    'products/soc-12f/index.html': [
        'SOC-12F.png',                # 01 FUME AUTO SAMPLE EXCHANGE
        'SOC-feature-block.png',      # 02 GAS LEAK PREVENTION (DIAGRAM)
        None,                          # fibril SEM caption — keep placeholder
        'SOC-12F.png',                # 05 INTEGRATED GLOW DISCHARGE
    ],
    'products/soc-12n/index.html': [
        'SOC-feature-cartridge.png',  # 01 SEALED AMPOULE CARTRIDGE
        'SOC-12N.png',                # 02 FLASH MODE + CVD
        'SOC-12N-side.png',           # 03 AUXILIARY CHAMBER
    ],
}

def fill(fpath, imgs):
    full = os.path.join(ROOT, fpath)
    with open(full, 'r', encoding='utf-8') as f:
        content = f.read()
    idx = [0]
    def repl(m):
        i = idx[0]; idx[0] += 1
        if i >= len(imgs) or imgs[i] is None:
            return m.group(0)
        img = imgs[i]
        alt = img.rsplit('.', 1)[0]
        return (f'<img src="/assets/products/{img}" alt="{alt}" '
                f'style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;">')
    new_content, n_subs = PATTERN.subn(repl, content)
    n_used = sum(1 for x in imgs if x is not None)
    if new_content != content:
        with open(full, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'  {fpath}: {n_subs} placeholders found, {n_used} replaced')
    else:
        print(f'  {fpath}: no change ({n_subs} placeholders found)')

if __name__ == '__main__':
    print(f'ROOT={ROOT}')
    for fpath, imgs in mappings.items():
        fill(fpath, imgs)
    print('done.')
