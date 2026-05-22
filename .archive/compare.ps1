$source = "C:\Users\maxr1\OneDrive\Desktop\copia\PrograIV-Semi-2026"
$target = "C:\Users\maxr1\OneDrive\Desktop\antig\PrograIV-semi-2026"

$files = Get-ChildItem -Path $source -Recurse -File | Where-Object {
    $_.FullName -notmatch "\\(vendor|node_modules|\.git)\\"
}

$diffList = @()
$diffList += "--- Missing or modified in target ($target) compared to source ($source) ---"

foreach ($file in $files) {
    $relPath = $file.FullName.Substring($source.Length + 1)
    $targetPath = Join-Path $target $relPath
    
    if (-not (Test-Path $targetPath)) {
        $diffList += "MISSING: $relPath"
    } else {
        $hash1 = (Get-FileHash $file.FullName).Hash
        $hash2 = (Get-FileHash $targetPath).Hash
        if ($hash1 -ne $hash2) {
            $diffList += "MODIFIED: $relPath"
        }
    }
}
$diffList | Out-File "differences.txt"
Write-Host "Done"
