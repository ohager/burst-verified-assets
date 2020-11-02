<script>
    import Wizard from '../_common/wizard/Wizard.svelte'
    import {accountWizard$} from './accountWizardStore'

    $: pages = $accountWizard$

</script>

<Wizard iconSrc="/img/tutorial.svg" title="Enter with Account" {pages} />
