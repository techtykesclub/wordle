import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],

    // Development server configuration
    server: {
      port: 5173,
      host: true, // Listen on all addresses
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:8080",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""), // Remove /api prefix
          secure: false,
        },
      },
    },

    // Build configuration
    build: {
      outDir: "dist",
      sourcemap: mode === "development",
      minify: mode === "production" ? "esbuild" : false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom", "react-router-dom"],
            firebase: ["firebase"],
          },
        },
      },
    },

    // Resolve configuration
    resolve: {
      alias: {
        "firebase/firestore": "firebase/firestore",
      },
    },

    // Base path - use environment variable or default
    base: env.VITE_BASE_PATH || "/game-genie-1/",

    // Preview server configuration
    preview: {
      port: 4173,
      host: true,
    },
  };
});
