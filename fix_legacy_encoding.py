from pathlib import Path

FILES = [
    Path("docs/travel-s-diary/march-current-month.md"),
    Path("docs/travel-s-diary/october.md"),
    Path("docs/regions/nersand/nersand.md"),
    Path("docs/regions/nevington-mountains/kor-thurim.md"),
]

for path in FILES:
    raw = path.read_bytes()

    # These files contain legacy Windows-1252 bytes.
    text = raw.decode("cp1252")

    # Replace non-breaking spaces with normal spaces.
    text = text.replace("\u00a0", " ")

    # Save as proper UTF-8.
    path.write_text(
        text,
        encoding="utf-8",
        newline="",
    )

    print(f"Converted: {path}")