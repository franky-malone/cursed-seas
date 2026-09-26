from pathlib import Path
from collections import Counter

DOCS = Path("docs")

invalid_utf8 = []
replacement_chars = []
patterns = Counter()

for path in DOCS.rglob("*"):
    if path.suffix.lower() not in {".md", ".mdx"}:
        continue

    raw = path.read_bytes()

    # ------------------------------------------
    # 1. Check whether the file is valid UTF-8
    # ------------------------------------------

    try:
        text = raw.decode("utf-8")

    except UnicodeDecodeError as error:
        invalid_utf8.append(
            (
                str(path),
                error.start,
                raw[error.start],
            )
        )

        # Don't analyze this file as UTF-8 yet
        continue

    # ------------------------------------------
    # 2. Find Unicode replacement characters
    # ------------------------------------------

    if "\uFFFD" in text:

        lines = text.splitlines()

        for number, line in enumerate(lines, start=1):

            if "\uFFFD" not in line:
                continue

            replacement_chars.append(
                (
                    str(path),
                    number,
                    line.strip(),
                )
            )

            # Collect small patterns around  
            positions = [
                i
                for i, char in enumerate(line)
                if char == "\uFFFD"
            ]

            for position in positions:

                start = max(0, position - 2)
                end = min(
                    len(line),
                    position + 5,
                )

                patterns[
                    line[start:end]
                ] += 1


print()
print("=" * 70)
print("FILES THAT ARE NOT VALID UTF-8")
print("=" * 70)

if not invalid_utf8:
    print("None")
else:
    for path, offset, byte in invalid_utf8:
        print(
            f"{path}"
            f" | offset {offset}"
            f" | byte 0x{byte:02X}"
        )


print()
print("=" * 70)
print("FILES CONTAINING THE REPLACEMENT CHARACTER")
print("=" * 70)

if not replacement_chars:
    print("None")
else:
    for path, line, context in replacement_chars:
        print()
        print(f"{path}:{line}")
        print(context)


print()
print("=" * 70)
print("MOST COMMON CORRUPTED PATTERNS")
print("=" * 70)

for pattern, count in patterns.most_common():
    print(f"{count:4}  {repr(pattern)}")