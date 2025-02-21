import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


export default {
  server: {
    host: '0.0.0.0', // Ensures it listens on all interfaces
    port: 5173, // Or whatever port you're using
  }
};

