const core = require('@actions/core');
const io = require('@actions/io');
const cache = require('@actions/cache');
const fs = require('fs');

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
        let crypto = require('crypto');

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

