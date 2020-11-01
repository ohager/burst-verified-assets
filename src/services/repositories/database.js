import Dexie from 'dexie'
import { Settings } from './models/settings'
import { TokenMonitor } from './models/tokenMonitor'

const database = new Dexie('app-store')

const Version = 1

const Schema = {
    settings: Settings.schema(),
    tokenMonitors: TokenMonitor.schema(),
}

database.version(Version).stores(Schema)
database.settings.mapToClass(Settings)
database.tokenMonitors.mapToClass(TokenMonitor)

export const db = database
