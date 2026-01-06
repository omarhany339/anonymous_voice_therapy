# Railway Deployment Guide

## Pre-Deployment Checklist

### Environment Variables

Ensure these are set in Railway:

```env
# Database
DATABASE_URL=mysql://user:password@host/database

# Session Secret (generate a random string)
JWT_SECRET=your-random-secret-key-here

# OAuth (optional, can be empty)
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_APP_ID=your-app-id

# Manus APIs
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your-api-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=your-frontend-key

# Paymob (for payments)
PAYMOB_API_KEY=your-paymob-key
PAYMOB_INTEGRATION_ID=your-integration-id

# App Info
VITE_APP_TITLE=صوت الراحة
VITE_APP_LOGO=/logo.png
OWNER_NAME=Your Name
OWNER_OPEN_ID=your-open-id

# Node Environment
NODE_ENV=production
PORT=3000
```

### Database Setup

1. Create MySQL database on Railway
2. Run migrations:
   ```bash
   pnpm db:push
   ```

## Deployment Steps

### 1. Push to GitHub

```bash
git add .
git commit -m "Production fixes: anonymous auth, secure sessions"
git push origin main
```

### 2. Deploy on Railway

Option A: Connect GitHub Repository
- Go to Railway.app
- Create new project
- Connect your GitHub repo
- Railway auto-deploys on push

Option B: Deploy via Railway CLI
```bash
railway login
railway link
railway up
```

### 3. Verify Deployment

1. Open your Railway app URL
2. Test authentication flow:
   - Visit home page
   - Should redirect to /app-auth
   - Should create session and redirect back
   - Should show authenticated UI

3. Check server logs:
   ```bash
   railway logs
   ```

4. Verify cookies:
   - DevTools → Application → Cookies
   - Should see session cookie with:
     - Secure flag ✓
     - HttpOnly flag ✓
     - SameSite=lax ✓

## Troubleshooting

### Issue: Users stuck on /app-auth

**Solution:**
1. Check DATABASE_URL is correct
2. Check JWT_SECRET is set
3. Check server logs for errors:
   ```bash
   railway logs --tail
   ```

### Issue: Cookies not persisting

**Solution:**
1. Verify HTTPS is enforced
2. Check x-forwarded-proto header:
   ```bash
   railway logs | grep "x-forwarded-proto"
   ```
3. Verify sameSite=lax in cookies.ts

### Issue: 500 errors on /app-auth

**Solution:**
1. Check database connection:
   ```bash
   railway logs --tail
   ```
2. Verify JWT_SECRET is set
3. Check database has users table

## Monitoring

### Key Metrics to Watch

1. **Authentication Success Rate**
   - Monitor /app-auth requests
   - Should see 302 redirects (success)

2. **Session Duration**
   - Monitor cookie expiration
   - Should be 1 year

3. **Error Rate**
   - Monitor 500 errors on /app-auth
   - Should be near 0%

### Logs to Check

```bash
# Watch logs in real-time
railway logs --tail

# Search for auth errors
railway logs | grep "Auth"

# Search for session errors
railway logs | grep "Session"

# Search for cookie errors
railway logs | grep "Cookie"
```

## Rollback Plan

If deployment has issues:

1. **Quick Rollback**
   ```bash
   railway rollback
   ```

2. **Manual Rollback**
   - Go to Railway dashboard
   - Select previous deployment
   - Click "Redeploy"

3. **Emergency Fallback**
   - Keep old version running
   - Update DNS to point to old version
   - Investigate issues offline

## Post-Deployment

### 1. Test All Flows

- [ ] Anonymous login works
- [ ] Sessions persist
- [ ] Logout works
- [ ] Protected pages require auth
- [ ] Booking system works
- [ ] Payment system works

### 2. Monitor for 24 Hours

- [ ] No unusual error spikes
- [ ] Session creation working
- [ ] No redirect loops
- [ ] Cookies being set correctly

### 3. Set Up Alerts

- [ ] Alert on 500 errors
- [ ] Alert on high error rate
- [ ] Alert on deployment failures
- [ ] Alert on database connection issues

## Support

For issues:

1. Check Railway logs
2. Check browser console
3. Check database connection
4. Review PRODUCTION_FIXES.md
5. Contact support

---

**Last Updated:** January 2, 2025
**Status:** Production Ready ✅
