<script>
    import { beforeUpdate, createEventDispatcher } from 'svelte'
    import Button, { Label } from '@smui/button'
    import Page from '../Page.svelte'

    export let pages = []
    export let iconSrc = ''
    export let title = ''
    export let canProceed = true

    export let currentPage = 0
    const dispatch = createEventDispatcher()

    $: maxPageCount = pages.length - 1
    $: hasFinished = currentPage === maxPageCount

    function handleBack() {
        if (currentPage === 0) {
            dispatch('home')
        }
        currentPage = Math.max(--currentPage, 0)
    }

    function handleNext() {
        currentPage = Math.min(++currentPage, maxPageCount)
        if (hasFinished) {
            dispatch('finished')
        }
    }

    beforeUpdate(() => {
        currentPage = Math.min(currentPage, maxPageCount)
    })

</script>

<Page>
    <div class="header">
        <img src={iconSrc} alt={`${title} Icon`}>
        <div class="mdc-typography--headline6">{title}</div>
    </div>
    <div class="form">
        <div class="content">
            <svelte:component this={pages[currentPage]}/>
        </div>
        <div class="dots">
            {#each pages as page, index}
                <div class="dot" class:active={currentPage === index}></div>
            {/each}
        </div>
        <div class="form--footer">
            <Button on:click={handleBack}>
                <Label>{currentPage === 0 ? "Home" : "Back"}</Label>
            </Button>
            <Button on:click={handleNext} disabled={!canProceed}>
                <Label>{hasFinished ? "Finish" : "Next"}</Label>
            </Button>
        </div>
    </div>
</Page>


<style>
    .header {
        text-align: center;
        margin-bottom: 1rem;
    }

    .header img {
        height: 96px;
        width: 96px;
        text-align: center;
    }

    .form {
        display: block;
        max-width: 600px;
        margin: 0 auto
    }

    .content {
        display: flex;
        flex-direction: row;
        overflow: hidden;
    }

    .dots {
        width: 50%;
        margin: 0 auto;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        padding-top: 0.5rem;
    }

    .dots .dot {
        height: 8px;
        width: 8px;
        background-color: transparent;
        border: 1px solid var(--mdc-theme-secondary);
        border-radius: 50%;
        transition: all 250ms ease-in-out;
    }

    .dots .dot.active {
        background-color: var(--theme-light-background);
        transition: all 250ms ease-in-out;
    }

    .form--footer {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-top: 2rem;
    }

</style>
