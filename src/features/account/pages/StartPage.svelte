<script>
    import WizardPage from '../../_common/wizard/WizardPage.svelte'
    import Button, { Label } from '@smui/button'
    import { setCreatePages, setImportPages } from '../accountWizardStore'

    // TODO: adjust this

    function handleImport() {
        setImportPages()
    }

    function handleCreate() {
        setCreatePages()
    }

</script>


<WizardPage>
    <h1 class="mdc-typography--headline6">Use existing account or create one?</h1>
    <p class="mdc-typography--body1">
        Do you have an account already, or do you need to create a new one?
    </p>
    <p class="mdc-typography--body1">
        <Button on:click={handleImport}>
            <Label>I have one</Label>
        </Button>
        <Button on:click={handleCreate}>
            <Label>I need one</Label>
        </Button>

    </p>
</WizardPage>
