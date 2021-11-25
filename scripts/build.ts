
import fs from "fs/promises";
import chalk from "chalk";
import path from "path";
import execa from "execa";
import { gzipSync } from "zlib";
import { compress } from "brotli";

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
  
}
build();