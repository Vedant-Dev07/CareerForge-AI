@echo off
echo Installing dependencies...
call npm install
echo.

echo Generating Prisma Client...
call npx prisma generate
echo.

echo Checking Migration Status...
call npx prisma migrate status
echo.

echo Creating Phase 3 Migration...
call npx prisma migrate dev --name phase3_resume_analyzer
echo.

echo Running TypeScript verification...
call npx tsc --noEmit
echo.

echo Running Production Build...
call npm run build
echo.

echo Pushing to GitHub...
call git add .
call git commit -m "feat: complete Phase 3 Resume Analyzer"
call git push
echo.

echo All done! You can now run "npm run dev" to test the UI.
pause
