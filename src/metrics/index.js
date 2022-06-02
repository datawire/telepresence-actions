const fs = require('fs/promises');
const HttpClient = require("@actions/http-client").HttpClient
const io = require('@actions/io');
const installTelepresence = require('../install');

const httpClient = new HttpClient()
const reportDestination = 'https://metriton.datawire.io/beta/scout'
const applicationName = 'telepresence-github-action-integration'
const installId = await fs.readFile(installTelepresence.getTelepresenceConfigPath())
const extensionVersion = '0.0.0-local'
const pipelineId = process.env.GITHUB_RUN_ID

console.log(installId)

class MetritonClient {
    static sendMetricsReport(action){
        const payload = {
            application: applicationName,
            install_id: installId,
            version: extensionVersion,
            metadata: {
                action,
                pipelineId,
                userId: 'fakeuserId',
                accountId: 'fakeaccountId',
            },
        };
        httpClient.postJson(reportDestination, payload)
    }
}



module.exports = MetritonClient
