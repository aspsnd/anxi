import minimist from "minimist";
import { prompt } from "enquirer";
import { updateVersions } from "./tool";
const args = minimist(process.argv.slice(2));

async function resetVersion() {
  const version = args._[0] ?? (await prompt<{ version: string }>({
    name: 'version',
    type: 'input',
    message: 'Input new version'
  })).version;
  updateVersions(version);
}
resetVersion();