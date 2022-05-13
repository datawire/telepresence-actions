const core = require('@actions/core')
const exec = require('@actions/exec');

const telepresenceLogin = async function(){
    try {
        const API_KEY = core.getInput('telepresence_api_key');
        await exec.exec('telepresence', ['login', '--apikey', API_KEY]);
    } catch (error) {
        core.setFailed(error.message);
    }
}


telepresenceLogin();