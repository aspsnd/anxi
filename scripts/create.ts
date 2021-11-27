// import { readFileSync, writeFileSync } from "fs"
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { red, green } from "chalk";
import minimist from "minimist";

const templete = `{
  "name": "@anxi/{{pkg}}",
  "version": "1.0.0",
  "description"A package of anxi.js",
  "author": "aspsnd <2546697613@qq.com>",
  "homepage": "https://github.com/aspsnd/anxi#readme",
  "license": "MIT",
  "main": "dist/cjs/index.js",
  "module": "dist/esm/index.js",
  "bundle": "dist/browser/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "lib",
    "dist",
    "*.d.ts"
  ],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/aspsnd/anxi.git"
  },
  "publishConfig": {
    "access": "public"
  },
  "bugs": {
    "url": "https://github.com/aspsnd/anxi/issues"
  },
  "publishConfig": {
    "access": "public"
  },
  "dependencies": {
    
  }
}`;

const args = minimist(process.argv.slice(2));
const pkgs = args._;
pkgs.forEach(pkg => createPackage(pkg));
function createPackage(pkg: string) {
  const existPkgs = readdirSync('./packages');
  if (existPkgs.includes(pkg)) {
    console.log(red(`The package ${pkg} already exists, it can not be created again before you delete it.`));
    return false;
  }
  mkdirSync(`./packages/${pkg}`);
  const pkgjson = templete.replace('{{pkg}}', pkg);
  writeFileSync(`./packages/${pkg}/package.json`, pkgjson);
  mkdirSync(`./packages/${pkg}/lib`);
  writeFileSync(`./packages/${pkg}/index.ts`, '');
  writeFileSync(`./packages/${pkg}/LICENSE`, readFileSync('./LICENSE', 'utf-8'));
  console.log(green(`The package ${pkg} has been created successfully!`));
  return true;
}