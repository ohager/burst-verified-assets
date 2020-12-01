/**
 * data struct
 *
 * id: string
 * [fieldName]:expectedValue
 * startTime: number
 */
export class Monitor {
    constructor(data) {
        Object.keys(data).forEach(k => this[k] = data[k])
    }

    static schema() {
        return 'id'
    }
}
