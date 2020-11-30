import { serializeResponse } from './__helpers__/serializeResponse'

export async function get(req, res) {
    res.end(serializeResponse({ status: 'All fine' }))
}
