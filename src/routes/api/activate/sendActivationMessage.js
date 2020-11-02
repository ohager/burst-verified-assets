import { BurstValue } from '@burstjs/util'
import { getAccountIdFromPublicKey, generateMasterKeys } from '@burstjs/crypto'
import { AttachmentMessage } from '@burstjs/core'
import { BurstApi } from '../../../context'

export async function sendActivationMessage({ recipientPublicKey, activationPassphrase }) {
    const recipientId = getAccountIdFromPublicKey(recipientPublicKey)
    const senderKeys = generateMasterKeys(activationPassphrase)

    // TODO: define activation message
    const activationMessage = 'Welcome to Burst!'

    const attachment = new AttachmentMessage({
        messageIsText: true,
        message: activationMessage,
    })

    try {
        await BurstApi.transaction.sendAmountToSingleRecipient({
            // TODO: make activation fund configurable
            amountPlanck: BurstValue.fromBurst(0.5).getPlanck(),
            // TODO: take advantage of dynamic fee slot calculation
            feePlanck: BurstValue.fromBurst(0.147).getPlanck(),
            senderPublicKey: senderKeys.publicKey,
            senderPrivateKey: senderKeys.signPrivateKey,
            recipientId,
            recipientPublicKey,
            attachment,
        })
    } catch (e) {
        console.log(e)
    }
}
