import { db } from './database'

const DefaultDatabase = db

export class MonitorRepository {
    constructor(database = DefaultDatabase) {
        this._db = database.monitors
    }

    async getAll() {
        return this._db.toArray()
    }

    async get(id) {
        return this._db.get(id)
    }

    async insert(data) {
        await this._db.put(data)
    }

    async remove(id) {
        return await this._db.delete(id)
    }
}

export const monitorRepository = new MonitorRepository()
