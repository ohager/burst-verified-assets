<script>
    export let height
    export let dark = false

    $: src = dark ? 'img/logo.black.svg' : 'img/logo.white.svg'
</script>

<div class="logo" style="height: {height}">
    <img {src} alt="Burst Verified Assets"/>
</div>

<style>
    .logo img {
        height: 100%;
    }
</style>
