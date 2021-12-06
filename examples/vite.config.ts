import { readdirSync, statSync } from "fs";
import { resolve } from "path";
import { Alias, defineConfig } from "vite";

var alias: Alias[] = [];
var paths = readdirSync('../packages');
paths.forEach(path => {
  if (statSync(resolve('../packages', path)).isDirectory()) {
    alias.push({
      find: `@anxi/${path}`,
      replacement: resolve(__dirname, `../packages/${path}/index.ts`)
    })
  }
});


export default defineConfig({
  base: './',
  root: './',
  server: {
    open: true
  },
  resolve: {
    alias
  },
  publicDir: './public'
})