<template>
    <div id="modlist" class="relative w-full h-80 rounded-xl overflow-y-scroll">
        {#each files as file}
            <div class="relative mod w-full h-12 flex items-center justify-center">
                {file.name}
            </div>
        {/each}
    </div>
</template>

<style>
    #modlist {
        box-shadow: inset 0 0 1rem rgb(0, 0, 0, 0.5);
        background: rgb(35, 35, 35, 255)
    }

    *::-webkit-scrollbar {
        background-color: transparent;
        width: 1.125rem;
    }
    *::-webkit-scrollbar-track {
        background-color: transparent;
    }

    *::-webkit-scrollbar-thumb {
        background-color: rgb(50, 45, 50);
        border-radius: 1.125rem;
        border: 0.4rem solid transparent;
        background-clip: padding-box;
    }
</style>

<script>
    import { onMount } from 'svelte'
    let files = []

    window.api.receive("fromMain", (data) => {
        if (data[0].includes('getModList')) {
            files = data[1]
        }
    })

    onMount(() => {
        window.api.send("toMain", 'getModList')
    })
</script>