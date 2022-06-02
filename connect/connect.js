const core = require('@actions/core')
const exec = require('@actions/exec');
const configure = require("../src/configure");

const telepresenceConnect = async function(){
    const isConfigured = await configure.getConfiguration();
    if(!isConfigured)
        return;

    // Create telepresence configuration file
    try {
        await configure.createClientConfigFile(core.getInput('telepresence_config_file'));
    } catch(err) {
        core.setFailed(err);
        return;
    }

    try {
        await exec.exec('telepresence', ['connect']);
        core.saveState("telepresence_connected", true)
    } catch (error) {
        core.setFailed(error.message);
    }
}

telepresenceConnect();
