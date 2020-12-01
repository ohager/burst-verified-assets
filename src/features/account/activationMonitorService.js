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
        let pollCount = 0
        return this._monitorService.startMonitor({
            id: accountId,
            asyncFetcher: async () => {
                // TODO: remove mocked implementation
                console.log('trying to fetch account:', accountId, ++pollCount)
                const accountExists = pollCount >= 2
                // const accountExists = await this._accountService.existsAccount(accountId)
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
