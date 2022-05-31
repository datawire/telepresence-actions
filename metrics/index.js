const reportDestination = 'https://metriton.datawire.io/beta/scout';
const applicationName = 'telepresence-github-action-integration';
const extensionVersion = '0.0.0-local';

export function sendMetricsReport(action, metadata){
    const payload = {
        application: applicationName,
        install_id: state.telepresenceStatus.installId,
        version: extensionVersion,
        metadata: {
        ...(metadata || {}),
        action,
        },
    };
    window.ddClient.extension.vm.service.post(reportDestination, payload).catch(e => {
        console.error('Error sending report:', e);
    });
}
