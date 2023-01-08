//#region @notForNpm

import { CLI } from "./lib";
import { checkSyncIfCommandExists } from "./lib/command-exists";

console.log({
  firedev:  checkSyncIfCommandExists('firedev'),
  asdasd:  checkSyncIfCommandExists('asdasd'),
});



//#endregion
