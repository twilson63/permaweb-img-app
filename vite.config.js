import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import autoprefixer from 'autoprefixer'
import tailwind from 'tailwindcss'
import tailwindConfig from './tailwind.config.js'
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import notifier from 'vite-plugin-notifier';

const [schema, host] = process.env.GITPOD_WORKSPACE_URL ? process.env.GITPOD_WORKSPACE_URL.split('://') : [null, null]
const publicUrl = `3000-${host}`

// https://vitejs.dev/config/
export default defineConfig({
  base: '',
  plugins: [svelte(), notifier()],
  resolve: {
    alias: {
      stream: "stream-browserify",
      crypto: "crypto-browserify",
      assert: 'assert-browserify'
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis",
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
          define: {}
        }),
      ],
    },
  },
  build: {
    target: ['esnext']
  },
  server: {
    hmr: {
      clientPort: host ? 443 : 3000,
      host: host
        ? publicUrl
        : "localhost",
    }
  },
  css: {
    postcss: {
      plugins: [tailwind(tailwindConfig), autoprefixer],
    }

  }
})