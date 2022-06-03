const fs = require('fs');
const HttpClient = require("@actions/http-client").HttpClient
const AmbassadorClient = require('../ambassador/api-client');
const core = require('@actions/core');
const configure = require('../configure');

const httpClient = new HttpClient();
const ambassadorClient = new AmbassadorClient(process.env.TELEPRESENCE_API_KEY)

class MetritonClient {
    static async sendMetricsReport(action){
        try {
            const reportDestination = 'https://metriton.datawire.io/beta/scout'
            const applicationName = 'telepresence-github-action-integration'
            const installId = fs.readFileSync(`${configure.getTelepresenceConfigPath()}/id`).toString()
            core.info('install id: ' + installId)
            const extensionVersion = '0.0.0-local'
            const pipelineId = process.env.GITHUB_RUN_ID
            const { id: user_id, accountId: account_id } = (await ambassadorClient.doRequestJson('/userinfo', null, 'GET')).result
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
