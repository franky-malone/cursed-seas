from pathlib import Path

DOCS = Path("docs")

# Only patterns whose intended character is clear.
REPLACEMENTS = {
    "\ufffd\u20ac\u2122": "\u2019",  # ’
    "\ufffd\u20ac\u0153": "\u201c",  # “
    "\ufffd\u20ac?": "\u201d",       # ”
    "\ufffd\u20ac\u201d": "\u2014",  # —
    "\ufffd\u20ac\u201c": "\u2013",  # –

    # Second pass
    "\ufffd\u20ac\ufffd": "\u2026",  # …
    "\ufffd\u20ac\u2039": "",        # broken zero-width space
}

changed_files = []

for path in DOCS.rglob("*"):
    if path.suffix.lower() not in {".md", ".mdx"}:
        continue

    raw = path.read_bytes()

    # Skip files that aren't valid UTF-8.
    # We'll repair those separately.
    try:
        text = raw.decode("utf-8-sig")
    except UnicodeDecodeError:
        continue

    original = text

    for bad, good in REPLACEMENTS.items():
        text = text.replace(bad, good)

    if text != original:
        # UTF-8, no BOM
        path.write_text(text, encoding="utf-8", newline="")
        changed_files.append(path)

print()
print("FILES CHANGED:")
print("=" * 60)

for path in changed_files:
    print(path)

print()
print(f"Total: {len(changed_files)} files")