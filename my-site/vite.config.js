import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, '.', '')
  const useFunctionsEmulator = environment.VITE_USE_FIREBASE_EMULATORS === 'true'
    || environment.VITE_USE_FUNCTIONS_EMULATOR === 'true'

  return {
    plugins: [react()],
    server: useFunctionsEmulator ? {
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:5001',
          changeOrigin: true,
          rewrite: (path) => `/website2-c8d1e/us-central1/api${path.slice('/api'.length)}`,
        },
      },
    } : undefined,
  }
})
