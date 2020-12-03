export class Monitor {
    constructor({ key, intervalSecs, abortAfterSecs }) {
        this._key = key
        this._intervalSecs = intervalSecs
        this._abortAfterSecs = abortAfterSecs
        this._handle = undefined
    }

    _debug(msg) {
        console.debug(`[${this._key}] - ${msg}`)
    }

    start({ asyncFetcher, predicateFn, callback, startTime }) {
        this._debug('Monitoring...')
        this._handle = setTimeout(async () => {
            try {
                const data = await asyncFetcher()
                this._debug('Fetched', data)
                if (predicateFn(data)) {
                    this._debug('Monitor predicate fulfilled')
                    return callback(data, true)
                }
                const shouldRestart = (Date.now() - startTime) / 1000 < this._abortAfterSecs
                if (shouldRestart) {
                    this.start({ asyncFetcher, predicateFn, callback, startTime })
                } else {
                    this._debug('Monitor timed out')
                    callback(data, false)
                }
            } catch (e) {
                this._debug(`Monitor failed: ${e}`)
            }
        }, this._intervalSecs * 1000)
    }

    abort() {
        clearTimeout(this._handle)
    }
}
