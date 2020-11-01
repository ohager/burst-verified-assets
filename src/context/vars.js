export const Vars = {
    IsTestnet: process.env.SAPPER_APP_IS_TESTNET,
    IsMaintenance: process.env.SAPPER_APP_IS_MAINTENANCE,
    PeerUrl: process.env.SAPPER_APP_BURST_PEER_URL,
    ExplorerUrl: process.env.SAPPER_APP_EXPLORER_URL,
    BlockchainWatcherIntervalSecs: process.env.SAPPER_APP_BLOCKCHAIN_WATCHER_INTERVAL_SECS * 1000,
    BlockchainWatcherTimeoutSecs: process.env.SAPPER_APP_BLOCKCHAIN_WATCHER_TIMEOUT_SECS * 1000,
    DeeplinkRedirectServiceUrl: process.env.SAPPER_APP_DEEPLINK_REDIRECT_SERVICE_URL,
}
