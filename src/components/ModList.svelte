<template>
    <div id="modlist" class="relative w-full h-80 rounded-xl">
        <div id="list" class="w-full h-full overflow-y-scroll">
            {#each files as file}
                <div class="relative mod w-full h-12 flex items-center justify-center">
                    {file.name}
                </div>
            {/each}
        </div>

        <div id="mod-folder-button" class="absolute top-2 left-2 bg-blue-900 w-8 h-8 rounded-lg cursor-pointer">
            <div id="mod-icon" class="flex items-center justify-center w-full h-full" on:click={() => {window.api.send('toMain', ['openModFolder'])}}>
                <i class="fa-solid fa-folder"></i>
            </div>
            <span class="tooltiptext absolute w-28 rounded-lg text-center top-0 ml-10">Open Mods Folder</span>
        </div>
    </div>
</template>

<style>
    #modlist {
        box-shadow: inset 0 0 1rem rgb(0, 0, 0, 0.5);
        background: rgb(35, 35, 35, 255)
    }

    .tooltiptext {
        opacity: 0;
        pointer-events: none;
        background-color: rgba(0, 0, 0, 25%);
        transition: opacity 0.3s ease-in-out
    }
    #mod-folder-button:hover .tooltiptext {
        opacity: 1;
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

    onMount(async () => {
        async function updateModList() {
            files = await window.api.invoke('toMain', ['getModList'])
        }

        setInterval(updateModList, 1000)
    })
</script>