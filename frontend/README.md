# Wordle Game Frontend

AI-powered adaptive word game frontend built with React 19, Vite, and Firebase. Modern, responsive, and optimized for educational gaming.

## 🚀 Features

- **Modern React**: Built with React 19 and React Router 7
- **Lightning Fast**: Vite for instant development and optimized builds
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time**: Firebase integration for live game state
- **Adaptive UI**: Dynamic difficulty and hint systems
- **Production Ready**: Environment-based configuration and deployment

## 📋 Prerequisites

- Node.js 18+ and npm
- Backend API running (see backend README)
- Firebase project (optional, for real-time features)

## 🛠️ Local Development Setup

### 1. Environment Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### 2. Configure Environment Variables

Edit `.env.local` for local development:

```bash
# API Configuration
VITE_API_URL=http://localhost:8080

# Game Configuration (optional)
VITE_MAX_GUESSES=6
VITE_BASE_PATH=/game-genie-1/

# Development flags
VITE_ENABLE_DEBUG=true
```

### 3. Start Development Server

```bash
# Start with hot reload
npm run dev
```

Frontend runs on `http://localhost:5173`

## 🌐 Production Deployment on Vercel

### Manual Deployment

1. **Install Vercel CLI**: `npm i -g vercel`

2. **Build and Deploy**:

   ```bash
   npm run build
   vercel --prod
   ```

3. **Set Environment Variables** in Vercel Dashboard:
   - `VITE_API_URL`: Your backend API URL

### GitHub Integration

1. Push your code to GitHub
2. Connect repository in Vercel Dashboard
3. Configure build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

## 🔧 Configuration

### Environment Variables

| Variable           | Required | Default                 | Description              |
| ------------------ | -------- | ----------------------- | ------------------------ |
| `VITE_API_URL`     | ✅       | `http://localhost:8080` | Backend API base URL     |
| `VITE_MAX_GUESSES` | ❌       | `6`                     | Maximum guesses per game |
| `VITE_BASE_PATH`   | ❌       | `/game-genie-1/`        | Base path for routing    |

## 📝 Scripts Reference

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Check code quality

---

Built with ❤️ for educational gaming experiences
