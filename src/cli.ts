import { Helpers } from 'tnp-core';
if (Helpers.isBrowser) {
  console.log(`This package is only for node backend`);
}
//#region @backend
import { child_process } from 'tnp-core';
import { ConfigModels, GlobalIsomorphicDependencies } from 'tnp-config';
import chalk from 'chalk';
import * as commandExist from 'command-exists';
const commandExistsSync = commandExist.sync;
const check = require('check-node-version');
import isElevated from 'is-elevated';

export class CLI {

  public static isElevated = isElevated;
  public static commandExistsSync = commandExistsSync;
  public static chalk = chalk;

  public static installEnvironment(globalDependencies: ConfigModels.GlobalDependencies = GlobalIsomorphicDependencies) {
    Helpers.info(`[tnp-cli] INSTALLING GLOBAL ENVIRONMENT FOR FIREDEV...`)
    const missingNpm: ConfigModels.GlobalNpmDependency[] = [];
    globalDependencies.npm.forEach(pkg => {
      if (!commandExistsSync(pkg.name)) {
        missingNpm.push(pkg)
      }
    })

    if (missingNpm.length > 0) {

      const toInstall = missingNpm
        .map(pkg => {
          const n = pkg.installName ? pkg.installName : pkg.name;
          return pkg.version ? `${n}@${pkg.version}` : n;
        })
        .join(' ');
      Helpers.info('Installing missing dependencies...')
      const cmd = `npm install -g ${toInstall}`;
      Helpers.run(cmd).sync();
    }
    Helpers.info(`[tnp-cli] INSTALLING GLOBAL ENVIRONMENT FOR FIREDEV...done`)
  }

  /**
   * Check if global system tools are available for isomorphic app development
   */
  public static checkEnvironment(globalDependencies: ConfigModels.GlobalDependencies = GlobalIsomorphicDependencies) {
    const missingNpm: ConfigModels.GlobalNpmDependency[] = [];
    globalDependencies.npm.forEach(pkg => {
      if (!commandExistsSync(pkg.name)) {
        missingNpm.push(pkg)
      }
    })

    if (missingNpm.length > 0) {

      const toInstall = missingNpm
        .map(pkg => {
          const n = pkg.installName ? pkg.installName : pkg.name;
          return pkg.version ? `${n}@${pkg.version}` : n;
        })
        .join(' ');
      Helpers.error(`Missing npm dependencies.`, true, true)
      const cmd = `npm install -g ${toInstall}`;
      Helpers.error(`Please run: ${chalk.green(cmd)}`, false, true);
    }

    globalDependencies.programs.forEach(p => {
      if (!commandExistsSync(p.name)) {
        Helpers.error(chalk.red(`Missing command line tool "${p.name}".`), false, false);
        Helpers.error(`Please install it from: ${chalk.green(p.website)}`, false, false);
      }
    })


    try {
      child_process.execSync(`check-node-version --node ">= 9.2"`, { stdio: [0, 1, 2] })
    } catch (error) {
      process.exit(0)
    }
  }


  minimalNodeVersionExistsGlobal(minimalNode: string) {
    return new Promise<boolean>((resolve) => {
      check(
        { node: `>= ${minimalNode}`, },
        (error, result) => {
          if (error) {
            Helpers.error(error, true, true)
            resolve(false);
            return;
          } else if (result.isSatisfied) {
            resolve(true);
          } else {
            Helpers.error("[tnp-cli] Some package version(s) failed!", true, true);

            for (const packageName of Object.keys(result.versions)) {
              if (!result.versions[packageName].isSatisfied) {
                Helpers.error(`[tnp-cli] Missing ${packageName}.`, true, true);
              }
            }
            resolve(false);
          }
        }
      );
    });


  }

}

//#endregion