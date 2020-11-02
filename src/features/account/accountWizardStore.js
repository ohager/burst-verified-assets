import { writable } from 'svelte/store'
import StartPage from './pages/StartPage.svelte'
import EnterPassphrasePage from './pages/EnterPassphrasePage.svelte'
import GeneratePassphrasePage from './pages/GeneratePassphrasePage.svelte'

const ImportPages = [StartPage, EnterPassphrasePage]
// TODO: correct pages
const CreatePages = [StartPage, GeneratePassphrasePage, StartPage]

export const accountWizard$ = writable(ImportPages)

export function setImportPages() {
    accountWizard$.update(() => ImportPages)
}

export function setCreatePages() {
    accountWizard$.update(() => CreatePages)
}
