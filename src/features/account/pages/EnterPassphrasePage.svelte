<script>
    import WizardPage from '../../_common/wizard/WizardPage.svelte'
    import Button, { Label } from '@smui/button'
    import AccountInput from '../../_common/AccountInput.svelte'
    import PassphraseInput from '../../_common/PassphraseInput.svelte'

    let isPassphraseValid = false
    let accountId = ''
    let passphrase = ''

</script>


<WizardPage>
    <h1 class="mdc-typography--headline6">Enter your passphrase</h1>
    <PassphraseInput bind:valid={isPassphraseValid}
                     bind:passphrase={passphrase}
                     account={accountId}
    />
</WizardPage>
