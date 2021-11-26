import { copyFile, readdir, readFile, writeFile } from "fs/promises";
import chalk from "chalk";
import path, { resolve } from "path";
import execa from "execa";
// import { gzipSync } from "zlib";
// import { compress } from "brotli";
import { Extractor, ExtractorConfig } from "@microsoft/api-extractor";
import { existsSync } from "fs";

const args = require('minimist')(process.argv.slice(2));
async function build() {
  await execa('cross-env',
    [
      'NODE_ENV=production', 'rollup', '-c'
    ],
    {
      stdio: 'inherit'
    }
  );

  console.log(chalk.bold(chalk.yellow(`Declaration merging`)));
  const packages = await readdir('./types/packages');
  for (const pkg of packages) {
    const config = ExtractorConfig.prepare({
      configObject: {
        mainEntryPointFilePath: resolve(__dirname, `../types/packages/${pkg}/index.d.ts`),
        dtsRollup: {
          enabled: true,
          publicTrimmedFilePath: resolve(__dirname, `../packages/${pkg}/dist/index.d.ts`),
        },
        compiler: {
          tsconfigFilePath: resolve(__dirname, `../tsconfig.json`),
        },
        projectFolder: `./packages/${pkg}`,
      },
      configObjectFullPath: resolve(__dirname, `../api-extractor.json`),
      packageJsonFullPath: resolve(__dirname, `../packages/${pkg}/package.json`),
    });
    const result = Extractor.invoke(config);
    if (result.succeeded) {
      const pkgDir = resolve('./packages', pkg);
      const globalPath = path.resolve(pkgDir, 'global.d.ts');
      if (existsSync(globalPath)) {
        const dtsPath = path.resolve(pkgDir, 'dist/index.d.ts');
        const existing = await readFile(dtsPath, 'utf-8');
        await writeFile(dtsPath, '/// <reference path="./global.d.ts"/>' + '\n' + existing);
        await copyFile(globalPath, path.resolve(pkgDir, 'dist/global.d.ts'));
      }

      console.log(chalk.bold(chalk.green(`API Extractor completed package ${pkg} successfully.`)));
    } else {
      console.error(`API Extractor shutdown with ${result.errorCount} errors and ${result.warningCount} warnings`);
      process.exit(1);
    }
  }

}
build();