<main id="main" class="fixed h-screen w-screen rounded-xl overflow-clip text-neutral-200">
    <HeaderBar/>
    <div id="page-content" class="relative w-screen h-screen bg-neutral-800 flex flex-col items-center justify-around p-10 mb-10">
        <h1>{weaveState}</h1>
        <CheckUpdateButton/>
        <ModList/>
    </div>
    {#if !installedLoader}
        <InstallLoaderModal weaveFetch="{{download: loaderDownloadLink, version: loaderDownloadVersion}}"/>
    {/if}
    {#if !updatedLoader}
        <UpdateLoaderModal weaveFetch="{{download: loaderDownloadLink, version: loaderDownloadVersion}}"/>
    {/if}
    {#if !updatedManager}
        <UpdateManagerModal downloaded="{managerUpdateDownloaded}"/>
    {/if}
    <RelaunchModal/>
</main>

<style>
</style>

<script>
    import HeaderBar from "./components/HeaderBar.svelte";
    import ModList from "./components/ModList.svelte";
    import InstallLoaderModal from "./components/InstallLoaderModal.svelte";
    import UpdateLoaderModal from "./components/UpdateLoaderModal.svelte";
    import CheckUpdateButton from "./components/CheckUpdateButton.svelte";
    import UpdateManagerModal from "./components/UpdateManagerModal.svelte";
    import {onMount} from "svelte"
    import RelaunchModal from "./components/RelaunchModal.svelte";

    let weaveState = 'Waiting for user to launch Minecraft'
    let installedLoader = true
    let updatedLoader = true
    let loaderDownloadLink
    let loaderDownloadVersion

    let updatedManager = true
    let managerUpdateDownloaded = false

    const eventActions = {
        weaveState: (args) => {
            weaveState = args
        },
        checkUpdates: (args) => {
            const json = args[0]
            updatedLoader = false
            loaderDownloadLink = json.download
            loaderDownloadVersion = json.version
        },
        doInstall: (args) => {
            const json = args[0]
            installedLoader = false
            loaderDownloadLink = json.download
            loaderDownloadVersion = json.version
        },
        update: () => {
            updatedLoader = true
        },
        install: () => {
            installedLoader = true
            updatedLoader = true
        },
        updateAvailable: () => {
            updatedManager = false
        },
        updateDownloaded: () => {
            managerUpdateDownloaded = true
        }
    }

    window.api.receive('fromMain', (data) => {
        const action = eventActions[data[0]]
        if (action)
            action(data.slice(1))
    })

    onMount(() => {
        window.api.send('toMain', ['checkUpdates'])
    })
</script>