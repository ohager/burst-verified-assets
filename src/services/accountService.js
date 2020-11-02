import { BurstApi } from '../context'
import { BurstValue } from '@burstjs/util'
import { generateMasterKeys, getAccountIdFromPublicKey } from '@burstjs/crypto'
import { AttachmentMessage } from '@burstjs/core'

export class AccountService {
    constructor() {
        this._accountApi = BurstApi.account
    }

    async getSuggestedFee() {
        const fees = await BurstApi.network.suggestFee()
        return BurstValue.fromPlanck(fees.standard.toString(10))
    }

    getKeys(passphrase) {
        const { publicKey, signPrivateKey } = generateMasterKeys(passphrase)
        return {
            publicKey,
            signPrivateKey,
        }
    }

    async getAccount(accountId) {
        return await BurstApi.account.getAccount(accountId)
    }

    async existsAccount(accountId) {
        try {
            await this.getAccount(accountId)
            return true
        } catch (e) {
            return false
        }
    }

    getAccountIdFromPassphrase(passphrase) {
        const { publicKey } = this.getKeys(passphrase)
        return getAccountIdFromPublicKey(publicKey)
    }

    async getBalance(accountId) {
        const { balanceNQT } = await this._accountApi.getAccountBalance(accountId)
        return BurstValue.fromPlanck(balanceNQT)
    }

    async activate({ recipientPublicKey, activationPassphrase }) {
        const recipientId = getAccountIdFromPublicKey(recipientPublicKey)
        const senderKeys = generateMasterKeys(activationPassphrase)

        const activationMessage = 'Welcome to Burst!'

        const attachment = new AttachmentMessage({
            messageIsText: true,
            message: activationMessage,
        })

        try {
            const suggestedFee = await this.getSuggestedFee()
            await BurstApi.transaction.sendAmountToSingleRecipient({
                // TODO: make activation fund configurable
                amountPlanck: BurstValue.fromBurst(0.5).getPlanck(),
                feePlanck: suggestedFee.getPlanck(),
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
}

export const accountService = new AccountService()
