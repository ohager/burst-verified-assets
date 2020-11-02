<script>
    import AccountFabButton from '../features/_common/AccountFabButton.svelte'
    import { goto, prefetch } from '@sapper/app'
    import { RouteAccount } from '../utils/routes'

    function handleClick() {
        goto(RouteAccount())
    }

    const prefetchRoute = () => {
        prefetch(RouteAccount())
    }
</script>

<div>
    <AccountFabButton on:mouseenter={prefetchRoute} on:click={handleClick}/>
</div>

