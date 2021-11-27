/**
 * 发布流程，升级版本，生产环境build（可跳过），运行测试（可跳过），commit代码，发布npm包，push代码
 *
 * --dry 空运行，测试脚本使用，会把命令输出到命令行，不会真的执行
 * --skipTests 跳过测试，在非空运行状态下生效
 * --skipBuild 跳过生产环境编译，在非控运行状态下生效
 */

const args = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
import semver from "semver";
const currentVersion = '0.0.0-alpha.0';
import { prompt } from "enquirer";
import { updateVersions } from "./tool";
import { packages, getPkgRoot } from "./tool";
const execa = require('execa');

const preId = args.preid ?? semver.prerelease(currentVersion)?.[0];
const skipBuild = args.sb ?? args.skipBuild;


const versionIncrements = ['patch', 'minor', 'major', ...(preId ? ['prepatch', 'preminor', 'premajor', 'prerelease'] : [])];

const inc = (i: semver.ReleaseType) => semver.inc(currentVersion, i, preId);
const run = (bin: string, args: string[], opts = {}) => execa(bin, args, { stdio: 'inherit', ...opts });
const step = (msg: string) => console.log(chalk.cyan(msg));

async function release() {
  // no explicit version, offer suggestions
  const { release } = await prompt<{ release: string }>({
    type: 'select',
    name: 'release',
    message: 'Select release type',
    choices: versionIncrements.map(i => `${i} (${inc(i as semver.ReleaseType)})`).concat(['custom']),
  });
  const targetVersion = release === 'custom' ? (await prompt<{ version: string }>({
    type: 'input',
    name: 'version',
    message: 'Input custom version',
    initial: currentVersion,
  })).version : release.match(/\((.*)\)/)![1];

  if (!semver.valid(targetVersion)) {
    throw new Error(`invalid target version: ${targetVersion}`);
  }

  const { yes } = await prompt<{ yes: string }>({
    type: 'confirm',
    name: 'yes',
    message: `Releasing v${targetVersion}. Confirm?`,
  });

  if (!yes) {
    return;
  }

  // update all package versions and inter-dependencies
  step('\nUpdating cross dependencies...');
  updateVersions(targetVersion);

  // build all packages with types
  step('\nBuilding all packages...');
  if (!skipBuild) {
    await run('npm', ['run', 'build']);
  } else {
    console.log('(skipped)');
  }

  const { stdout } = await run('git', ['diff'], { stdio: 'pipe' });
  if (stdout) {
    step('\nCommitting changes...');
    await run('git', ['add', '-A']);
    await run('git', ['commit', '-m', `release: v${targetVersion}`]);
  } else {
    console.log('No changes to commit.');
  }

  // publish packages
  step('\nPublishing packages...');
  for (const pkg of packages) {
    await publishPackage(pkg, targetVersion);
  }

  // push to GitHub
  step('\nPushing to GitHub...');
  await run('git', ['tag', `v${targetVersion}`]);
  await run('git', ['push', 'origin', `refs/tags/v${targetVersion}`]);
  await run('git', ['push']);

  console.log();
}


async function publishPackage(pkgName: string, version: string) {

  const pkgRoot = getPkgRoot(pkgName);
  const pkgPath = path.resolve(pkgRoot, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  if (pkg.private) {
    return;
  }

  const releaseTag = semver.prerelease(version)?.[0] as string;

  step(`Publishing ${pkgName}...`);
  try {
    await run('npm', ['publish', ...(releaseTag ? ['--tag', releaseTag] : []), '--access', 'public'], {
      cwd: pkgRoot,
      stdio: 'pipe',
    });
    console.log(chalk.green(`Successfully published ${pkgName}@${version}`));
  } catch (e: any) {
    if (e.stderr.match(/previously published/)) {
      console.log(chalk.red(`Skipping already published: ${pkgName}`));
    } else {
      throw e;
    }
  }
}

release()