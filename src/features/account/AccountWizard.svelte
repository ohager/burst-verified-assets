<script>
    import Wizard from '../_common/wizard/Wizard.svelte'
    import { AccountWizardMode, accountWizardMode$ } from './accountWizardStore'

    import StartPage from './pages/StartPage.svelte'
    import EnterPassphrasePage from './pages/EnterPassphrasePage.svelte'
    import GeneratePassphrasePage from './pages/GeneratePassphrasePage.svelte'

    const ImportPages = [StartPage, EnterPassphrasePage]
    // TODO: correct pages
    const CreatePages = [StartPage, GeneratePassphrasePage, StartPage]

    let pages = ImportPages
    $: {
        pages = $accountWizardMode$ === AccountWizardMode.Import
            ? ImportPages
            : CreatePages
    }

</script>

<Wizard iconSrc="/img/tutorial.svg" title="Enter with Account" {pages} />
