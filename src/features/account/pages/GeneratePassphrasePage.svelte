<script>
    import {onMount} from 'svelte'
    import WizardPage from '../../@common/wizard/WizardPage.svelte'
    import Button, { Label } from '@smui/button'
    import { PassPhraseGenerator, hashSHA256, generateMasterKeys } from '@burstjs/crypto'
    import hashicon from 'hashicon'
    import { isClientSide } from '../../../utils/isClientSide'
    import { setAccountWizardCanProceed, setAccountWizardPhrase } from '../accountWizardStore'

    let passphrases = new Array(3)
    let hashiconContainer = new Array(3)
    let selectedIndex = 0

    async function createPassphrase() {
        const randomBytes = new Uint8Array(64)
        window.crypto.getRandomValues(randomBytes)
        const generator = new PassPhraseGenerator()
        const words = await generator.generatePassPhrase(randomBytes)
        return words.join(' ')
    }

    async function mountHashIcon(passphrase, targetEl) {
        const {publicKey} = generateMasterKeys(passphrase)
        const hashed = hashSHA256(publicKey)
        while (targetEl.lastElementChild) {
            targetEl.removeChild(targetEl.lastElementChild);
        }
        targetEl.appendChild(hashicon(hashed))
    }

    async function shuffle() {
        if (!isClientSide()) return
        hashiconContainer.forEach( (target, index) => {
            createPassphrase().then(phrase => {
                passphrases[index] = phrase
                mountHashIcon(phrase, target)
                selectedIndex = Math.ceil((Math.random() * 3)) - 1
            })
        })
        setAccountWizardCanProceed(true)
    }

    $: {
        setAccountWizardPhrase(passphrases[selectedIndex])
    }

    onMount(shuffle)

</script>

<WizardPage>
    <h1 class="mdc-typography--headline6">Create Account</h1>

    <p class="mdc-typography--body1">Click on an icon</p>

    <div class="icon-wrapper">
        {#each hashiconContainer as container, index}
            <div class='icon' class:selected={selectedIndex === index} bind:this={container} on:click={() => selectedIndex = index} />
        {/each}
    </div>

    <div class="button">
        <Button on:click={shuffle} color="secondary" variant="raised">
            <Label>Reshuffle</Label>
        </Button>
    </div>
</WizardPage>

<style>
    .icon-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-content: center;
        margin-bottom: 2rem;
    }

    .icon {
        padding: 0.5rem;
        transform: scale(1.0);
        transition: transform 250ms ease-in-out;
        cursor: pointer;
    }

    .icon:hover {
        transform: scale(1.05);
    }

    .selected {
        border: 2px solid red;
    }

    .button {
        text-align: center;
    }

</style>
