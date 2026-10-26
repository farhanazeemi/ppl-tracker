# Deployment script for PPL Tracker
# Pushes to GitHub and deploys to Vercel (Guarantees no secret files are pushed)

Write-Host ">>> Checking for any secret files..." -ForegroundColor Cyan

# Ensure .env* files are not tracked in git
$trackedSecrets = git ls-files "*secret*" "*token*" "*cred*" ".env*"
if ($trackedSecrets) {
    Write-Host "ERROR: Found secret files tracked in Git: $trackedSecrets" -ForegroundColor Red
    exit 1
}

Write-Host ">>> No secret files tracked. Proceeding to push to GitHub (main branch)..." -ForegroundColor Green
git push origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Git push failed." -ForegroundColor Red
    exit 1
}

Write-Host ">>> Git push successful! Now deploying to Vercel Production..." -ForegroundColor Green
vercel deploy --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host ">>> Deployment successfully pushed to GitHub and deployed on Vercel!" -ForegroundColor Green
} else {
    Write-Host "ERROR: Vercel deployment encountered an error." -ForegroundColor Red
    exit 1
}
