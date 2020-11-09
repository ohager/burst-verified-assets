<script>
    import Wizard from '../@common/wizard/Wizard.svelte'
    import { goto } from '@sapper/app'
    import { accountWizardCanProceed$, AccountWizardMode, accountWizardMode$ } from './accountWizardStore'

    import StartPage from './pages/StartPage.svelte'
    import EnterPassphrasePage from './pages/EnterPassphrasePage.svelte'
    import GeneratePassphrasePage from './pages/GeneratePassphrasePage.svelte'
    import SelectedAccountPage from './pages/SelectedAccountPage.svelte'
    import ActivateAccountPage from './pages/ActivateAccountPage.svelte'
    import { RouteHome } from '../../utils/routes'
    import { account$, clearAccount } from '../@common/accountStore'

    const ImportPages = [StartPage, EnterPassphrasePage]
    const CreatePages = [StartPage, GeneratePassphrasePage, SelectedAccountPage, ActivateAccountPage]

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
    iconSrc="/img/user.svg"
    title="Enter with Account"
    {pages}
    {canProceed}
    bind:currentPage={currentPage}
    on:finished={finalize}
    on:home={returnHome}
/>
