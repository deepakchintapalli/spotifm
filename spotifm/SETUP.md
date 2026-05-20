# spotifm — Setup Guide

## 1. Spotify Developer Setup
1. Go to https://developer.spotify.com/dashboard
2. Create a new app
3. Set Redirect URI: `http://localhost:3000/api/auth/callback/spotify`
4. Copy Client ID and Client Secret

## 2. Environment Variables
Copy `.env.example` to `.env.local`:
```
DATABASE_URL="postgresql://user:pass@localhost:5432/spotifm"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
SPOTIFY_CLIENT_ID="your_client_id"
SPOTIFY_CLIENT_SECRET="your_client_secret"
```

## 3. Database
```bash
npx prisma db push
```

## 4. Run
```bash
npm run dev
```

## Vercel Deployment
1. Push to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard
4. Update Spotify Redirect URI to your production URL
