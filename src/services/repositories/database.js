import Dexie from 'dexie'
import { Settings } from './models/settings'
import { Monitor } from './models/monitor'

const database = new Dexie('app-store')

const Version = 1

const Schema = {
    settings: Settings.schema(),
    monitors: Monitor.schema(),
}

database.version(Version).stores(Schema)
database.settings.mapToClass(Settings)
database.monitors.mapToClass(Monitor)

export const db = database
