import { build } from 'esbuild'

await build({
  entryPoints: ["./contracts/contract.js"],
  outdir: "./public",
  minify: false,
  bundle: true,
})

console.log('build successful!')