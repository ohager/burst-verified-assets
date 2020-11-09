<script>
    import List from '@smui/list'
    import IconButton from '@smui/icon-button'
    import WizardPage from '../../@common/wizard/WizardPage.svelte'
    import { accountWizardPhrase$, setAccountWizardCanProceed } from '../accountWizardStore'
    import { generateMasterKeys, getAccountIdFromPublicKey, hashSHA256 } from '@burstjs/crypto'
    import { convertNumericIdToAddress } from '@burstjs/util'
    import ListItem from '../../@common/ListItem.svelte'
    import { dispatchEvent } from '../../../utils/dispatchEvent'
    import { Events } from '../../../utils/events'
    import hashicon from 'hashicon'

    let infoList = ''
    let hashiconEl = null

    $: passphrase = $accountWizardPhrase$
    $: {
        setAccountWizardCanProceed(false)
        const keys = generateMasterKeys(passphrase)
        const publicKey = keys.publicKey
        const accountId = getAccountIdFromPublicKey(publicKey)
        const accountAddress = convertNumericIdToAddress(accountId)

        infoList = {
            'Address': { v: accountAddress },
            'Account Id': { v: accountId },
            'Public Key': { v: publicKey },
            'Passphrase': { v: passphrase },
        }

        if (hashiconEl) {
            const hashed = hashSHA256(publicKey)
            hashiconEl.appendChild(hashicon(hashed))
        }
    }

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(passphrase)
            dispatchEvent(Events.Success, 'Copied to Clipboard')
            setAccountWizardCanProceed(true)
        } catch (e) {
            dispatchEvent(Events.Error, 'Could not copy to Clipboard 🤷‍♂')
        }
    }
</script>

<WizardPage>
    <div class="inline fullwidth" style="justify-content: space-between">
        <h1 class="mdc-typography--headline6">Your Account</h1>
        <div bind:this={hashiconEl} style="height: 64px"/>
    </div>

    <List twoLine nonInteractive>
        {#each Object.keys(infoList) as key}
            <div class="item-wrapper inline">
                <ListItem {key} value={infoList[key].v} url={infoList[key].url} />
                {#if key === 'Passphrase'}
                    <IconButton class="material-icons" on:click={copy}>content_copy</IconButton>
                {/if}
            </div>
        {/each}
    </List>
    <section class="important">
        <img class="animation-pulse" src="/img/alarm.svg" alt="Important" />
        <p class="mdc-typography--body2">
            It is important that you <b>copy the passphrase and store it in a secure
            place</b>.
            You will need it to execute transactions and/or recover/import your account here or in other Burst
            applications
        </p>
    </section>
</WizardPage>


<style>
    .important {
        display: flex;
        flex-direction: row;
        align-items: center;
        border: 1px solid var(--theme-light-background);
        border-radius: 4px;
        padding: 0.5rem;
        margin-bottom: 0.5rem;
    }

    .important img {
        height: 64px;
    }
</style>
