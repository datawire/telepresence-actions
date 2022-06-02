const core = require('@actions/core');
const exec = require('@actions/exec');
const io = require('@actions/io');
const cache = require('@actions/cache');

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
    const path = this.getTelepresenceConfigPath();
    try {
        await io.mkdirP(path);
        const cacheid = await cache.restoreCache([path], this.TELEPRESENCE_CACHE_KEY,)
        if (!cacheid){
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
 * @param telepresence_config_file the path to the Telepresence client configuration file
 */
exports.createClientConfigFile = async function(telepresence_config_file) {
    if (!telepresence_config_file) {
        return;
    }
    if (!telepresence_config_file.endsWith('.yaml')  && !telepresence_config_file.endsWith('.yml')) {
        throw new Error('client_values_file values file must be a yaml file.');
    }

    const telepresenceConfigDir = this.getTelepresenceConfigPath();
    await io.mkdirP(telepresenceConfigDir);
    await exec.exec('cp', [telepresence_config_file, telepresenceConfigDir + '/config.yml']);
}

exports.TELEPRESENCE_ID_STATE = 'telepresence-id-state';
exports.TELEPRESENCE_ID_SAVES = 'telepresence-saves';
exports.TELEPRESENCE_ID_SAVED = 'telepresence-saved';
exports.TELEPRESENCE_CACHE_KEY = 'telepresence_cache_key';
