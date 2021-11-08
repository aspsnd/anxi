// import { readFileSync, writeFileSync } from "fs"
import { mkdirSync, readdirSync, writeFileSync } from "fs";
import { red, green } from "chalk";
import minimist from "minimist";

const templete = `{
  "name": "{{pkg}}",
  "version": "1.0.0",
  "description": "> TODO: description",
  "author": "anxyser <2546697613@qq.com>",
  "homepage": "https://github.com/aspsnd/anxi#readme",
  "license": "MIT",
  "main": "index.ts",
  "directories": {
    "lib": "lib",
    "test": "__tests__"
  },
  "files": [
    "lib"
  ],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/aspsnd/anxi.git"
  },
  "scripts": {
    "test": "echo \"Error: run tests from root\" && exit 1"
  },
  "bugs": {
    "url": "https://github.com/aspsnd/anxi/issues"
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
  console.log(green(`The package ${pkg} has been created successfully!`));
  return true;
}