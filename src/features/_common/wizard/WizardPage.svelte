<script>
    import { fade } from 'svelte/transition'
    import { dispatchEvent } from '../../../utils/dispatchEvent'
    import { Events } from '../../../utils/events'

    function next(canProceed = true){
        dispatchEvent(Events.WizardCanProceed, {canProceed})
    }
</script>

<div class="wizard-page fullwidth" in:fade="{{ duration: 500 }}">
    <slot {next} />
</div>

<style>
    .wizard-page {
        min-height: 320px;
        max-height: 480px;
        overflow-y: auto;
    }
</style>
