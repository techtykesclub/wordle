# Wordle Game - Production Deployment Guide

Complete guide to deploy both backend and frontend to Vercel with one-click setup.

## 🚀 Quick Deploy (Both Projects)

### Prerequisites

- GitHub account
- Vercel account
- OpenAI API key
- Firebase project with Firestore

### Step 1: Fork/Clone Repository

```bash
git clone https://github.com/yourusername/wordle-game.git
cd wordle-game
```

### Step 2: Deploy Backend

1. **Navigate to backend**:

   ```bash
   cd backend
   ```

2. **Deploy to Vercel**:

   ```bash
   vercel --prod
   ```

3. **Set Environment Variables** in Vercel Dashboard:

   - `OPENAI_API_KEY`: Your OpenAI API key
   - `FIREBASE_PROJECT_ID`: Your Firebase project ID
   - `FIREBASE_PRIVATE_KEY`: Your Firebase private key
   - `FIREBASE_CLIENT_EMAIL`: Your Firebase service account email
   - Copy other Firebase configs from your service account JSON

4. **Note your backend URL** (e.g., `https://your-backend.vercel.app`)

### Step 3: Deploy Frontend

1. **Navigate to frontend**:

   ```bash
   cd ../frontend
   ```

2. **Set environment variables** in `.env.production`:

   ```bash
   VITE_API_URL=https://your-backend.vercel.app
   ```

3. **Deploy to Vercel**:

   ```bash
   vercel --prod
   ```

4. **Set Environment Variables** in Vercel Dashboard:
   - `VITE_API_URL`: Your backend URL from Step 2

## 🔄 Alternative: GitHub Integration

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Initial deployment setup"
git push origin main
```

### Step 2: Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Import Project"
3. Select your GitHub repository
4. Deploy **backend first**, then **frontend**

### Step 3: Configure Environment Variables

Add the required environment variables in each project's settings.

## 📋 Environment Variables Checklist

### Backend (.env)

```bash
# Required
✅ OPENAI_API_KEY=sk-your-key
✅ FIREBASE_PROJECT_ID=your-project-id
✅ FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
✅ FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com

# Optional (with defaults)
CORS_ORIGINS=https://your-frontend.vercel.app
OPENAI_MODEL=gpt-4o
MAX_GUESSES=6
```

### Frontend (.env)

```bash
# Required
✅ VITE_API_URL=https://your-backend.vercel.app

# Optional (with defaults)
VITE_BASE_PATH=/
VITE_MAX_GUESSES=6
```

## 🧪 Testing Production Setup

### Test Backend

```bash
# Health check
curl https://your-backend.vercel.app/health

# Start game
curl -X POST https://your-backend.vercel.app/openai/start \
  -H "Content-Type: application/json"
```

### Test Frontend

1. Visit your frontend URL
2. Try starting a new game
3. Submit a guess
4. Request a hint

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**:

   - Add frontend URL to `CORS_ORIGINS` in backend
   - Ensure both projects are deployed

2. **API Not Found (404)**:

   - Check `VITE_API_URL` in frontend environment
   - Verify backend deployment succeeded

3. **OpenAI Errors**:

   - Verify API key is valid and has credits
   - Check OpenAI rate limits

4. **Firebase Errors**:
   - Ensure Firestore is enabled in Firebase Console
   - Check service account permissions
   - Verify private key format (keep \\n for newlines)

### Debug Steps

1. Check Vercel function logs in dashboard
2. Test API endpoints individually
3. Verify all environment variables are set
4. Check browser console for frontend errors

## 🚀 One-Click Deploy Buttons

### Backend Only

[![Deploy Backend](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/wordle-game/tree/main/backend&env=OPENAI_API_KEY,FIREBASE_PROJECT_ID,FIREBASE_PRIVATE_KEY,FIREBASE_CLIENT_EMAIL)

### Frontend Only

[![Deploy Frontend](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/wordle-game/tree/main/frontend&env=VITE_API_URL)

## 📊 Production Monitoring

### Backend Monitoring

- Monitor API response times in Vercel dashboard
- Track OpenAI API usage and costs
- Check Firebase Firestore read/write counts

### Frontend Monitoring

- Monitor Core Web Vitals
- Track user interactions and errors
- Monitor API call success rates

## 🔒 Security Checklist

- [ ] API keys are set as environment variables (never in code)
- [ ] CORS is configured for your frontend domain only
- [ ] Firebase security rules are configured
- [ ] Rate limiting is enabled (if needed)
- [ ] HTTPS is enforced on both frontend and backend

## 📚 Next Steps

After successful deployment:

1. Set up custom domains (optional)
2. Configure analytics (Google Analytics, etc.)
3. Set up monitoring and alerts
4. Configure CI/CD for automatic deployments
5. Add error tracking (Sentry, LogRocket, etc.)

---

✅ **Your Wordle game is now production-ready!**
