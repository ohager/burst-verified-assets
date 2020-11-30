import { serializeResponse } from './__helpers__/serializeResponse'

export async function post(req, res, next) {
    res.end(serializeResponse({ status: 'All fine' }))
}
