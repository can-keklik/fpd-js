import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueDevTools(),
    ],
    css: {
        preprocessorOptions: {
            less: {
                strictMath: true,
                math: "always",
                relativeUrls: true,
                javascriptEnabled: true
            },
        },
    },
    build: {
        minify: true,
        rollupOptions: {
            input: 'src/index.js',
            output: {
                entryFileNames: '[name].js',
                assetFileNames: '[name].[ext]',
                chunkFileNames: '[name].js',
            }
        },
        outDir: 'dist-vite',
    },
})
