<main id="main" class="fixed h-screen w-screen rounded-xl overflow-clip text-neutral-200">
    <HeaderBar/>
    <div id="page-content" class="relative w-screen h-screen bg-neutral-800 flex flex-col items-center justify-around p-10 mb-10">
        <h1>{weaveState}</h1>
        <ModList/>
    </div>
</main>


<style>

</style>

<script>
    import HeaderBar from "./components/HeaderBar.svelte";
    import ModList from "./components/ModList.svelte";
    import {onMount} from "svelte"

    let weaveState = 'Waiting for user to launch Minecraft'

    window.api.receive('fromMain', (data) => {
        if (data[0].includes('weaveState')) {
            weaveState = data[1]
        }
    })

    onMount(() => {
        window.api.send('toMain', 'checkUpdates')
    })
</script>