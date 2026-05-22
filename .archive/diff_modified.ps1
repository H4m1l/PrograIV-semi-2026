$source = "C:\Users\maxr1\OneDrive\Desktop\copia\PrograIV-Semi-2026"
$target = "C:\Users\maxr1\OneDrive\Desktop\antig\PrograIV-semi-2026"

$modifiedFiles = @(
    "academica\.env",
    "academica\package.json",
    "academica\vite.config.js",
    "academica\app\Http\Controllers\Controller.php",
    "academica\app\Models\User.php",
    "academica\bootstrap\app.php",
    "academica\config\app.php",
    "academica\config\cors.php",
    "academica\public\index.php",
    "academica\resources\js\app.js",
    "academica\resources\views\welcome.blade.php",
    "academica\routes\web.php",
    "academica\server\server.js"
)

foreach ($file in $modifiedFiles) {
    $srcFile = Join-Path $source $file
    $tgtFile = Join-Path $target $file
    if ((Test-Path $srcFile) -and (Test-Path $tgtFile)) {
        git diff --no-index $srcFile $tgtFile | Out-File -Append -Encoding utf8 "modified_diffs.txt"
    }
}
Write-Host "Done"
