// const fs = require('fs');
const HttpClient = require("@actions/http-client").HttpClient
const AmbassadorClient = require('../ambassador/api-client');
const core = require('@actions/core');

const httpClient = new HttpClient();
const ambassadorClient = new AmbassadorClient(process.env.TELEPRESENCE_API_KEY)

class MetritonClient {
    static async sendMetricsReport(action){
        try {
            const reportDestination = 'https://metriton.datawire.io/beta/scout'
            const applicationName = 'telepresence-github-action-integration'
            const installId = '0.0.0-local' // fs.readFileSync(`${configureTP.getTelepresenceConfigPath()}/id`).toString()
            core.info('install id: ' + installId)
            const extensionVersion = '0.0.0-local'
            const pipelineId = process.env.GITHUB_RUN_ID
            core.info('pipelineId id: ' + installId)
            const userInfo = (await ambassadorClient.doRequestJson('/userinfo', null, 'GET')).result
            core.info('accountInfo: ' + userInfo)
            const payload = {
                application: applicationName,
                install_id: installId,
                version: extensionVersion,
                metadata: {
                  action,
                  pipelineId,
                  user_id: userId,
                  account_id: accountId
                },
              };
            httpClient.postJson(reportDestination, payload)
        } catch (err) {
            core.error("Error sending report to Metriton: " + err.message)
        }
        
    }
}



module.exports = MetritonClient
