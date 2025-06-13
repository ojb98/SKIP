import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    define: {
        __APP_BASE__: JSON.stringify('http://localhost:8080')
    },
    plugins: [react(), tailwindcss()],
        server: {
            proxy: {
                    '/api': {
                    target: 'http://localhost:8080', // 백엔드 주소
                    changeOrigin: true,
                    secure: false,
                },
        },
    },

})
