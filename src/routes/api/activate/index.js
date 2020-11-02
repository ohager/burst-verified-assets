import { serializeResponse } from '../__helpers__/serializeResponse'
import { accountService } from '../../../services'

export async function post(req, res, next) {
    // TODO: send message
    res.setHeader('Content-Type', 'application/json')
    res.end(serializeResponse({ status: 'ok' }))
    console.log('Sent activation message successfully')
}
