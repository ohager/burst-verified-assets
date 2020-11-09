<script>
    import WizardPage from '../../@common/wizard/WizardPage.svelte'
    import { accountWizardPhrase$ } from '../accountWizardStore'
    import { generateMasterKeys, getAccountIdFromPublicKey } from '@burstjs/crypto'
    import { convertNumericIdToAddress } from '@burstjs/util'

    let accountAddress = ''
    let accountId = ''
    let publicKey = ''

    $: {
        const keys = generateMasterKeys($accountWizardPhrase$)
        publicKey = keys.publicKey
        accountId = getAccountIdFromPublicKey(publicKey)
        accountAddress = convertNumericIdToAddress(accountId)
    }

</script>

<WizardPage>
    <h1 class="mdc-typography--headline6">Your Account</h1>
    <p class="mdc-typography--body1">
            {accountAddress}
    </p>

    <p class="mdc-typography--body1">
        {accountId}
    </p>

    <p class="mdc-typography--body1">
        {publicKey}
    </p>

    <p class="mdc-typography--body1">
        {$accountWizardPhrase$}
    </p>
</WizardPage>

