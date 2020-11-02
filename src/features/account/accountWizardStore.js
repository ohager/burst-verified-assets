import { writable } from 'svelte/store'

export const AccountWizardMode = {
    Import: 'import',
    Create: 'create',
}
export const accountWizardMode$ = writable(AccountWizardMode.Import)

export function setAccountWizardMode(mode) {
    accountWizardMode$.update(() => mode)
}

