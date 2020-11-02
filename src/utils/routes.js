const toQueryString = json =>
    Object.keys(json)
        .map(k => `${k}=${encodeURIComponent(json[k])}`)
        .join('&')

export const withQuery = jsonArgs => route => {
    return `${route}?${toQueryString(jsonArgs)}`
}

export const RouteHome = () => '/'
export const RouteRegister = () => `/register`
export const RouteAccountTokens = (accountId, wantsRegister = false) =>
    `/account/${accountId}${wantsRegister ? '?register=true' : ''}`
export const RouteTutorial = () => '/tutorial'
export const RouteAbout = () => '/about'

export const RouteAccount = () => `/account`
