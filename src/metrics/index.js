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
            const reportDestination = 'https://metriton.datawire.io/scout'
            const applicationName = 'telepresence-github-action-integration'
            const installId = fs.readFileSync(`${configure.getTelepresenceConfigPath()}/id`).toString()
            const extensionVersion = process.env.ACTION_VERSION	
            const pipelineId = `${process.env.GITHUB_RUN_ID}-${process.env.GITHUB_RUN_ATTEMPT}`
            const { id: user_id, accountId: account_id } = ambassadorClient.getUserInfo()
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
