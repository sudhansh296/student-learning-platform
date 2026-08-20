# Generate PostgreSQL tutorial from MongoDB template
Write-Host "Generating PostgreSQL tutorial from MongoDB template..." -ForegroundColor Cyan

# 1. Copy curriculum
Write-Host "Creating PostgreSQL curriculum..." -ForegroundColor Yellow
Copy-Item "src\data\mongodb-curriculum.ts" "src\data\postgresql-curriculum.ts"
(Get-Content "src\data\postgresql-curriculum.ts" -Raw) `
  -replace 'Mongodb','Postgresql' `
  -replace 'mongodb','postgresql' `
  -replace '#00ED64','#336791' `
  -replace 'Documents & Collections','Tables & Relations' `
  -replace 'NoSQL Database','Relational Database' `
  | Set-Content "src\data\postgresql-curriculum.ts" -NoNewline

# 2. Create lessons directory
New-Item -ItemType Directory -Force -Path "src\data\postgresql-lessons" | Out-Null

# 3. Copy section renderer
Write-Host "Creating PostgreSQL section renderer..." -ForegroundColor Yellow
Copy-Item "src\components\mongodb\MongodbSectionRenderer.tsx" "src\components\postgresql\PostgresqlSectionRenderer.tsx" -Force
(Get-Content "src\components\postgresql\PostgresqlSectionRenderer.tsx" -Raw) `
  -replace 'Mongodb','Postgresql' `
  -replace 'mongodb','postgresql' `
  -replace '#00ED64','#336791' `
  | Set-Content "src\components\postgresql\PostgresqlSectionRenderer.tsx" -NoNewline

# 4. Copy lesson client
Write-Host "Creating PostgreSQL lesson client..." -ForegroundColor Yellow
Copy-Item "src\components\mongodb\MongodbLessonClient.tsx" "src\components\postgresql\PostgresqlLessonClient.tsx" -Force
(Get-Content "src\components\postgresql\PostgresqlLessonClient.tsx" -Raw) `
  -replace 'Mongodb','Postgresql' `
  -replace 'mongodb','postgresql' `
  -replace 'MongoDB','PostgreSQL' `
  -replace '#00ED64','#336791' `
  -replace '#001E2B','#003d5c' `
  | Set-Content "src\components\postgresql\PostgresqlLessonClient.tsx" -NoNewline

# 5. Create route
Write-Host "Creating PostgreSQL route..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "src\app\learn\postgresql\[lesson]" | Out-Null
Copy-Item "src\app\learn\mongodb\[lesson]\page.tsx" "src\app\learn\postgresql\[lesson]\page.tsx" -Force
(Get-Content "src\app\learn\postgresql\[lesson]\page.tsx" -Raw) `
  -replace 'Mongodb','Postgresql' `
  -replace 'mongodb','postgresql' `
  -replace 'MongoDB','PostgreSQL' `
  | Set-Content "src\app\learn\postgresql\[lesson]\page.tsx" -NoNewline

Write-Host "`n✅ Infrastructure created! Now generating 12 lesson files..." -ForegroundColor Green
Write-Host "Run: python generate_postgresql_lessons.py" -ForegroundColor Yellow
