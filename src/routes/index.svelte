<script>
    import AccountFabButton from '../features/_common/AccountFabButton.svelte'
    import { goto, prefetch } from '@sapper/app'
    import { RouteAccount } from '../utils/routes'
    import { account$ } from '../features/_common/accountStore'

    import AssetView from '../features/intro/intro.svelte'

    function handleClick() {
        goto(RouteAccount())
    }

    const prefetchRoute = () => {
        prefetch(RouteAccount())
    }
</script>

<div>
    {#if !$account$.accountId.length}
        <AccountFabButton on:mouseenter={prefetchRoute} on:click={handleClick} />
        <AssetView />
    {:else}
        <h1>To do Start screen for "logged" user</h1>        
    {/if}
</div>



