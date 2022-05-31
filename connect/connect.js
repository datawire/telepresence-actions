const core = require('@actions/core')
const exec = require('@actions/exec');
const configure = require("../src/configure");

const telepresenceConnect = async function(){
    await configure.getConfiguration();
    try {
        await exec.exec('telepresence', ['connect']);
        core.saveState("telepresence_connected", true)
    } catch (error) {
        core.setFailed(error.message);
    }
}

telepresenceConnect();
