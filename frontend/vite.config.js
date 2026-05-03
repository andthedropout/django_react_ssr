import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react-swc'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { nitro } from 'nitro/vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  envDir: '../',
  publicDir: '../public',

  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },

  build: {
    minify: 'esbuild',
    cssMinify: true,
    // TanStack Start owns rollup input + chunking via Vite Environments.
    // Don't override `rollupOptions.input` or `manualChunks` here.
  },
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },

  server: {
    host: true,
    port: parseInt(process.env.VITE_PORT || '5175', 10),
    watch: {
      usePolling: true,
      interval: 500,
      ignored: ['**/src/routeTree.gen.ts'],
    },
    hmr: {
      overlay: true,
      clientPort: parseInt(process.env.VITE_PORT || '5175', 10),
      protocol: 'ws',
    },
    fs: { strict: false },
    proxy: (() => {
      const target =
        process.env.DJANGO_API_URL ||
        `http://localhost:${process.env.DJANGO_PORT || '8000'}`
      const cfg = (extra = {}) => ({ target, changeOrigin: true, secure: false, ...extra })
      return {
        '/api':       cfg({ cookieDomainRewrite: { '*': '' } }),
        '/admin':     cfg(),
        '/static':    cfg(),
        '/media':     cfg(),
        '/markdownx': cfg(),
        '/up':        cfg(),
      }
    })(),
  },

  // Plugin order matters:
  //   tailwindcss → tanstackStart → viteReact → nitro
  // tanstackStart MUST come BEFORE viteReact.
  // nitro MUST be present (preset 'bun') for the SSR server bundle.
  plugins: [
    tailwindcss(),
    tanstackStart({
      srcDirectory: 'src',
      router: {
        autoCodeSplitting: true,
        generatedRouteTree: 'src/routeTree.gen.ts',
      },
    }),
    viteReact(),
    nitro({ preset: 'bun' }),
  ],
})
