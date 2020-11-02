import { writable } from 'svelte/store'

export const AccountWizardMode = {
    Import: 'import',
    Create: 'create',
}
export const accountWizardMode$ = writable(AccountWizardMode.Import)

export function setAccountWizardMode(mode) {
    accountWizardMode$.update(() => mode)
}

export const accountWizardCanProceed$ = writable(true)

export function setAccountWizardCanProceed(canProceed = true) {
    accountWizardCanProceed$.update(() => canProceed)
}

export const accountWizardPhrase$ = writable('')

export function setAccountWizardPhrase(phrase) {
    accountWizardPhrase$.update(() => phrase)
}
