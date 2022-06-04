const core = require('@actions/core');
const toolCache = require('@actions/tool-cache');
const cache = require('@actions/cache');
const configure = require('../configure');
const exec = require('@actions/exec');

const TP_INSTALL_CACHE_ID = 'telepresence-install-id';

const windowsInstall = async (version) => {
    core.setFailed('Not implemented for use with Windows runners');
    return false;
};

const unixInstall = async  (version) => {
    const cacheKey = TP_INSTALL_CACHE_ID + `-${version}`;
    const TELEPRESENCE_DOWNLOAD_URL = process.platform === 'darwin' ?
        `https://app.getambassador.io/download/tel2/darwin/amd64/${version}/telepresence` :
        `https://app.getambassador.io/download/tel2/linux/amd64/${version}/telepresence`;

    let tpCacheId = await cache.restoreCache([this.TP_PATH], cacheKey);

    if (!tpCacheId) {
        try {
            await toolCache.downloadTool(TELEPRESENCE_DOWNLOAD_URL, `${this.TP_PATH}/telepresence`);
            tpCacheId = await cache.saveCache([this.TP_PATH], cacheKey);
            if(!tpCacheId) {
                core.setFailed('There was a problem saving the telepresence binary.');
                return false;
            }
        } catch (e) {
            core.setFailed(`There was a problem getting the telepresence binary: ${e}`);
            return false;
        }
    }
    core.addPath(this.TP_PATH);
    await exec.exec("chmod", ['a+x', `${this.TP_PATH}/telepresence`]);
    return true;
};

exports.telepresenceInstall = async () => {
    const version = core.getInput('version');
    let configFileSha = '00000';
    await exec.exec('echo "TELEPRESENCE_GITHUB_ACTION_INTEGRATION=true" >> $GITHUB_ENV');
    try {
        configFileSha = await configure.checksumConfigFile('sha1');
    } catch (err) {
        core.info('No telepresence configuration file found.');
    }
    const telepresenceCacheKey = `TELEPRESENCE-${version}-${configFileSha}`;
    core.exportVariable('TELEPRESENCE_CACHE_KEY', telepresenceCacheKey);

    try {
        switch (process.platform) {
            case "win32":
                return await windowsInstall(version) && telepresenceCacheKey;
            case "linux":
            case "darwin":
                return await unixInstall(version) && telepresenceCacheKey;
            default:
                core.setFailed("Invalid runner platform");
                return undefined;
        }
    } catch (error) {
        core.setFailed(error.message);
        return undefined;
    }
};

exports.TP_PATH = '/opt/telepresence/bin';