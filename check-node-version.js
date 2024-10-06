import { satisfies } from 'semver';
import pack from './package.json' with { type: 'json' };

const requriedVersion = pack.engines.node;
if (!satisfies(process.version, requriedVersion)) {
  console.log(
    `Required node version ${requriedVersion} not satisfied with current version ${process.version}.`,
  );
  process.exit(1);
}
