import {
    accountService as _accountService,
    monitorService as _monitorService,
} from '../../services'

class ActivationMonitorService {
    constructor(monitorService = _monitorService, accountService = _accountService) {
        this._monitorService = monitorService
        this._accountService = accountService
    }

    async start(accountId) {
        return this._monitorService.startMonitor({
            key: `activation:${accountId}`,
            asyncFetcher: async () => {
                const accountExists = await this._accountService.existsAccount(accountId)
                return Promise.resolve({
                    accountId,
                    accountExists,
                })
            },
            targetFieldName: 'accountExists',
            targetValue: true,
            timeoutCallback: ({ accountId }) => {
                // TODO: define the action
                console.warn(`Activation for account ${accountId} timed out`)
            },
            fulfilledCallback: ({ accountId }) => {
                // TODO: define the action
                console.info(`Activation for account ${accountId} successful`)
            },
        })
    }
}

export const activationMonitorService = new ActivationMonitorService()
