<script>
    import WizardPage from '../../_common/wizard/WizardPage.svelte'
    import Radio from '@smui/radio'
    import FormField from '@smui/form-field'
    import { setCreatePages, setImportPages } from '../accountWizardStore'

    let selected = 'import'
    $:{
        if (selected === 'import') {
            setImportPages()
        } else {
            setCreatePages()

        }
    }

</script>


<WizardPage>
    <h1 class="mdc-typography--headline6">Use existing account or create one?</h1>
    <p class="mdc-typography--body1">
        Do you have an account already, or do you need to create a new one?
    </p>
    <p class="options mdc-typography--body1">
        <FormField>
            <Radio bind:group={selected} value="import" />
            <span slot="label">I HAVE ONE</span>
        </FormField>
        <FormField>
            <Radio bind:group={selected} value="create" />
            <span slot="label">I NEED ONE</span>
        </FormField>
    </p>
</WizardPage>

<style>
    .options {
        margin-top: 4rem;
        display: flex;
        flex-flow: row;
        justify-content: space-around;
    }
</style>
