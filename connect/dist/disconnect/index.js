/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 392:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const HttpClient = (__nccwpck_require__(500).HttpClient)

class AmbassadorClient {
    constructor(apiKey) {
        if (!apiKey) {
            throw new Error("telepresence api key is required");
        }
        this.apiKey = apiKey;
        this.baseURL = "https://app.getambassador.io/cloud/api"
        this.httpClient = new HttpClient('ambassador', null, {
            'allowRedirects': false,
            headers: { 'X-Ambassador-API-Key': this.apiKey }
        })
    }

    async isApiKeyValid()  {
        const response = await this.doRequest('/userinfo');
        if (response.message.statusCode !== 200) {
            return false;
        }
        return true;
    }

    async getUserInfo() {
        const response = await this.doRequestJson('/userinfo', null, 'GET')
        if (response.statusCode !== 200) {
            throw new Error('Could not get user information')
        }
        return response.result
    }

    async doRequest(endpoint, data, method, additionalHeaders) {
        return this.httpClient.request(
            method || 'GET',
            this.baseURL + endpoint, 
            data,
            additionalHeaders || {}
        );
    }

    async doRequestJson(endpoint, data, method = 'GET', additionalHeaders) {
        if (method === 'GET') {
            return this.httpClient.getJson(
                this.baseURL + endpoint, 
                additionalHeaders || {}
            );
        }
        return this.httpClient[`${method.toLowerCase()}Json`](
            this.baseURL + endpoint,
            data,
            additionalHeaders || {}
        );
    }
}

module.exports = AmbassadorClient;


/***/ }),

/***/ 735:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

const core = __nccwpck_require__(792);
const io = __nccwpck_require__(72);
const cache = __nccwpck_require__(746);
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
        case "darwin":
            return '/home/runner/Library/Application\\ Support/telepresence';
        case "linux":
            return '/home/runner/.config/telepresence';
        default:
            core.setFailed(`The platform ${process.platform} is not supported yet`);
            return null;
    }
};

exports.getConfiguration = async () => {
    const telepresenceCacheKey = process.env.TELEPRESENCE_CACHE_KEY;
    if (!telepresenceCacheKey)
        return false;
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
}

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
}

exports.TELEPRESENCE_ID_STATE = 'telepresence-id-state';
exports.TELEPRESENCE_ID_SAVES = 'telepresence-saves';
exports.TELEPRESENCE_ID_SAVED = 'telepresence-saved';
exports.TELEPRESENCE_CONFIG_FILE_PATH = '/.github/telepresence-config/config.yml'



/***/ }),

/***/ 678:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const fs = __nccwpck_require__(147);
const HttpClient = (__nccwpck_require__(500).HttpClient)
const AmbassadorClient = __nccwpck_require__(392);
const core = __nccwpck_require__(792);
const configure = __nccwpck_require__(735);

const httpClient = new HttpClient();
const ambassadorClient = new AmbassadorClient(process.env.TELEPRESENCE_API_KEY)

class MetritonClient {
    static async sendMetricsReport(action){
        try {
            const reportDestination = 'https://metriton.datawire.io/scout'
            const applicationName = 'telepresence-github-action-integration'
            const installId = fs.readFileSync(`${configure.getTelepresenceConfigPath()}/id`).toString()
            const extensionVersion = process.env.ACTION_VERSION	
            const pipelineId = `${process.env.GITHUB_RUN_ID}-${process.env.GITHUB_RUN_ATTEMPT}`
            const { id: user_id, accountId: account_id } = ambassadorClient.getUserInfo()
            const payload = {
                application: applicationName,
                install_id: installId,
                version: extensionVersion,
                metadata: {
                  action,
                  pipelineId,
                  user_id,
                  account_id
                },
              };
            httpClient.postJson(reportDestination, payload)
        } catch (err) {
            core.error("Error sending report to Metriton: " + err.message)
        }
        
    }
}



module.exports = MetritonClient


/***/ }),

/***/ 746:
/***/ ((module) => {

module.exports = eval("require")("@actions/cache");


/***/ }),

/***/ 792:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 413:
/***/ ((module) => {

module.exports = eval("require")("@actions/exec");


/***/ }),

/***/ 500:
/***/ ((module) => {

module.exports = eval("require")("@actions/http-client");


/***/ }),

/***/ 72:
/***/ ((module) => {

module.exports = eval("require")("@actions/io");


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
const core = __nccwpck_require__(792)
const exec = __nccwpck_require__(413);
const MetritonClient = __nccwpck_require__(678)

const telepresenceDisconnect = async function(){
    const connected = core.getState('telepresence_connected');
    if (!connected) {
        core.notice("Skipping disconnect. Telepresence was unable to connect.");
        return;
    }

    try {
        MetritonClient.sendMetricsReport('disconnect')
        await exec.exec('telepresence', ['quit', '-ur']);
    } catch (error) {
        core.setFailed(error.message);
    }
}


telepresenceDisconnect();

})();

module.exports = __webpack_exports__;
/******/ })()
;