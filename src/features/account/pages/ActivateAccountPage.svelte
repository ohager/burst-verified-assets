<script>
    import Checkbox from '@smui/checkbox'
    import FormField from '@smui/form-field'
    import WizardPage from '../../@common/wizard/WizardPage.svelte'
    import { setAccountWizardCanProceed } from '../accountWizardStore'

    let shouldActivate = false

    $: {
        setAccountWizardCanProceed(shouldActivate)
    }

</script>


<WizardPage>
    <h1 class="mdc-typography--headline6">Almost finished</h1>
    <div class="fullwidth mdc-typography--body1">
        <p>
            Before you can use the new account, it needs to be activated.
            The process takes a few moments until the account is confirmed by the network
        </p>
        <small>
            Mind that <b>you must have stored the passphrase in a secure place</b>,
            otherwise you won't be able to do any transaction and your account become
            useless.
        </small>
    </div>
    <div class="centered" style="margin-top: 2rem">
        <FormField>
            <Checkbox bind:checked={shouldActivate} />
            <span slot="label">Yes, I want to activate my account</span>
        </FormField>
    </div>
</WizardPage>
