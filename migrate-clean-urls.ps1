
param(
    [switch]$Apply
)

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$utf8 = [System.Text.UTF8Encoding]::new($false)

# Only process project files, never generated files or dependencies.
$targets = @(
    "docs",
    "src",
    "static",
    "sidebars.js"
)

$extensions = @(".md", ".mdx", ".js", ".jsx", ".ts", ".tsx", ".json", ".css", ".html")
$files = @()

foreach ($target in $targets) {
    $path = Join-Path $root $target
    if (-not (Test-Path $path)) { continue }

    if (Test-Path $path -PathType Leaf) {
        $files += Get-Item $path
    } else {
        $files += Get-ChildItem $path -Recurse -File |
            Where-Object { $_.Extension -in $extensions }
    }
}

$changed = 0

foreach ($file in $files) {
    $original = [System.IO.File]::ReadAllText($file.FullName)

    # Change only absolute documentation URL prefixes.
    # Preserve relative paths and unrelated URLs.
    $updated = $original.Replace(
        "/cursed-seas/docs/",
        "/cursed-seas/"
    )

    $updated = $updated.Replace(
        "/docs/",
        "/"
    )

    # Handle exact /docs URLs (without trailing slash).
    $updated = [regex]::Replace(
        $updated,
        '(?<=["''])/docs(?=["''])',
        '/'
    )

    if ($updated -cne $original) {
        $changed++
$relative = $file.FullName.Substring($root.Length).TrimStart('\')
        Write-Host "UPDATE: $relative" -ForegroundColor Yellow

        if ($Apply) {
            [System.IO.File]::WriteAllText(
                $file.FullName,
                $updated,
                $utf8
            )
        }
    }
}

Write-Host ""
Write-Host "Files requiring changes: $changed"

if ($Apply) {
    Write-Host "Changes applied." -ForegroundColor Green
} else {
    Write-Host "Preview only. Run with -Apply to modify files." -ForegroundColor Cyan
}
