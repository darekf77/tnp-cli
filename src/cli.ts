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
import isElevated from 'is-elevated';

export class CLI {

  public static isElevated = isElevated;
  public static commandExistsSync = commandExistsSync;
  public static chalk = chalk;

  public static installEnvironment(globalDependencies: ConfigModels.GlobalDependencies = GlobalIsomorphicDependencies) {
    Helpers.info(`INSTALLING GLOBAL ENVIRONMENT FOR FIREDEV...`)
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
      console.log(chalk.red(`Missing npm dependencies.`))
      const cmd = `npm install -g ${toInstall}`;
      Helpers.run(cmd).sync();
    }
    Helpers.info(`INSTALLING GLOBAL ENVIRONMENT FOR FIREDEV...done`)
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
      console.log(chalk.red(`Missing npm dependencies.`))
      const cmd = `npm install -g ${toInstall}`;
      console.log(`Please run: ${chalk.green(cmd)}`)
      process.exit(0)
    }

    globalDependencies.programs.forEach(p => {
      if (!commandExistsSync(p.name)) {
        console.log(chalk.red(`Missing command line tool "${p.name}".`))
        console.log(`Please install it from: ${chalk.green(p.website)}`)
        process.exit(0)
      }
    })


    try {
      child_process.execSync(`check-node-version --node ">= 9.2"`, { stdio: [0, 1, 2] })
    } catch (error) {
      process.exit(0)
    }
  }
}

//#endregion
