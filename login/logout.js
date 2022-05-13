const core = require('@actions/core')
const exec = require('@actions/exec');

const telepresenceLogout = async function(){
    try {
        await exec.exec('telepresence', ['logout']);
    } catch (error) {
        core.setFailed(error.message);
    }
}

telepresenceLogout();