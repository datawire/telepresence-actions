/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 144:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

const core = __nccwpck_require__(806);
const io = __nccwpck_require__(446);
const cache = __nccwpck_require__(772);
const fs = __nccwpck_require__(147);

exports.fileExists = async function (filePath) {
  try {
    const stats = await fs.promises.stat(filePath);
    if (!stats.isFile()) {
      throw new Error('client_values_file must be a file.');
    }
    return true;
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false;
    }
    throw err;
  }
};

exports.getTelepresenceConfigPath = () => {
  switch (process.platform) {
    case 'darwin':
      return '/home/runner/Library/Application\\ Support/telepresence';
    case 'linux':
      return '/home/runner/.config/telepresence';
    default:
      core.setFailed(`The platform ${process.platform} is not supported yet`);
      return null;
  }
};

exports.getConfiguration = async () => {
  const telepresenceCacheKey = process.env.TELEPRESENCE_CACHE_KEY;
  if (!telepresenceCacheKey) return false;
  const path = this.getTelepresenceConfigPath();
  try {
    await io.mkdirP(path);
    const cacheid = await cache.restoreCache([path], telepresenceCacheKey);
    if (!cacheid) {
      core.setFailed('Unable to find a telepresence install id stored');
      return false;
    }
  } catch (error) {
    core.setFailed(error);
    return false;
  }
  return true;
};

/**
 * Copies the given client configuration file to the user's Telepresence configuration directory
 */
exports.createClientConfigFile = async function () {
  let fileExists = false;
  try {
    fileExists = await this.fileExists(this.TELEPRESENCE_CONFIG_FILE_PATH);
  } catch (err) {
    core.warning('Error accessing telepresence config file. ' + err);
    return;
  }
  if (!fileExists) {
    return;
  }

  const telepresenceConfigDir = this.getTelepresenceConfigPath();
  await exec.exec('cp', [this.TELEPRESENCE_CONFIG_FILE_PATH, telepresenceConfigDir + '/config.yml']);
};

exports.checksumConfigFile = function (algorithm) {
  const filePath = process.env.GITHUB_WORKSPACE + this.TELEPRESENCE_CONFIG_FILE_PATH;
  return new Promise(function (resolve, reject) {
    let crypto = __nccwpck_require__(113);

    let hash = crypto.createHash(algorithm).setEncoding('hex');
    fs.createReadStream(filePath)
      .once('error', reject)
      .pipe(hash)
      .once('finish', function () {
        resolve(hash.read());
      });
  });
};

exports.TELEPRESENCE_ID_STATE = 'telepresence-id-state';
exports.TELEPRESENCE_ID_SAVES = 'telepresence-saves';
exports.TELEPRESENCE_ID_SAVED = 'telepresence-saved';
exports.TELEPRESENCE_CONFIG_FILE_PATH = '/.github/telepresence-config/config.yml';


/***/ }),

/***/ 11:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

const core = __nccwpck_require__(806);
const toolCache = __nccwpck_require__(347);
const cache = __nccwpck_require__(772);
const configure = __nccwpck_require__(144);
const exec = __nccwpck_require__(73);

const TP_INSTALL_CACHE_ID = 'telepresence-install-id';

const windowsInstall = async version => {
  core.setFailed('Not implemented for use with Windows runners');
  return false;
};

const unixInstall = async version => {
  const cacheKey = TP_INSTALL_CACHE_ID + `-${version}`;
  const TELEPRESENCE_DOWNLOAD_URL =
    process.platform === 'darwin'
      ? `https://app.getambassador.io/download/tel2/darwin/amd64/${version}/telepresence`
      : `https://app.getambassador.io/download/tel2/linux/amd64/${version}/telepresence`;

  let tpCacheId = await cache.restoreCache([this.TP_PATH], cacheKey);

  if (!tpCacheId) {
    try {
      await toolCache.downloadTool(TELEPRESENCE_DOWNLOAD_URL, `${this.TP_PATH}/telepresence`);
      tpCacheId = await cache.saveCache([this.TP_PATH], cacheKey);
      if (!tpCacheId) {
        core.setFailed('There was a problem saving the telepresence binary.');
        return false;
      }
    } catch (e) {
      core.setFailed(`There was a problem getting the telepresence binary: ${e}`);
      return false;
    }
  }
  core.addPath(this.TP_PATH);
  await exec.exec('chmod', ['a+x', `${this.TP_PATH}/telepresence`]);
  return true;
};

exports.telepresenceInstall = async () => {
  const version = core.getInput('version');
  let configFileSha = '00000';
  try {
    configFileSha = await configure.checksumConfigFile('sha1');
  } catch (err) {
    core.info('No telepresence configuration file found.');
  }
  const telepresenceCacheKey = `TELEPRESENCE-${version}-${configFileSha}`;
  core.exportVariable('TELEPRESENCE_CACHE_KEY', telepresenceCacheKey);

  try {
    switch (process.platform) {
      case 'win32':
        return (await windowsInstall(version)) && telepresenceCacheKey;
      case 'linux':
      case 'darwin':
        return (await unixInstall(version)) && telepresenceCacheKey;
      default:
        core.setFailed('Invalid runner platform');
        return undefined;
    }
  } catch (error) {
    core.setFailed(error.message);
    return undefined;
  }
};

exports.TP_PATH = '/opt/telepresence/bin';


/***/ }),

/***/ 772:
/***/ ((module) => {

module.exports = eval("require")("@actions/cache");


/***/ }),

/***/ 806:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 73:
/***/ ((module) => {

module.exports = eval("require")("@actions/exec");


/***/ }),

/***/ 446:
/***/ ((module) => {

module.exports = eval("require")("@actions/io");


/***/ }),

/***/ 347:
/***/ ((module) => {

module.exports = eval("require")("@actions/tool-cache");


/***/ }),

/***/ 113:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ 147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(806);
const exec = __nccwpck_require__(73);
const io = __nccwpck_require__(446);
const configure = __nccwpck_require__(144);
const installTelepresence = __nccwpck_require__(11);
const cache = __nccwpck_require__(772);

const telepresenceConfiguring = async function () {
  const telepresenceCacheKey = await installTelepresence.telepresenceInstall();
  if (!telepresenceCacheKey) return;

  const path = configure.getTelepresenceConfigPath();
  const telepresenceConfigDir = [path];

  try {
    await io.mkdirP(path);
    await cache.restoreCache(telepresenceConfigDir, telepresenceCacheKey);
  } catch (error) {
    core.warning(`Unable to find the telepresence id: ${error}`);
  }
  // Create telepresence configuration file if provided
  try {
    await configure.createClientConfigFile();
  } catch (err) {
    core.setFailed(err);
    return;
  }
  try {
    await exec.exec('telepresence', ['connect']);
  } catch (error) {
    core.setFailed(error.message);
    return;
  }
  try {
    const cacheKey = await cache.saveCache(telepresenceConfigDir, telepresenceCacheKey);
    if (!cacheKey) core.setFailed('Unable to save the telepresence key cache');
  } catch (error) {
    core.setFailed(error.message);
  }
};

telepresenceConfiguring();

})();

module.exports = __webpack_exports__;
/******/ })()
;