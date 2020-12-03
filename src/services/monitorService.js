import { monitorRepository } from './repositories/monitorRepository'
import { Monitor } from './Monitor'
import { Vars } from '../context'

export class MonitorService {
    constructor(repository = monitorRepository) {
        this._monitorRepository = repository
        this._activeMonitors = []
    }

    get activeMonitors() {
        return this._activeMonitors
    }

    async restoreMonitors() {
        const monitors = await this._monitorRepository.getAll()
        monitors.forEach(monitor => {
            this.restoreMonitor(monitor.key)
        })
    }

    async restoreMonitor(key) {
        const { expected, startTime } = await this._monitorRepository.get(key)
        const fieldName = Object.keys(expected)[0]
        const expectedValue = expected[fieldName]
        const expired = (Date.now() - startTime) / 1000 > Vars.BlockchainWatcherTimeoutSecs
        if (expired) {
            console.debug('Expired Monitor', key)
            return this.removeMonitor(key)
        }
        await this.startMonitor({
            key,
            fieldName,
            expectedValue,
            startTime,
        })
    }

    /**
     * Starts a polling monitor
     * @param key The id for the monitor, i.e monitor id
     * @param asyncFetcher The data fetcher as promise, that's used to fetch the data to be monitored
     * @param targetFieldName The field name of entity to be monitored
     * @param targetValue The value of the monitored entity, such that the callback returns fulfilled = true
     * @param timeoutCallback The callback called if monitoring timed out - signature (currentEntityData: object) => void | Promise<void>
     * @param fulfilledCallback The callback called if targetValue matches - signature (currentEntityData: object) => void | Promise<void>
     * @param startTime The starting timestamp, defaults to Date.now()
     * @returns {Promise<void>}
     */
    async startMonitor({
        key,
        asyncFetcher,
        targetFieldName,
        targetValue,
        timeoutCallback,
        fulfilledCallback,
        startTime = Date.now(),
    }) {
        const activeMonitor = this.activeMonitors.includes(key)
        if (activeMonitor) {
            console.debug(`Monitor [${key}] already active - ignored`)
            return Promise.resolve()
        }
        const monitor = new Monitor({
            key,
            abortAfterSecs: Vars.BlockchainWatcherTimeoutSecs,
            intervalSecs: Vars.BlockchainWatcherIntervalSecs,
        })
        monitor.start({
            asyncFetcher,
            predicateFn: state => state[targetFieldName] === targetValue,
            callback: async (data, fulfilled) => {
                await this.removeMonitor(key)
                if (!fulfilled) {
                    timeoutCallback(data)
                } else {
                    fulfilledCallback(data)
                }
            },
            startTime,
        })

        await this._monitorRepository.insert({
            id: key,
            expected: {
                [targetFieldName]: targetValue,
            },
            startTime,
        })

        this._activeMonitors.push(key)
    }

    async removeMonitor(key) {
        await this._monitorRepository.remove(key)
        this._activeMonitors = this._activeMonitors.filter(id => id !== id)
    }
}

export const monitorService = new MonitorService()
