import { Vars } from './vars'

const explorerApi = path => `${Vars.ExplorerUrl}${path}`

export const ExplorerApi = {
    getBlockUrl: blockId => explorerApi(`block/${blockId}`),
    getAccountUrl: accountId => explorerApi(`address/${accountId}`),
}
