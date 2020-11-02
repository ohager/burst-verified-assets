<script>
    import Wizard from '../_common/wizard/Wizard.svelte'
    import { goto } from '@sapper/app'
    import { accountWizardCanProceed$, AccountWizardMode, accountWizardMode$ } from './accountWizardStore'

    import StartPage from './pages/StartPage.svelte'
    import EnterPassphrasePage from './pages/EnterPassphrasePage.svelte'
    import GeneratePassphrasePage from './pages/GeneratePassphrasePage.svelte'
    import { RouteHome } from '../../utils/routes'
    import { account$, clearAccount } from '../_common/accountStore'

    const ImportPages = [StartPage, EnterPassphrasePage]
    // TODO: correct pages
    const CreatePages = [StartPage, GeneratePassphrasePage, StartPage]

    let pages = ImportPages
    let currentPage
    $: {
        pages = $accountWizardMode$ === AccountWizardMode.Import
            ? ImportPages
            : CreatePages
    }
    $: canProceed = $accountWizardCanProceed$
    $: {
        console.log('currentPage:', currentPage)
    }

    function returnHome(){
        clearAccount()
        goto(RouteHome())
    }

    function finalize(){
        goto(RouteHome())
    }

</script>

<Wizard
    iconSrc="/img/tutorial.svg"
    title="Enter with Account"
    {pages}
    {canProceed}
    bind:currentPage={currentPage}
    on:finished={finalize}
    on:home={returnHome}
/>
