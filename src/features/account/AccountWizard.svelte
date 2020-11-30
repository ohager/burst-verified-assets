<script>
    import Wizard from '../@common/wizard/Wizard.svelte'
    import { goto } from '@sapper/app'
    import {
        accountWizardCanProceed$,
        accountWizardPhrase$,
        AccountWizardMode,
        accountWizardMode$,
    } from './accountWizardStore'

    import StartPage from './pages/StartPage.svelte'
    import EnterPassphrasePage from './pages/EnterPassphrasePage.svelte'
    import GeneratePassphrasePage from './pages/GeneratePassphrasePage.svelte'
    import SelectedAccountPage from './pages/SelectedAccountPage.svelte'
    import ActivateAccountPage from './pages/ActivateAccountPage.svelte'
    import { RouteHome } from '../../utils/routes'
    import { account$, clearAccount } from '../@common/accountStore'
    import { accountService } from '../../services'
    import { dispatchEvent } from '../../utils/dispatchEvent'
    import { Events } from '../../utils/events'

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

    function returnHome() {
        clearAccount()
        goto(RouteHome())
    }

    async function finalize() {
        try {
            if ($accountWizardMode$ === AccountWizardMode.Create) {
                let keys = accountService.getKeys($accountWizardPhrase$)
                await accountService.activate({ publicKey: keys.publicKey })
            }
            dispatchEvent(Events.Success, 'Requested Account Activation')
        } catch (e) {
            console.log('Activation Failed', e)
            dispatchEvent(Events.Error, 'Oh no. Activation Request failed 🤷‍♂')
        } finally {
            goto(RouteHome())
        }
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
