#!/usr/bin/env python3
"""Restore the obfuscated sprites in data/gfx.

The game overwrote the first 30 little-endian u32 words (120 bytes) of each file
listed in script_initialize_game.gml and stored the originals, in list order, in
data/gfx/burak_rzucony.jpg. Plain .png/.jpg files are copied unchanged.
"""
import re
import shutil
import sys
from pathlib import Path

RECORD = 30 * 4
MAGIC = (b"\x89PNG\r\n\x1a\n", b"\xff\xd8\xff")


def coded_list(script: Path) -> list[str]:
    names = []
    skip_next = False
    for line in script.read_text(errors="replace").splitlines():
        m = re.match(r'\s*codingfx\[fif\]="\./data/gfx/([^"]+)"\s*;\s*fif\+=\s*(1?)', line)
        if not m:
            continue
        if not skip_next:
            names.append(m.group(1))
        # "fif+=" with no operand swallows the next assignment as a comparison (adds 0).
        skip_next = m.group(2) == ""
    return names


def main() -> None:
    gfx, script, out = (Path(p) for p in sys.argv[1:4])
    out.mkdir(parents=True, exist_ok=True)
    key = (gfx / "burak_rzucony.jpg").read_bytes()
    names = coded_list(script)
    restored, bad = {}, []
    for i, name in enumerate(names):
        header = key[i * RECORD:(i + 1) * RECORD]
        data = header + (gfx / name).read_bytes()[RECORD:]
        if not data.startswith(MAGIC):
            bad.append(name)
            continue
        restored[name] = data
    # The game loads every restored file as "<name>.png", even the JPEG ones.
    for name, data in restored.items():
        (out / (name + ".png")).write_bytes(data)
    coded = set(names)
    plain = 0
    for f in gfx.iterdir():
        if f.name in coded or f.name == "burak_rzucony.jpg" or not f.suffix:
            continue
        shutil.copy2(f, out / f.name)
        plain += 1
    leftovers = sorted(f.name for f in gfx.iterdir() if not f.suffix and f.name not in coded)
    print(f"list entries={len(names)} restored={len(restored)} plain={plain} bad={bad} unlisted={leftovers}")


if __name__ == "__main__":
    main()
