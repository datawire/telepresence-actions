const reportDestination = '/metriton/reports';
const applicationName = 'telepresence-github-action-integration';
const extensionVersion = process.env.REACT_APP_EXTENSION_VERSION || '0.0.0-local';

export function sendMetricsReport(section, action, metadata){
    const payload = {
        application: applicationName,
        install_id: state.telepresenceStatus.installId,
        version: extensionVersion,
        metadata: {
        ...(metadata || {}),
        action,
        section,
        user_id: state.telepresenceStatus?.userId,
        account_id: state.telepresenceStatus?.accountId,
        },
    };
    window.ddClient.extension.vm.service.post(reportDestination, payload).catch(e => {
        console.error('Error sending report:', e);
    });
}
