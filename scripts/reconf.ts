const { readdirSync, readFileSync, writeFileSync, statSync } = require('fs');
const { resolve } = require('path');

// find paths
const packages = readdirSync('./packages').filter(path => {
  if (path.startsWith('_')) return false;
  let stat = statSync(resolve('./packages', path));
  return stat.isDirectory();
});
const paths = {};
packages.forEach(pkg => {
  paths[`@anxi/${pkg}`] = [
    `./packages/${pkg}/index.ts`
  ]
});
paths['@anxi/*'] = ['./packages/*/index.ts'];
paths['anxi.js'] = ['./bundles/anxi.js/index.ts'];

// reconfig root dir tsconfig
const tsconfig = JSON.parse(readFileSync('./tsconfig.json', 'utf8'));
tsconfig.compilerOptions.paths = paths;
writeFileSync('./tsconfig.json', JSON.stringify(tsconfig, undefined, 2));

// reconfig examples dir tsconfig
const etsconfig = JSON.parse(readFileSync('./examples/tsconfig.json', 'utf8'));
etsconfig.compilerOptions.paths = paths;
writeFileSync('./examples/tsconfig.json', JSON.stringify(etsconfig, undefined, 2));