import { serializeResponse } from '../__helpers__/serializeResponse'
import { sendActivationMessage } from './sendActivationMessage'

export async function post(req, res, next) {
    // TODO: send message
    console.log('Sending activation message')
    res.setHeader('Content-Type', 'application/json')
    res.end(serializeResponse({ status: 'ok' }))
}
