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
  define: {
    __STAMP_CONTRACT__: '"FMRHYgSijiUNBrFy-XqyNNXenHsCV0ThR4lGAPO4chA"',
    __BAR_CONTRACT__: '"VFr3Bk-uM-motpNNkkFg4lNW1BMmSfzqsVO551Ho4hA"',
    __ASSET_SOURCE__: '"x0ojRwrcHBmZP20Y4SY0mgusMRx-IYTjg5W8c3UFoNs"'
  },
  plugins: [svelte(), notifier()],
  resolve: {
    alias: {
      crypto: "crypto-browserify",
      stream: "rollup-plugin-node-polyfills/polyfills/stream",
      events: "rollup-plugin-node-polyfills/polyfills/events",
      '@bundlr-network/client': "@bundlr-network/client/build/web/bundle.js"
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