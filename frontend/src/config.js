// config.js
// Environment-based configuration

// API Configuration
export const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:8080" : "");

// App Configuration
export const APP_CONFIG = {
  // API Settings
  api: {
    baseUrl: API_BASE,
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
    retries: parseInt(import.meta.env.VITE_API_RETRIES) || 3,
  },

  // Game Settings
  game: {
    maxGuesses: parseInt(import.meta.env.VITE_MAX_GUESSES) || 6,
    wordLength: {
      min: parseInt(import.meta.env.VITE_MIN_WORD_LENGTH) || 4,
      max: parseInt(import.meta.env.VITE_MAX_WORD_LENGTH) || 5,
    },
    hints: {
      maxLevel: parseInt(import.meta.env.VITE_MAX_HINT_LEVEL) || 2,
    },
  },

  // Environment
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE,

  // Version
  version: import.meta.env.VITE_APP_VERSION || "1.0.0",

  // Base path for routing
  basePath: import.meta.env.VITE_BASE_PATH || "/game-genie-1/",
};

// Firebase Configuration (if using client-side Firebase)
export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Debug logging in development
if (APP_CONFIG.isDevelopment) {
  console.log("🔧 App Config:", APP_CONFIG);
}
