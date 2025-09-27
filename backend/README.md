# Wordle Game Backend

AI-powered adaptive word game backend built with Express.js, OpenAI, and Firebase. Designed for serverless deployment on Vercel.

## 🚀 Features

- **AI-Powered Word Generation**: Uses OpenAI GPT-4 to generate age-appropriate words
- **Smart Hints**: Context-aware hints that adapt to difficulty level
- **Word Tracking**: Prevents word repetition with Firebase storage
- **Kid-Friendly**: Built-in content filtering and age-appropriate vocabulary
- **Serverless**: Optimized for Vercel deployment

## 📋 Prerequisites

- Node.js 16+ and npm
- OpenAI API account and API key
- Firebase project with Firestore enabled
- Vercel account (for deployment)

## 🛠️ Local Development Setup

### 1. Environment Setup

```bash
# Clone and navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env` with your actual values:

```bash
# Required - OpenAI
OPENAI_API_KEY=sk-your-actual-openai-key

# Required - Firebase (get from Firebase Console > Project Settings > Service Accounts)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id

# Optional - CORS (add your frontend URLs)
CORS_ORIGINS=http://localhost:5173,http://localhost:5174,https://your-frontend.vercel.app
FRONTEND_URL=https://your-frontend.vercel.app
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or select existing
3. Enable Firestore Database
4. Go to Project Settings > Service Accounts
5. Generate new private key and download JSON
6. Copy values to your `.env` file

### 4. Run Locally

```bash
# Development server (with hot reload)
npm run dev

# Production mode locally
npm start
```

Server runs on `http://localhost:8080`

## 🌐 Production Deployment on Vercel

### Option 1: One-Click Deploy (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/your-repo&env=OPENAI_API_KEY,FIREBASE_PROJECT_ID,FIREBASE_PRIVATE_KEY,FIREBASE_CLIENT_EMAIL)

### Option 2: Manual Deployment

1. **Install Vercel CLI**:

   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:

   ```bash
   vercel login
   ```

3. **Deploy**:

   ```bash
   # From backend directory
   vercel --prod
   ```

4. **Set Environment Variables** in Vercel Dashboard:
   - Go to your project in Vercel Dashboard
   - Navigate to Settings > Environment Variables
   - Add all variables from `.env.example`

### Option 3: GitHub Integration

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Import Project" and select your GitHub repo
4. Vercel will auto-detect the configuration
5. Add environment variables in project settings

## 🔧 Configuration

### Environment Variables

| Variable                | Required | Default                         | Description                          |
| ----------------------- | -------- | ------------------------------- | ------------------------------------ |
| `OPENAI_API_KEY`        | ✅       | -                               | OpenAI API key for word generation   |
| `FIREBASE_PROJECT_ID`   | ✅       | -                               | Firebase project ID                  |
| `FIREBASE_PRIVATE_KEY`  | ✅       | -                               | Firebase service account private key |
| `FIREBASE_CLIENT_EMAIL` | ✅       | -                               | Firebase service account email       |
| `OPENAI_MODEL`          | ❌       | `gpt-4o`                        | OpenAI model to use                  |
| `MAX_GUESSES`           | ❌       | `6`                             | Maximum guesses per game             |
| `MIN_WORD_LENGTH`       | ❌       | `4`                             | Minimum word length                  |
| `MAX_WORD_LENGTH`       | ❌       | `5`                             | Maximum word length                  |
| `TARGET_AGE_MIN`        | ❌       | `8`                             | Minimum target age                   |
| `TARGET_AGE_MAX`        | ❌       | `13`                            | Maximum target age                   |
| `WORD_BLOCKLIST`        | ❌       | `death,crime,blood,ghost,scary` | Comma-separated blocked words        |
| `CORS_ORIGINS`          | ❌       | Auto-configured                 | Comma-separated allowed origins      |
| `FRONTEND_URL`          | ❌       | -                               | Production frontend URL              |

### API Endpoints

- **GET** `/health` - Health check
- **POST** `/openai/start` - Start new game
- **POST** `/openai/guess` - Submit guess
- **POST** `/openai/hint` - Get hint
- **POST** `/openai/reset` - Reset game
- **POST** `/openai/unscramble` - Get unscramble challenge

## 📱 Usage

### Start New Game

```javascript
fetch("/openai/start", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
});
```

### Submit Guess

```javascript
fetch("/openai/guess", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    gameId: "game-id",
    guess: "HELLO",
  }),
});
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**:

   - Add your frontend URL to `CORS_ORIGINS`
   - Ensure environment variables are set in Vercel

2. **Firebase Errors**:

   - Check Firebase private key format (keep \\n for newlines)
   - Ensure Firestore is enabled
   - Verify service account permissions

3. **OpenAI Errors**:

   - Verify API key is valid and has credits
   - Check rate limits
   - Ensure model is available

4. **Deployment Issues**:
   - Check Vercel function logs
   - Verify all environment variables are set
   - Ensure Node.js version compatibility

### Getting Help

- Check Vercel function logs in dashboard
- Enable debug logging: `DEBUG=true`
- Test endpoints locally first

## 📝 Scripts

- `npm run dev` - Start local development server
- `npm start` - Start production server
- `npm run deploy` - Deploy to Vercel (production)
- `npm run deploy:dev` - Deploy to Vercel (preview)

## 🔒 Security Notes

- Never commit `.env` files
- Use Vercel environment variables for production
- Rotate API keys periodically
- Monitor OpenAI usage and costs

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Firebase Firestore Documentation](https://firebase.google.com/docs/firestore)

---

Made with ❤️ for educational gaming
