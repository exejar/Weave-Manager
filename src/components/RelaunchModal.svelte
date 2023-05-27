<template>
    {#if promptRelaunch}
        <div id="relaunch-modal" class="absolute top-0 left-0 w-screen h-screen flex justify-center items-center">
            <div id="content" class="relative w-[30rem] h-[16rem] bg-neutral-800 rounded-xl flex flex-col justify-around items-center text-center">
                <h1>Weave Manager has found a supported Minecraft process.<br>Target: {minecraftType}</h1>
                <h1>Relaunch with Weave?</h1>
                <div class="relative flex flex-col gap-2">
                    <div class="w-[12rem] h-10 bg-blue-900 flex justify-center items-center rounded-xl cursor-pointer" on:click={handleRelaunch}>
                        Relaunch with Weave
                    </div>
                    <div class="flex justify-center items-center cursor-pointer text-neutral-300" on:click={handleNoLaunch}>
                        No thanks
                    </div>
                </div>
            </div>
        </div>
    {/if}
</template>

<style>
    #relaunch-modal {
        background-color: rgba(0, 0, 0, 25%);
        backdrop-filter: blur(8px);
    }
    #content {
        box-shadow: 0 0 2rem black;
    }
</style>

<script>
    let promptRelaunch = false
    let minecraftType
    let minecraftProcess

    const eventActions = {
        foundMinecraftProcess: (args) => {
            promptRelaunch = true
            minecraftType = args[0].type
            minecraftProcess = args[0].process
        }
    }

    window.api.receive('fromMain', (data) => {
        const action = eventActions[data[0]]
        if (action)
            action(data.slice(1))
    })

    function handleNoLaunch() {
        promptRelaunch = false
        window.api.send('toMain', ['ignoreRelaunch'])
    }

    function handleRelaunch() {
        promptRelaunch = false
        window.api.send('toMain', ['relaunchWithWeave', {type: minecraftType, process: minecraftProcess}])
    }
</script>