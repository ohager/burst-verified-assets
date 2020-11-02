<script>
    import { fade } from 'svelte/transition'
</script>

<div class="wizard-page" in:fade="{{ duration: 500 }}">
    <slot/>
</div>

<style>
    .wizard-page {
        min-height: 320px;
        max-height: 480px;
        overflow-y: auto;
    }
</style>
