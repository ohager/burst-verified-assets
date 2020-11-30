import { BurstApi } from '../context'
import { BurstValue } from '@burstjs/util'
import { generateMasterKeys, getAccountIdFromPublicKey } from '@burstjs/crypto'
import { HttpImpl } from '@burstjs/http'

export class AccountService {
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
        const { balanceNQT } = await BurstApi.account.getAccountBalance(accountId)
        return BurstValue.fromPlanck(balanceNQT)
    }

    async activate({ publicKey }) {
        const account = getAccountIdFromPublicKey(publicKey)
        const http = new HttpImpl(location.origin)
        await http.post('api/activate', { account, publicKey })
    }
}

export const accountService = new AccountService()
