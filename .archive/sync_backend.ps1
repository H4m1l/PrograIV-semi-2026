$source = "C:\Users\maxr1\OneDrive\Desktop\copia\PrograIV-Semi-2026\academica"
$target = "C:\Users\maxr1\OneDrive\Desktop\antig\PrograIV-semi-2026\academica"

# List of missing Backend directories/files to copy from copia to my repo
$itemsToCopy = @(
    "app\Http\Controllers",
    "app\Models",
    "app\Providers",
    "app\Http\Middleware",
    "app\Exceptions",
    "app\Console",
    "config",
    "routes",
    "bootstrap",
    "database\migrations",
    "database\seeders\DatabaseSeeder.php",
    "database\factories\UserFactory.php",
    "tests"
)

foreach ($item in $itemsToCopy) {
    $srcPath = Join-Path $source $item
    $tgtPath = Join-Path $target $item

    if (Test-Path $srcPath) {
        if (-not (Test-Path $tgtPath)) {
            Copy-Item -Path $srcPath -Destination (Split-Path $tgtPath) -Recurse -Force
            Write-Host "Copied missing item: $item"
        } else {
            Copy-Item -Path "$srcPath\*" -Destination $tgtPath -Recurse -Force
            Write-Host "Overwrote item: $item"
        }
    }
}
Write-Host "Backend sync done"
