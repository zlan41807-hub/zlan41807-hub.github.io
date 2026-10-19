"""Rewrite the ?v= stamp on every stylesheet and script link.

Browsers reuse a cached stylesheet when the URL does not change, and this
project is previewed over a plain local server that sends no cache headers.
Running this script after any edit under assets/ gives every changed file a new
URL, so the browser must fetch it and the change is visible immediately.

Usage: python stamp_assets.py
"""

from __future__ import annotations

import hashlib
import re
import sys
from pathlib import Path

SITE = Path(__file__).resolve().parent
PAGES = sorted(p.name for p in SITE.glob("*.html"))
LINK = re.compile(r'((?:href|src)=")(/?)assets/([^"?]+\.(?:css|js))(\?v=[^"]*)?(")')


def stamps() -> dict[str, str]:
    out = {}
    for path in (SITE / "assets").rglob("*"):
        if path.suffix.lower() in {".css", ".js"} and path.is_file():
            rel = path.relative_to(SITE).as_posix()
            out[rel] = hashlib.sha1(path.read_bytes()).hexdigest()[:8]
    return out


def main() -> int:
    table = stamps()
    changed = 0
    unknown: set[str] = set()
    for name in PAGES:
        page = SITE / name
        if not page.exists():
            continue
        with open(page, encoding="utf-8", newline="") as fh:
            text = fh.read()

        def repl(m: re.Match[str]) -> str:
            prefix, slash, rel, _old, quote = m.groups()
            key = "assets/" + rel
            stamp = table.get(key)
            if stamp is None:
                unknown.add(rel)
                return m.group(0)
            return f"{prefix}{slash}{key}?v={stamp}{quote}"

        new = LINK.sub(repl, text)
        if new != text:
            with open(page, "w", encoding="utf-8", newline="") as fh:
                fh.write(new)
            changed += 1

    print(f"assets tracked: {len(table)} | pages rewritten: {changed}")
    if unknown:
        print("not found under assets/: " + ", ".join(sorted(unknown)))
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
