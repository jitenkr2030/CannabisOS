# CannabisOS Environment Variables

## Production Environment Variables (Add to Vercel)

### Authentication Configuration
```
JWT_SECRET=cannabisos-jwt-secret-key-2024-production-grade-secure-32-character-key
NEXTAUTH_URL=https://cannabis-bpfjgn1gj-jiten-kumars-projects.vercel.app
NEXTAUTH_SECRET=cannabisos-nextauth-secret-2024-production-grade-secure-key
```

### Database Configuration (Already in Vercel)
```
DATABASE_URL=postgresql://neondb_owner:npg_Lyxz26cWFNUb@ep-little-dust-ains7d8e-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
PGDATABASE=neondb
POSTGRES_URL_NON_POOLING=postgresql://...
POSTGRES_USER=neondb_owner
PGHOST=ep-little-dust-ains7d8e-pooler.c-4.us-east-1.aws.neon.tech
NEON_PROJECT_ID=...
```

### Application Configuration
```
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://cannabis-bpfjgn1gj-jiten-kumars-projects.vercel.app
```

## Testing Environment Variables
Same as production but can use different URLs if needed.

## Local Development (.env)
```
DATABASE_URL="postgresql://neondb_owner:npg_Lyxz26cWFNUb@ep-little-dust-ains7d8e-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
JWT_SECRET="cannabisos-jwt-secret-key-2024-production-grade-secure-32-character-key"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="cannabisos-nextauth-secret-2024-production-grade-secure-key"
```

## Critical Notes

1. **JWT_SECRET**: Must be the same across all environments for token validation
2. **NEXTAUTH_URL**: Must match the deployment URL exactly
3. **NEXTAUTH_SECRET**: Used for NextAuth session encryption
4. **DATABASE_URL**: PostgreSQL connection string (not SQLite anymore)

## Verification Steps

After adding environment variables:

1. Test login: `POST /api/auth/login`
2. Test manifest: `GET /manifest.json` 
3. Test icons: `GET /icons/icon-192x192.png`
4. Test PWA installation

## Expected Results

Before fixes:
```
❌ 503 Service Unavailable (auth)
❌ 401 Unauthorized (static assets)
❌ 404 Not Found (icons)
```

After fixes:
```
✅ 200/401/400 (proper auth responses)
✅ 200 (manifest loads)
✅ 200 (icons load)
✅ Login works with admin@cannabisos.com / demo123
```