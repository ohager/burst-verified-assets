<script>
    import WizardPage from '../../@common/wizard/WizardPage.svelte'
    import AccountInput from '../../@common/AccountInput.svelte'
    import PassphraseInput from '../../@common/PassphraseInput.svelte'
    import { setAccountWizardCanProceed } from '../accountWizardStore'
    import { setAccount } from '../../@common/accountStore'

    let isPassphraseValid = false
    let isAccountValid = false
    let accountId = ''
    let passphrase = ''

    $: {
        setAccountWizardCanProceed(false)
    }

</script>


<WizardPage>
    <h1 class="mdc-typography--headline6">Wait for your accounts activation</h1>
    <div class="fullwidth">
       TO DO wait for activation....
    </div>
</WizardPage>
