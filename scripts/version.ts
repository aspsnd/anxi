import minimist from "minimist";
import { prompt } from "enquirer";
import { updateVersions } from "./tool";
import { valid } from "semver";
import { red } from "chalk";
const args = minimist(process.argv.slice(2));

async function resetVersion() {
  const version = args._[0] ?? (await prompt<{ version: string }>({
    name: 'version',
    type: 'input',
    message: 'Input new version'
  })).version;
  if (valid(version)) return updateVersions(version);
  console.log(red(`${version} is not a valid version.`));
}
resetVersion();