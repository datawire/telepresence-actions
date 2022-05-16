const core = require('@actions/core')
const exec = require('@actions/exec');

const telepresenceDisconnect = async function(){
    try {
        await exec.exec('telepresence', ['quit']);
    } catch (error) {
        core.setFailed(error.message);
    }
}


telepresenceDisconnect();