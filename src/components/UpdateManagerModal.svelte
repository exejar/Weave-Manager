<template>
    <div id="update-manager-modal" class="absolute top-0 left-0 w-screen h-screen flex justify-center items-center">
        <div id="content" class="relative w-[30rem] h-[12rem] bg-neutral-800 rounded-xl flex flex-col justify-around items-center">
            {#if !downloaded}
                <h1>Weave Manager is out-dated on your computer</h1>
                <h1>Downloading updates...</h1>
            {:else}
                <h1>Update downloaded. It will be installed on restart. Restart now?</h1>
                <div id="install-manager-button" class="w-[20rem] h-10 bg-blue-900 flex justify-center items-center rounded-xl cursor-pointer" on:click={updateManager} on:keydown={handleKeyDown}>
                    Restart Weave-Manager
                </div>
            {/if}
        </div>
    </div>
</template>

<script>
    export let downloaded = false
    function updateManager() {
        window.api.send('toMain', ['restartApp'])
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter' || event.keyCode === 13)
            updateManager()
    }
</script>

<style>
    #update-manager-modal {
        background-color: rgba(0, 0, 0, 25%);
        backdrop-filter: blur(8px);
    }
    #content {
        box-shadow: 0 0 2rem black;
    }
</style>