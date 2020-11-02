/**
 * A polling mechanism to check for unconfirmed tx and so..
 * TODO: make this reusable aka more generic
 */
export class TokenStateMonitor {
    constructor({ txId, intervalSecs, abortAfterSecs }) {
        this._txId = txId
        this._intervalSecs = intervalSecs
        this._abortAfterSecs = abortAfterSecs
        this._handle = undefined
    }

    _debug(msg) {
        console.debug(`[${this._txId}] - ${msg}`)
    }

    start({ predicateFn, callback, startTime }) {
        this._debug('Monitoring...')
        this._handle = setTimeout(async () => {
            try {
                // TODO: define data
                const data = {}
                if (predicateFn(data)) {
                    this._debug('Monitor predicate fulfilled')
                    return callback(data, true)
                }
                const shouldRestart = (Date.now() - startTime) / 1000 < this._abortAfterSecs
                if (shouldRestart) {
                    this.start({ predicateFn, callback, startTime })
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
