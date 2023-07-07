import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import autoprefixer from 'autoprefixer'
import tailwind from 'tailwindcss'
import tailwindConfig from './tailwind.config.js'
import notifier from 'vite-plugin-notifier';


const [schema, host] = process.env.GITPOD_WORKSPACE_URL ? process.env.GITPOD_WORKSPACE_URL.split('://') : [null, null]
const publicUrl = `5173-${host}`

// https://vitejs.dev/config/
export default defineConfig({
  base: '',
  define: {
    __STAMP_CONTRACT__: '"TlqASNDLA1Uh8yFiH-BzR_1FDag4s735F3PoUFEv2Mo"',
    __BAR_CONTRACT__: '"KTzTXT_ANmF84fWEKHzWURD1LWd9QaFR9yfYUwH2Lxw"',
    __ASSET_SOURCE__: '"ixh0RAgJzFGx4o_ul8jUdUeiO5RZ51fakgugmuh5v38"'
  },
  plugins: [svelte(), notifier()],


  server: {
    hmr: {
      clientPort: host ? 443 : 5173,
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