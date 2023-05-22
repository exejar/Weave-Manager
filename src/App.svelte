<main id="main" class="fixed h-screen w-screen rounded-xl overflow-clip text-neutral-200">
    <HeaderBar/>
    <div id="page-content" class="relative w-screen h-screen bg-neutral-800 flex flex-col items-center justify-around p-10 mb-10">
        <h1>Waiting for user to launch Minecraft</h1>
        <ModList/>
    </div>
</main>


<style>

</style>

<script>
    import HeaderBar from "./components/HeaderBar.svelte";
    import ModList from "./components/ModList.svelte";
</script>