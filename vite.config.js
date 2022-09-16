import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import autoprefixer from 'autoprefixer'
import tailwind from 'tailwindcss'
import tailwindConfig from './tailwind.config.js'
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import notifier from 'vite-plugin-notifier';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'


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
      assert: "assert",
      //buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6', // add buffer
      process: 'rollup-plugin-node-polyfills/polyfills/process-es6', // add process
      http: "stream-http",
      https: "https-browserify",
      os: "os-browserify",
      url: "url",
      path: "path-browserify",
      zlib: "browserify-zlib",
      tty: "tty-browserify",
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
    target: ['esnext'],
    rollupOptions: {
      plugins: [
        // Enable rollup polyfills plugin
        // used during production bundling
        rollupNodePolyFill()
      ]
    }
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