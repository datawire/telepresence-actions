/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 73:
/***/ ((module) => {

module.exports = eval("require")("@actions/exec");


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
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
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
const exec = __nccwpck_require__(73);

//set version by removing the v from vX.X.X, if it follows the format. if not, just return 0.0.0
const semVerRegex = /^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const inputActionVersion = process.env.GITHUB_ACTION_REF;
const actionVersion =
  inputActionVersion && semVerRegex.test(inputActionVersion) ? inputActionVersion.substring(1) : '0.0.0';

exec.exec('/bin/bash -c', ['echo TELEPRESENCE_REPORT_GITHUB_ACTIONS_INTEGRATION=true >> $GITHUB_ENV']);
exec.exec('/bin/bash -c', [`echo ACTION_VERSION=${actionVersion} >> $GITHUB_ENV`]);

})();

module.exports = __webpack_exports__;
/******/ })()
;