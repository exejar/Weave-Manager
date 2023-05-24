<main id="main" class="fixed h-screen w-screen rounded-xl overflow-clip text-neutral-200">
    {#if !installed}
        <InstallModal weaveFetch="{{download: downloadLink, version: downloadVersion}}"/>
    {/if}
    {#if !updated}
        <UpdateModal weaveFetch="{{download: downloadLink, version: downloadVersion}}"/>
    {/if}
    <HeaderBar/>
    <div id="page-content" class="relative w-screen h-screen bg-neutral-800 flex flex-col items-center justify-around p-10 mb-10">
        <h1>{weaveState}</h1>
        <ModList/>
    </div>
</main>

<script>
    import HeaderBar from "./components/HeaderBar.svelte";
    import ModList from "./components/ModList.svelte";
    import InstallModal from "./components/InstallModal.svelte";
    import {onMount} from "svelte"
    import UpdateModal from "./components/UpdateModal.svelte";

    let weaveState = 'Waiting for user to launch Minecraft'
    let installed = true
    let updated = true
    let downloadLink
    let downloadVersion

    const eventActions = {
        weaveState: (args) => {
            weaveState = args
        },
        checkUpdates: (args) => {
            const json = args[0]
            updated = false
            downloadLink = json.download
            downloadVersion = json.version
        },
        doInstall: (args) => {
            const json = args[0]
            installed = false
            downloadLink = json.download
            downloadVersion = json.version
        },
        update: () => {
            updated = true
        },
        install: () => {
            installed = true
            updated = true
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