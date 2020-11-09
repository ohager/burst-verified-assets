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
        if(isAccountValid && isPassphraseValid){
            setAccountWizardCanProceed(true)
            setAccount(accountId)
        }
    }

</script>


<WizardPage>
    <h1 class="mdc-typography--headline6">Enter your account information</h1>
    <div class="fullwidth">
        <AccountInput bind:account={accountId}
                      bind:valid={isAccountValid}
        />
        <PassphraseInput bind:valid={isPassphraseValid}
                         bind:passphrase={passphrase}
                         account={accountId}
        />
    </div>
</WizardPage>
