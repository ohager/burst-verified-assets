<script>
    import {
        Page,
        appStore,
    } from './../_common'
    import { ThemeNames } from '../../utils/themeNames'

    const { theme$ } = appStore

    const openUrl = url => () => {
        window.open(url, '_blank')
    }

    $: dark = $theme$ === ThemeNames.Default

	let logo_src = 'img/BVA-logo.white.svg';
	let logo_name = 'Burst Verified Assets';
</script>


<Page>
    <section class="header">
        <img src="{logo_src}" alt="{logo_name}">
        <h1>A Burst token protocol extension</h1>
    </section>
    <section class="general">
        <p class="description">Discover unique tokenized assets, verified on the Burst platform.<br>Create or import a Burst compatible wallet to hold ownership of your new assets.</p>
        <p class="getburst">The Burstcoin to create transactions can be obtained from the token seller (if available), an exchange or from a Burstcoin faucet.</p>
    </section>
</Page>

<style>
    :root {
        font-family: Roboto, sans-serif;
    }

    .header {
        text-align: center;
        margin-bottom: 1rem;
    }

    .header img {
        height: 300pt;
        width: 300pt;
        text-align: center;
    }

    .general {
        margin: 0 auto;
        width: 80%;
        text-align: left;
    }

    .general .description {
        display: flex;
        justify-content: left;
    }

    .general .getburst {
        display: flex;
        justify-content: left;
        font-size: smaller;
    }

    @media (max-width: 480px) {
        .general {
            width: 100%;
        }
    }
</style>
