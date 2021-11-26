import { readdir } from "fs/promises";
import chalk from "chalk";
import path, { resolve } from "path";
import execa from "execa";
// import { gzipSync } from "zlib";
// import { compress } from "brotli";
import { Extractor, ExtractorConfig } from "@microsoft/api-extractor";

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
    Extractor.invoke(config);
  }

}
build();