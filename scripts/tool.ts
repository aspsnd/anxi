import { readdirSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { yellow } from "chalk";

export const packages = readdirSync('./packages').filter(p => !p.endsWith('.ts') && !p.startsWith('.'));
export const getPkgRoot = pkg => resolve(__dirname, '../packages/' + pkg);

export function updateVersions(version: string) {
  // 1. update root package.json
  updatePackage(resolve(__dirname, '..'), version);

  // 2. update all packages
  packages.forEach(p => updatePackage(getPkgRoot(p), version));
}

export function updatePackage(pkgRoot, version) {
  const pkgPath = resolve(pkgRoot, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  pkg.version = version;
  updateDependences(pkg, 'dependencies', version);
  updateDependences(pkg, 'peerDependencies', version);
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
}

export function updateDependences(pkg, depType, version) {
  const deps = pkg[depType];
  if (!deps) return;
  Object.keys(deps).forEach(dep => {
    if (dep.startsWith('@eva/') && packages.indexOf(dep.substring(5)) > -1) {
      console.log(yellow(`${pkg.name} -> ${depType} -> ${dep}@${version}`));
      deps[dep] = `${version}`;
    }
  });
}